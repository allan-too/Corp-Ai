"""
Script to download and prepare the Llama 2 model for fine-tuning
"""
import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def download_model():
    print("Downloading Llama 2 7B model...")
    
    # Get HF token
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        raise ValueError("HF_TOKEN not found in environment variables")
    
    # Configure quantization
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=False
    )
    
    # Download tokenizer
    print("Downloading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(
        "meta-llama/Llama-2-7b-chat-hf",
        token=hf_token
    )
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    
    # Save tokenizer
    print("Saving tokenizer...")
    tokenizer.save_pretrained("models/corp-llm")
    
    # Download model
    print("Downloading model...")
    model = AutoModelForCausalLM.from_pretrained(
        "meta-llama/Llama-2-7b-chat-hf",
        token=hf_token,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True
    )
    
    # Save model
    print("Saving model...")
    model.save_pretrained("models/corp-llm")
    
    print("Model preparation complete!")

if __name__ == "__main__":
    download_model()
