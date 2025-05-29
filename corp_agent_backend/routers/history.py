from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from auth.auth_controller import get_current_user
from db.models import User

router = APIRouter(prefix="/tools/history", tags=["history"])

class ToolUsage(BaseModel):
    id: str
    tool_id: str
    tool_name: str
    timestamp: datetime
    status: str
    input_data: Optional[dict] = None
    output_data: Optional[dict] = None

# Mock history data - in a real implementation, this would come from a database
MOCK_HISTORY = [
    {
        "id": "usage_1",
        "tool_id": "crm-leads",
        "tool_name": "Lead Generation",
        "timestamp": datetime.now(),
        "status": "completed",
        "input_data": {"industry": "Technology"},
        "output_data": {"leads": 5}
    }
]

@router.get("/", response_model=List[ToolUsage])
async def get_tool_history(current_user: User = Depends(get_current_user)):
    """Get tool usage history for the current user"""
    return MOCK_HISTORY
