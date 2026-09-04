import argparse
import os

import torch
from executorch.exir import to_edge
from transformers import AutoModelForCausalLM, AutoTokenizer


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        default="meta-llama/Llama-3.2-1B-Instruct",
        help="HuggingFace model id",
    )
    parser.add_argument(
        "--output",
        default="models/llama3_2_1b_q4.pte",
        help="Path for the exported .pte file",
    )
    parser.add_argument(
        "--max-seq-len",
        type=int,
        default=1024,
        help="Maximum sequence length",
    )
    args = parser.parse_args()

    tokenizer = AutoTokenizer.from_pretrained(args.model)
    model = AutoModelForCausalLM.from_pretrained(
        args.model,
        torch_dtype=torch.float16,
        low_cpu_mem_usage=True,
    )
    model.eval()

    example_inputs = (
        torch.randint(0, tokenizer.vocab_size, (1, args.max_seq_len)),
    )

    exported = torch.export.export(model, example_inputs)
    edge = to_edge(exported)

    program = edge.to_executorch()

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "wb") as f:
        f.write(program.buffer)

    print(f"Exported model to {args.output}")


if __name__ == "__main__":
    main()
