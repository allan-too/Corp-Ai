import json
import os
import torch # type: ignore
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType # type: ignore
from datasets import load_from_disk # type: ignore
from llm.configs.training_config import training_config as cfg # type: ignore

def load_config():
    return cfg

# Load tokenizer & base model
tokenizer = AutoTokenizer.from_pretrained(cfg['model_name_or_path'], use_fast=False)
model = AutoModelForCausalLM.from_pretrained(
    cfg['model_name_or_path'],
    torch_dtype=torch.float16,
    device_map='auto'
)

# Setup LoRA
dpeft_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    inference_mode=False,
    r=cfg['lora_rank'],
    lora_alpha=cfg['lora_alpha'],
    lora_dropout=cfg['lora_dropout']
)
model = get_peft_model(model, dpeft_config)

# Load dataset
dataset = load_from_disk('llm/data/processed')

def data_collator(features):
    import torch as _torch # type: ignore
    batch = { key: _torch.tensor([f[key] for f in features]) for key in features[0].keys() }
    return batch

# Training arguments
training_args = TrainingArguments(
    output_dir=cfg['output_dir'],
    per_device_train_batch_size=cfg['micro_batch_size'],
    gradient_accumulation_steps=cfg['batch_size'] // cfg['micro_batch_size'],
    num_train_epochs=cfg['num_epochs'],
    learning_rate=cfg['learning_rate'],
    logging_steps=50,
    save_total_limit=3,
    fp16=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    data_collator=data_collator,
)

if __name__ == '__main__':
    trainer.train()
    model.save_pretrained(cfg['output_dir'])