import {useCallback, useEffect, useRef, useState} from 'react';
import {
  ExecuTorchLLMEmitter,
  generate,
  loadModel,
  stopGeneration,
} from '../modules/ExecuTorchLLM';
import type {
  GenerationMetrics,
  LoadProgress,
  ModelPhase,
} from '../modules/types';

const MODEL_URI = 'models/llama3_2_1b_q4.pte';

interface UseLLMResult {
  phase: ModelPhase;
  progress: LoadProgress | null;
  metrics: GenerationMetrics | null;
  streamingText: string;
  error: string | null;
  load: () => Promise<void>;
  send: (prompt: string) => Promise<void>;
  stop: () => void;
}

export function useLLM(): UseLLMResult {
  const [phase, setPhase] = useState<ModelPhase>('idle');
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [metrics, setMetrics] = useState<GenerationMetrics | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startedAt = useRef<number>(0);
  const tokenCount = useRef(0);

  useEffect(() => {
    const onLoadProgress = (next: LoadProgress) => {
      setProgress(next);
    };
    const onLoadComplete = () => {
      setPhase('ready');
      setProgress(null);
    };
    const onToken = (token: string) => {
      tokenCount.current += 1;
      setStreamingText(prev => prev + token);
      const elapsedMs = Date.now() - startedAt.current;
      const tokensPerSecond =
        elapsedMs > 0 ? (tokenCount.current / elapsedMs) * 1000 : 0;
      setMetrics({
        tokensPerSecond,
        totalTokens: tokenCount.current,
        elapsedMs,
      });
    };
    const onGenerationComplete = () => {
      setPhase('ready');
    };
    const onError = (message: string) => {
      setError(message);
      setPhase('error');
    };

    const subscriptions = [
      ExecuTorchLLMEmitter.addListener('onLoadProgress', onLoadProgress),
      ExecuTorchLLMEmitter.addListener('onLoadComplete', onLoadComplete),
      ExecuTorchLLMEmitter.addListener('onToken', onToken),
      ExecuTorchLLMEmitter.addListener(
        'onGenerationComplete',
        onGenerationComplete,
      ),
      ExecuTorchLLMEmitter.addListener('onError', onError),
    ];

    return () => {
      subscriptions.forEach(sub => sub.remove());
    };
  }, []);

  const load = useCallback(async () => {
    setPhase('loading');
    setError(null);
    try {
      await loadModel(MODEL_URI);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load model');
      setPhase('error');
    }
  }, []);

  const send = useCallback(async (prompt: string) => {
    setPhase('generating');
    setError(null);
    setMetrics(null);
    setStreamingText('');
    tokenCount.current = 0;
    startedAt.current = Date.now();
    try {
      await generate(prompt, {temperature: 0.7, maxTokens: 256});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
      setPhase('error');
    }
  }, []);

  const stop = useCallback(() => {
    stopGeneration();
  }, []);

  return {phase, progress, metrics, streamingText, error, load, send, stop};
}
