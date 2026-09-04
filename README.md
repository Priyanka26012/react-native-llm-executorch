# Repose

An offline, private AI chat assistant for React Native. It runs a small language model (Llama 3.2 1B) entirely on-device using ExecuTorch — no network, no cloud, your data never leaves the phone.

## Features

- **Streaming chat** — tokens appear live as the model generates them
- **Fully offline** — works in airplane mode; no API keys or servers
- **Model load progress** — live percentage while the `.pte` model loads
- **Live metrics** — tokens/sec, token count, and latency per response
- **Tiny footprint** — int4 quantized 1B model (~700 MB)

## Tech

| Layer | Choice |
| --- | --- |
| App | React Native CLI, TypeScript |
| Runtime | [react-native-executorch](https://github.com/software-mansion/react-native-executorch) |
| Model | Llama 3.2 1B Instruct, int4 quantized to `.pte` |
| Export | Python + `torch.export` + ExecuTorch (`scripts/export_llama.py`) |
| Native bridge | NativeModule + NativeEventEmitter for token streaming |

## Getting started

```bash
npm install
npm run export-model        # produces models/llama3_2_1b_q4.pte
npm start                   # metro
npm run ios                 # or npm run android
```

Bundling the `.pte` as a native asset and the native module setup follow the react-native-executorch docs.

## How it works

1. `src/modules/ExecuTorchLLM.ts` wraps the native module and surfaces `onToken` / `onLoadProgress` / `onError` events.
2. `src/hooks/useLLM.ts` manages model lifecycle and accumulates streamed tokens into the response.
3. `src/screens/ChatScreen.tsx` renders bubbles, the progress bar, and the metrics strip.
