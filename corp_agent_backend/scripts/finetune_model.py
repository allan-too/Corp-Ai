"""
Script to fine-tune the Llama 2 model on business data
"""
import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

def prepare_dataset():
    """Prepare the dataset for fine-tuning"""
    # Load your business data here
    # This is a placeholder - replace with your actual data
    dataset = load_dataset("json", data_files="data/business_conversations.json")
    
    return dataset["train"]

def tokenize_dataset(dataset, tokenizer):
    """Tokenize the dataset"""
    def tokenize(example):
        # Format the conversation as expected by Llama 2
        text = f"<s>[INST] {example['instruction']} [/INST] {example['response']}</s>"
        tokenized = tokenizer(
            text,
            truncation=True,
            max_length=512,
            padding="max_length",
            return_tensors="pt"
        )
        return tokenized
    
    return dataset.map(
        tokenize,
        remove_columns=dataset.column_names,
        num_proc=os.cpu_count()
    )

def train():
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained("models/corp-llm")
    
    print("Loading model...")
    model = AutoModelForCausalLM.from_pretrained(
        "models/corp-llm",
        device_map="auto",
        trust_remote_code=True
    )
    
    # Configure LoRA for Llama 2
    lora_config = LoraConfig(
        r=16,  # rank
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )
    
    # Prepare model for training
    model = prepare_model_for_kbit_training(model)
    model = get_peft_model(model, lora_config)
    
    # Prepare dataset
    print("Preparing dataset...")
    dataset = prepare_dataset()
    tokenized_dataset = tokenize_dataset(dataset, tokenizer)
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir="models/corp-llm-loRA",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        fp16=True,
        save_steps=100,
        logging_steps=10,
        save_total_limit=3,
        push_to_hub=False,
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False)
    )
    
    print("Starting training...")
    trainer.train()
    
    print("Saving model...")
    trainer.save_model()
    
    print("Training complete!")

if __name__ == "__main__":
    train()
