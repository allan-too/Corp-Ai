"""
Authentication routes for email/password login and registration.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import datetime

from db.session import get_db
from db.models import User, Role
from .auth_controller import (
    authenticate_user,
    create_user,
    create_access_token,
    get_password_hash,
    get_user_by_email,
    get_current_user
)

# Pydantic models for request validation
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str = None

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=dict)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login with email and password
    """
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate access token
    token_expires = datetime.timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=token_expires
    )
    
    return {
        "accessToken": access_token,
        "tokenType": "bearer",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "is_verified": user.is_verified,
            "profile_picture_url": user.profile_picture_url
        }
    }

@router.post("/register", response_model=dict)
async def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user with email and password
    """
    # Check if user already exists
    existing_user = get_user_by_email(db, register_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Get the default user role
    user_role = db.query(Role).filter(Role.name == "user").first()
    if not user_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Default user role not found"
        )
    
    # Create the user
    hashed_password = get_password_hash(register_data.password)
    
    user = User(
        email=register_data.email,
        hashed_password=hashed_password,
        full_name=register_data.full_name,
        role_id=user_role.id,
        is_active=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Generate access token
    token_expires = datetime.timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=token_expires
    )
    
    return {
        "accessToken": access_token,
        "tokenType": "bearer",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "is_verified": user.is_verified,
            "profile_picture_url": user.profile_picture_url
        }
    }

@router.get("/me", response_model=dict)
async def get_current_user_info(
    user: User = Depends(get_current_user)
):
    """
    Get current user information
    """
    return {
        "email": user.email,
        "full_name": user.full_name,
        "is_verified": user.is_verified,
        "profile_picture_url": user.profile_picture_url,
        "oauth_provider": user.oauth_provider
    }
