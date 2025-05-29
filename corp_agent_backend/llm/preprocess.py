import os
from transformers import LlamaTokenizer
from datasets import load_dataset # type: ignore
from llm.configs.training_config import training_config # type: ignore

def preprocess(raw_dir: str, out_dir: str):
    os.makedirs(out_dir, exist_ok=True)
    tokenizer = LlamaTokenizer.from_pretrained(training_config['model_name_or_path'])
    dataset = load_dataset('json', data_files=os.path.join(raw_dir, '*.jsonl'), split='train')

    def tokenize_fn(example):
        return tokenizer(
            example['text'],
            truncation=True,
            max_length=training_config['max_seq_length'],
            padding='max_length'
        )

    tokenized = dataset.map(tokenize_fn, batched=True)
    tokenized.save_to_disk(out_dir)

if __name__ == '__main__':
    preprocess(
        raw_dir='llm/data/raw',
        out_dir='llm/data/processed'
    )