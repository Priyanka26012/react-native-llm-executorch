export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export type ModelPhase = 'idle' | 'loading' | 'ready' | 'generating' | 'error';

export interface LoadProgress {
  bytes: number;
  totalBytes: number;
  percent: number;
}

export interface GenerationMetrics {
  tokensPerSecond: number;
  totalTokens: number;
  elapsedMs: number;
}

export interface GenerateOptions {
  temperature: number;
  maxTokens: number;
}
