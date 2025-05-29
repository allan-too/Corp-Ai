"""
Social Media models for database
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

# Use absolute import instead of relative import
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from db.base_class import Base

class SocialMediaPost(Base):
    __tablename__ = "social_media_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    channel = Column(String, nullable=False)  # twitter, facebook, instagram, linkedin
    content = Column(Text, nullable=False)
    schedule_time = Column(String, nullable=False)
    status = Column(String, nullable=False)  # scheduled, published, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="social_media_posts")
