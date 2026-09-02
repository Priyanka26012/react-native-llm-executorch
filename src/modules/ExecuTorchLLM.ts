import {NativeEventEmitter, NativeModules} from 'react-native';
import type {
  GenerateOptions,
  LoadProgress,
} from './types';

interface ExecuTorchLLMNativeModule {
  loadModel(modelUri: string): Promise<void>;
  generate(prompt: string, options: GenerateOptions): Promise<string>;
  stop(): void;
}

export interface ExecuTorchLLMEvents {
  onLoadProgress: (progress: LoadProgress) => void;
  onLoadComplete: () => void;
  onToken: (token: string) => void;
  onGenerationComplete: (fullText: string) => void;
  onError: (message: string) => void;
}

const {ExecuTorchLLM} = NativeModules as {
  ExecuTorchLLM: ExecuTorchLLMNativeModule;
};

const emitter = new NativeEventEmitter(ExecuTorchLLM);

export const ExecuTorchLLMEmitter = emitter;

export async function loadModel(modelUri: string): Promise<void> {
  await ExecuTorchLLM.loadModel(modelUri);
}

export async function generate(
  prompt: string,
  options: GenerateOptions,
): Promise<string> {
  return ExecuTorchLLM.generate(prompt, options);
}

export function stopGeneration(): void {
  ExecuTorchLLM.stop();
}
