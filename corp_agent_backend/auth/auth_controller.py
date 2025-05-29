"""
Authentication controller for handling user registration, login, and OAuth.
"""
import os
import secrets
import datetime
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
import requests

from db.session import get_db
from db.models import User, Role
from auth.oauth_config import GOOGLE_CONFIG, GITHUB_CONFIG

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 bearer token scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Session storage for OAuth state tokens
oauth_states = {}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Create a new JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()

def get_user_by_oauth_id(db: Session, provider: str, oauth_id: str) -> Optional[User]:
    """Get a user by OAuth provider and ID."""
    return db.query(User).filter(
        User.oauth_provider == provider,
        User.oauth_id == oauth_id
    ).first()

def create_user(db: Session, email: str, password: Optional[str] = None, **kwargs) -> User:
    """Create a new user."""
    # Get the default user role
    user_role = db.query(Role).filter(Role.name == "user").first()
    if not user_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Default user role not found"
        )
    
    # Create the user
    hashed_password = get_password_hash(password) if password else None
    
    user = User(
        email=email,
        hashed_password=hashed_password,
        role_id=user_role.id,
        **kwargs
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = get_user_by_email(db, email)
    
    if not user or not user.hashed_password:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    """Get the current authenticated user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_email(db, email)
    
    if user is None:
        raise credentials_exception
    
    return user

def generate_oauth_state() -> str:
    """Generate a secure state token for OAuth CSRF protection."""
    return secrets.token_urlsafe(32)

def store_oauth_state(state: str, provider: str) -> None:
    """Store an OAuth state token with its provider."""
    # In a production app, use Redis or another distributed store with expiration
    oauth_states[state] = {
        "provider": provider,
        "created_at": datetime.datetime.utcnow()
    }

def verify_oauth_state(state: str, provider: str) -> bool:
    """Verify an OAuth state token."""
    state_data = oauth_states.get(state)
    
    if not state_data:
        return False
    
    if state_data["provider"] != provider:
        return False
    
    # Check if the state is expired (30 minutes)
    created_at = state_data["created_at"]
    if (datetime.datetime.utcnow() - created_at).total_seconds() > 1800:
        # Clean up expired state
        del oauth_states[state]
        return False
    
    # Clean up used state
    del oauth_states[state]
    
    return True

def get_google_user_info(access_token: str) -> dict:
    """Get user info from Google using an access token."""
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(GOOGLE_CONFIG["userinfo_uri"], headers=headers)
    
    if not response.ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve user info from Google"
        )
    
    return response.json()

def get_github_user_info(access_token: str) -> dict:
    """Get user info from GitHub using an access token."""
    headers = {
        "Authorization": f"token {access_token}",
        "Accept": "application/json"
    }
    
    # Get user profile
    response = requests.get(GITHUB_CONFIG["userinfo_uri"], headers=headers)
    
    if not response.ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve user info from GitHub"
        )
    
    user_data = response.json()
    
    # GitHub may not provide email in the user profile, so get emails separately
    if not user_data.get("email"):
        email_response = requests.get(GITHUB_CONFIG["email_uri"], headers=headers)
        
        if email_response.ok:
            emails = email_response.json()
            # Find primary email
            primary_email = next((e["email"] for e in emails if e.get("primary")), None)
            
            if primary_email:
                user_data["email"] = primary_email
    
    return user_data

def process_oauth_user(db: Session, provider: str, user_data: dict) -> User:
    """Process an OAuth user - create a new user or update existing one."""
    if provider == "google":
        email = user_data.get("email")
        oauth_id = user_data.get("sub")
        name = user_data.get("name")
        picture = user_data.get("picture")
    elif provider == "github":
        email = user_data.get("email")
        oauth_id = str(user_data.get("id"))
        name = user_data.get("name")
        picture = user_data.get("avatar_url")
    else:
        raise ValueError(f"Unsupported OAuth provider: {provider}")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email not provided by {provider}"
        )
    
    # Check if user exists by OAuth ID
    user = get_user_by_oauth_id(db, provider, oauth_id)
    
    if user:
        # Update user info
        user.profile_picture_url = picture
        user.full_name = name
        db.commit()
        return user
    
    # Check if user exists by email
    user = get_user_by_email(db, email)
    
    if user:
        # Link OAuth to existing user
        user.oauth_provider = provider
        user.oauth_id = oauth_id
        user.profile_picture_url = picture
        user.full_name = name
        user.is_verified = True  # OAuth providers verify emails
        db.commit()
        return user
    
    # Create new user
    return create_user(
        db=db,
        email=email,
        oauth_provider=provider,
        oauth_id=oauth_id,
        full_name=name,
        profile_picture_url=picture,
        is_verified=True
    )
