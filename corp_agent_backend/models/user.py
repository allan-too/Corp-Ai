from sqlalchemy import Column, String, DateTime, Boolean, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base
import uuid
from datetime import datetime
import enum

class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    first_name = Column(String)
    last_name = Column(String)
    company_name = Column(String)
    
    # Role relationship
    role_id = Column(String, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")
    
    # OAuth fields
    oauth_provider = Column(String)
    oauth_id = Column(String, unique=True, index=True)
    profile_picture_url = Column(String)
    
    # Subscription fields
    subscription_plan = Column(SQLEnum(SubscriptionPlan), default=SubscriptionPlan.FREE)
    subscription_start_date = Column(DateTime)
    subscription_end_date = Column(DateTime)
    stripe_customer_id = Column(String)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Password reset
    reset_token = Column(String, unique=True, index=True)
    reset_token_expires = Column(DateTime)
    
    # Relationships
    subscriptions = relationship("UserSubscription", back_populates="user")
    tool_history = relationship("ToolHistory", back_populates="user")
    finance_reports = relationship("FinanceReport", back_populates="user")
    budgets = relationship("Budget", back_populates="user")
    social_media_posts = relationship("SocialMediaPost", back_populates="user")
