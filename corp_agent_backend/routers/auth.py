from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from db.session import get_db
from db.models import User, SubscriptionPlan, Role, UserSubscription
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from schemas.auth import UserCreate, UserLogin, Token as TokenResponse, PasswordReset, PasswordResetConfirm
import logging
from config import settings
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Configure logging
logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Router
router = APIRouter(prefix="/auth", tags=["auth"])

# Response models
class UserInfo(TokenResponse):
    """User information response model."""
    pass

class SubscriptionResponse(BaseModel):
    """Subscription response model."""
    id: str
    plan_name: str
    start_date: str
    end_date: str
    is_active: bool

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    logger.debug(f"Created access token for user: {data.get('sub')}")
    return encoded_jwt

def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

async def get_current_user(response: Response, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            logger.warning("Token missing 'sub' claim")
            raise credentials_exception
    except JWTError as e:
        logger.warning(f"JWT validation error: {str(e)}")
        raise credentials_exception
    
    user = get_user(db, email=email)
    if user is None:
        logger.warning(f"User not found: {email}")
        raise credentials_exception
    
    logger.debug(f"User authenticated: {email}")
    return user

# Routes
@router.post("/register", response_model=TokenResponse)
async def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.info(f"Processing registration request {request_id}")
    
    try:
        # Check if user already exists
        existing_user = get_user(db, user_data.email)
        if existing_user:
            logger.warning(f"Registration failed: Email already exists - {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Get user role (default to regular user)
        try:
            role = db.query(Role).filter(Role.name == "user").one()
        except NoResultFound:
            logger.error("Default user role not found in database")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Role configuration error"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            company_name=user_data.company_name,
            role_id=role.id,
            is_active=True,
            is_verified=False  # Requires email verification
        )
        
        # Add and commit user
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Get basic subscription plan
        basic_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == "basic").first()
        if basic_plan:
            # Create free subscription
            subscription = UserSubscription(
                user_id=new_user.id,
                plan_id=basic_plan.id,
                start_date=datetime.utcnow(),
                end_date=datetime.utcnow() + timedelta(days=basic_plan.duration_days),
                active=True
            )
            db.add(subscription)
            db.commit()
            db.refresh(subscription)
        
        # Create access token with role and subscription info
        token_data = {
            "sub": new_user.email,
            "role": role.name,
            "is_admin": False,
            "plan": basic_plan.name if basic_plan else None
        }
        
        access_token = create_access_token(data=token_data)
        
        logger.info(f"Registration successful - Email: {new_user.email} - Role: {role.name}")
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=str(new_user.id),
            email=new_user.email,
            role=role.name,
            subscription_plan=basic_plan.name if basic_plan else None,
            subscription_end_date=subscription.end_date.isoformat() if basic_plan else None
        )
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Registration failed - Email: {user_data.email} - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. Please try again."
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error during registration - Email: {user_data.email} - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
    
    logger.debug(f"Registration attempt for email={email}, role={role_name}")
    
    # Validate required fields
    if not email or not password:
        error_msg = "Email and password are required"
        logger.warning(f"Registration failed: {error_msg} - Request ID: {request_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Check if user already exists
    db_user = get_user(db, email=email)
    if db_user:
        error_msg = "Email already registered"
        logger.warning(f"Registration failed: {error_msg} - Email: {email} - Request ID: {request_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)
    
    # Get the role from the database or create default role
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        # Use default role if specified role doesn't exist
        role = db.query(Role).filter(Role.name == "user").first()
        if not role:
            # Create a default role if none exists
            role = Role(name="user")
            db.add(role)
            db.commit()
    
    hashed_password = get_password_hash(password)
    db_user = User(
        email=email, 
        hashed_password=hashed_password, 
        role_id=role.id,
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=TokenResponse)
async def login(request: Request, user_data: UserLogin, db: Session = Depends(get_db)):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.info(f"Processing login request {request_id}")
    
    try:
        # Get user
        user = get_user(db, user_data.email)
        if not user:
            logger.warning(f"Login failed: User not found - Email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify account status
        if not user.is_active:
            logger.warning(f"Login failed: Account inactive - Email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is inactive"
            )
        
        # Verify password
        if not verify_password(user_data.password, user.hashed_password):
            logger.warning(f"Login failed: Invalid password - Email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Get user role
        try:
            role = db.query(Role).filter(Role.id == user.role_id).one()
        except NoResultFound:
            logger.error(f"Role not found for user - Email: {user_data.email} - Role ID: {user.role_id}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Role configuration error"
            )
        
        # Get active subscription
        active_subscription = (
            db.query(UserSubscription)
            .join(SubscriptionPlan)
            .filter(
                UserSubscription.user_id == user.id,
                UserSubscription.active == True,
                UserSubscription.end_date > datetime.utcnow()
            )
            .first()
        )
        
        # Create token with role and subscription info
        token_data = {
            "sub": user.email,
            "role": role.name,
            "is_admin": role.name == "admin",
            "plan": active_subscription.plan.name if active_subscription else None
        }
        
        access_token = create_access_token(data=token_data)
        
        logger.info(f"Login successful - Email: {user.email} - Role: {role.name}")
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=str(user.id),
            email=user.email,
            role=role.name,
            subscription_plan=active_subscription.plan.name if active_subscription else None,
            subscription_end_date=active_subscription.end_date.isoformat() if active_subscription else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login - Email: {user_data.email} - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
        
@router.get("/me", response_model=UserInfo)
async def get_current_user_info(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Endpoint to validate the token and return the current user info."""
    try:
        # Get user role
        role = db.query(Role).filter(Role.id == current_user.role_id).one()
        
        # Get active subscription
        active_subscription = (
            db.query(UserSubscription)
            .join(SubscriptionPlan)
            .filter(
                UserSubscription.user_id == current_user.id,
                UserSubscription.active == True,
                UserSubscription.end_date > datetime.utcnow()
            )
            .first()
        )
        
        return UserInfo(
            access_token="",  # Don't return a new token
            token_type="bearer",
            user_id=str(current_user.id),
            email=current_user.email,
            role=role.name,
            subscription_plan=active_subscription.plan.name if active_subscription else None,
            subscription_end_date=active_subscription.end_date.isoformat() if active_subscription else None
        )
    except Exception as e:
        logger.error(f"Error in get_current_user_info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving user information"
        )

@router.post("/subscribe", response_model=SubscriptionResponse)
async def subscribe(request: Request, subscription_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.info(f"Processing subscription request {request_id} for user {current_user.email}")

    plan_id = subscription_data.get("plan_id")
    if not plan_id:
        error_msg = "Plan ID is required"
        logger.warning(f"Subscription failed: {error_msg} - User: {current_user.email} - Request ID: {request_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)
    
    try:
        # Get the subscription plan from the database
        subscription_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
        if not subscription_plan:
            error_msg = f"Subscription plan with ID {plan_id} not found"
            logger.warning(f"Subscription failed: {error_msg} - User: {current_user.email} - Request ID: {request_id}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_msg)
        
        logger.debug(f"Found subscription plan: {subscription_plan.name} - Duration: {subscription_plan.duration_days} days")
        
        # Check if user already has an active subscription to this plan
        existing_subscription = db.query(UserSubscription).filter(
            UserSubscription.user_id == current_user.id,
            UserSubscription.plan_id == subscription_plan.id,
            UserSubscription.active == True,
            UserSubscription.end_date > datetime.utcnow()
        ).first()
        
        if existing_subscription:
            logger.info(f"User already has an active subscription to plan {subscription_plan.name} - User: {current_user.email}")
            return {"plan": subscription_plan.name, "active": True, "message": "Subscription already active"}
        
        # Calculate end date based on plan duration
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=subscription_plan.duration_days)
        
        # Create a new subscription for the user
        user_subscription = UserSubscription(
            user_id=current_user.id,
            plan_id=subscription_plan.id,
            start_date=start_date,
            end_date=end_date,
            active=True
        )
        
        db.add(user_subscription)
        db.commit()
        
        logger.info(f"Subscription successful - User: {current_user.email} - Plan: {subscription_plan.name} - Request ID: {request_id}")
        return {"plan": subscription_plan.name, "active": True, "end_date": end_date.isoformat()}
        
    except Exception as e:
        db.rollback()
        error_msg = f"Error processing subscription: {str(e)}"
        logger.error(f"{error_msg} - User: {current_user.email} - Request ID: {request_id}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error processing subscription")


@router.get("/subscription-plans")
async def get_subscription_plans(db: Session = Depends(get_db)):
    """
    Get all available subscription plans
    """
    try:
        # Get all subscription plans from the database
        subscription_plans = db.query(SubscriptionPlan).all()
        
        # Format the response
        plans = [
            {
                "id": str(plan.id),
                "name": plan.name,
                "description": plan.description,
                "price": plan.price,
                "duration_days": plan.duration_days,
                "features": plan.features
            }
            for plan in subscription_plans
        ]
        
        return plans
    except Exception as e:
        logger.error(f"Error fetching subscription plans: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching subscription plans"
        )
