"""
Base models for CORP AI - Defines base models to avoid circular imports
"""
from sqlalchemy import Column, String, DateTime, Boolean, Enum as SQLEnum, ForeignKey, Float, Integer, JSON, Text
from db.base_class import Base
import uuid
from datetime import datetime
import enum

# Enums
class SubscriptionPlanEnum(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

# Base models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    first_name = Column(String)
    last_name = Column(String)
    full_name = Column(String)
    company_name = Column(String)
    
    # Role relationship
    role_id = Column(Integer, ForeignKey("roles.id"))
    
    # OAuth fields
    oauth_provider = Column(String)
    oauth_id = Column(String, unique=True, index=True)
    profile_picture_url = Column(String)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False)

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False)
    price = Column(Float, default=0.0)
    duration_days = Column(Integer, default=30)
    features = Column(Text, default='[]')

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    active = Column(Boolean, default=True)
    payment_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ToolHistory(Base):
    __tablename__ = "tool_history"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    tool_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
