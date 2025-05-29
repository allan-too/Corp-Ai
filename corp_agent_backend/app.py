from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, tools, history, chat, social_media
# Temporarily disabled finance module due to missing LLM model
# from routers import finance
from config import settings
import logging

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("corp_ai")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="CORP AI Agent API provides authentication, subscription management, and various business tools.",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Register routers
app.include_router(auth.router)
app.include_router(tools.router)
app.include_router(history.router)
app.include_router(chat.router)
# Temporarily disabled finance router
# app.include_router(finance.router)
app.include_router(social_media.router)

# Root route handler
@app.get("/", tags=["system"])
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "CORP AI Agent API",
        "status": "running"
    }

# Startup event
@app.on_event("startup")
async def startup():
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")

# Shutdown event for cleanup
@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"Shutting down {settings.APP_NAME}")
