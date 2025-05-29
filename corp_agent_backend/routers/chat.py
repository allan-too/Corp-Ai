from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from auth.auth_controller import get_current_user
from db.models import User
from db.session import SessionLocal

router = APIRouter(tags=["chat"])

class ChatMessage(BaseModel):
    id: str
    user_id: str
    content: str
    role: str  # 'user' or 'assistant'
    timestamp: datetime

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

# In-memory chat storage (replace with database in production)
user_chats: Dict[str, List[ChatMessage]] = {}

@router.post("/query", response_model=ChatResponse)
async def query_ai(request: ChatRequest, current_user: User = Depends(get_current_user)):
    """Query the AI assistant"""
    user_id = str(current_user.id)
    
    # Initialize chat history for new users
    if user_id not in user_chats:
        user_chats[user_id] = []
    
    # Add user message to history
    user_chats[user_id].append(ChatMessage(
        id=f"msg_{len(user_chats[user_id])}",
        user_id=user_id,
        content=request.prompt,
        role="user",
        timestamp=datetime.now()
    ))
    
    # Generate AI response (replace with actual AI model in production)
    ai_response = f"This is a mock response to: {request.prompt}"
    
    # Add AI response to history
    user_chats[user_id].append(ChatMessage(
        id=f"msg_{len(user_chats[user_id])}",
        user_id=user_id,
        content=ai_response,
        role="assistant",
        timestamp=datetime.now()
    ))
    
    return ChatResponse(response=ai_response)

@router.get("/history", response_model=List[ChatMessage])
async def get_chat_history(current_user: User = Depends(get_current_user)):
    """Get chat history for the current user"""
    user_id = str(current_user.id)
    return user_chats.get(user_id, [])
