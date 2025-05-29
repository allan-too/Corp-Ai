from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "CORP AI Agent API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # JWT settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-replace-in-production")
    JWT_ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./corp_ai.db")
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "False").lower() == "true"
    RATE_LIMIT_REDIS_URL: Optional[str] = os.getenv("RATE_LIMIT_REDIS_URL")
    RATE_LIMIT_DEFAULT_LIMIT: int = int(os.getenv("RATE_LIMIT_DEFAULT_LIMIT", "100"))
    RATE_LIMIT_DEFAULT_PERIOD: int = int(os.getenv("RATE_LIMIT_DEFAULT_PERIOD", "3600"))  # 1 hour in seconds
    
    # Redis settings
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    
    # AI model settings
    CORP_LLM_PATH: str = os.getenv("CORP_LLM_PATH", "./models/corp-llm-loRA")
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "db/chroma")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Allow extra fields from .env file

# Create settings instance
settings = Settings()
