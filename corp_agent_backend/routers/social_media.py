"""
Social Media API Router - Handles social media post scheduling and management
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional, List
from auth.auth_controller import get_current_user
from models.user import User
from models.social_media import SocialMediaPost
from tools.social_media_tool import SocialMediaTool
from db.session import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/tools/social_media",
    tags=["social_media"],
    responses={404: {"description": "Not found"}}
)

social_media_tool = SocialMediaTool()

# Request and response models
class SocialMediaPostRequest(BaseModel):
    channel: str
    content: str
    schedule_time: str

class SocialMediaPostResponse(BaseModel):
    id: Optional[int] = None
    channel: str
    content: str
    schedule_time: str
    status: str
    created_at: Optional[datetime] = None

class ContentGenerationRequest(BaseModel):
    prompt: str
    channel: Optional[str] = None
    tone: Optional[str] = None

class ContentGenerationResponse(BaseModel):
    content: str

# Check if user has access to social media tools
def check_social_media_access(user: User = Depends(get_current_user)):
    """Verify user has appropriate subscription for social media tools"""
    if user.subscription_plan not in ['professional', 'enterprise'] and user.role != 'admin':
        raise HTTPException(
            status_code=403,
            detail="Social media tools require a Professional or Enterprise subscription"
        )
    return user

@router.post("", response_model=SocialMediaPostResponse)
async def create_post(
    post_data: SocialMediaPostRequest,
    user: User = Depends(check_social_media_access),
    db: Session = Depends(get_db)
):
    """Create a new social media post"""
    try:
        # Create post record
        new_post = SocialMediaPost(
            user_id=user.id,
            channel=post_data.channel,
            content=post_data.content,
            schedule_time=post_data.schedule_time,
            status="scheduled"
        )
        
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        
        # Schedule the post using the social media tool
        background_tasks = BackgroundTasks()
        background_tasks.add_task(
            social_media_tool.schedule_post,
            new_post.id,
            post_data.channel,
            post_data.content,
            post_data.schedule_time
        )
        
        return SocialMediaPostResponse(
            id=new_post.id,
            channel=new_post.channel,
            content=new_post.content,
            schedule_time=new_post.schedule_time,
            status=new_post.status,
            created_at=new_post.created_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create social media post: {str(e)}"
        )

@router.get("/posts", response_model=List[SocialMediaPostResponse])
async def get_posts(
    user: User = Depends(check_social_media_access),
    db: Session = Depends(get_db)
):
    """Get all social media posts for the current user"""
    try:
        posts = db.query(SocialMediaPost).filter(SocialMediaPost.user_id == user.id).all()
        
        return [
            SocialMediaPostResponse(
                id=post.id,
                channel=post.channel,
                content=post.content,
                schedule_time=post.schedule_time,
                status=post.status,
                created_at=post.created_at
            ) for post in posts
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve posts: {str(e)}"
        )

@router.post("/generate", response_model=ContentGenerationResponse)
async def generate_content(
    request: ContentGenerationRequest,
    user: User = Depends(check_social_media_access)
):
    """Generate social media content using AI"""
    try:
        content = await social_media_tool.generate_content(
            request.prompt,
            request.channel,
            request.tone
        )
        return ContentGenerationResponse(content=content)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate content: {str(e)}"
        )

@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: int,
    user: User = Depends(check_social_media_access),
    db: Session = Depends(get_db)
):
    """Delete a scheduled social media post"""
    try:
        post = db.query(SocialMediaPost).filter(
            SocialMediaPost.id == post_id,
            SocialMediaPost.user_id == user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=404,
                detail="Post not found"
            )
        
        # If post is already published, we can't delete it
        if post.status == "published":
            raise HTTPException(
                status_code=400,
                detail="Cannot delete a published post"
            )
        
        db.delete(post)
        db.commit()
        
        return {"message": "Post deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete post: {str(e)}"
        )
