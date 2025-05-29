from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from auth.auth_controller import get_current_user
from db.models import User
from db.session import get_db
from sqlalchemy.orm import Session
import uuid

router = APIRouter(prefix="/tools/history", tags=["tools"])

class ToolUsageCreate(BaseModel):
    toolId: str
    name: str
    category: str

class ToolUsage(BaseModel):
    id: str
    toolId: str
    name: str
    category: str
    timestamp: str
    userId: str

class ToolsHistoryResponse(BaseModel):
    history: List[ToolUsage]

from models.tool_history import ToolHistory
from datetime import datetime

@router.get("", response_model=ToolsHistoryResponse)
async def get_tool_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get tool history for the current user from database
    history = db.query(ToolHistory).filter(
        ToolHistory.user_id == current_user.id
    ).order_by(ToolHistory.timestamp.desc()).all()
    
    return {"history": [
        ToolUsage(
            id=h.id,
            toolId=h.tool_id,
            name=h.name,
            category=h.category,
            timestamp=h.timestamp.isoformat(),
            userId=h.user_id
        ) for h in history
    ]}

@router.post("", response_model=ToolUsage)
async def record_tool_usage(
    usage: ToolUsageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create a new tool usage record
    tool_history = ToolHistory(
        tool_id=usage.toolId,
        name=usage.name,
        category=usage.category,
        user_id=current_user.id
    )
    
    db.add(tool_history)
    db.commit()
    db.refresh(tool_history)
    
    return ToolUsage(
        id=tool_history.id,
        toolId=tool_history.tool_id,
        name=tool_history.name,
        category=tool_history.category,
        timestamp=tool_history.timestamp.isoformat(),
        userId=tool_history.user_id
    )

@router.delete("", status_code=204)
async def clear_tool_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Delete all tool history for the current user
    db.query(ToolHistory).filter(
        ToolHistory.user_id == current_user.id
    ).delete()
    db.commit()
    return {"status": "success"}
