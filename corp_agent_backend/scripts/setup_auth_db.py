"""
Script to set up the authentication database with required tables and seed data.
This ensures that the registration and login functionality works properly.
"""
import sys
import os
import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.session import get_db, engine
from db.base_class import Base
from models.base_models import User, Role, SubscriptionPlan, UserSubscription
from auth.utils import get_password_hash

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_tables():
    """Create all tables if they don't exist"""
    logger.info("Creating database tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")

def create_roles(db: Session):
    """Create default roles if they don't exist"""
    logger.info("Creating default roles...")
    roles = ["admin", "user"]
    
    for role_name in roles:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name)
            db.add(role)
            logger.info(f"Created role: {role_name}")
    
    try:
        db.commit()
        logger.info("Roles created successfully")
    except IntegrityError:
        db.rollback()
        logger.error("Error creating roles")

def create_subscription_plans(db: Session):
    """Create subscription plans if they don't exist"""
    logger.info("Creating subscription plans...")
    plans = [
        {
            "name": "basic",
            "description": "Basic plan with limited features",
            "price": 0.0,
            "duration_days": 30,
            "features": ["basic_tools"]
        },
        {
            "name": "professional",
            "description": "Professional plan with advanced features",
            "price": 19.99,
            "duration_days": 30,
            "features": ["basic_tools", "hr_tools", "reviews", "social_media"]
        },
        {
            "name": "enterprise",
            "description": "Enterprise plan with all features",
            "price": 49.99,
            "duration_days": 30,
            "features": ["basic_tools", "hr_tools", "reviews", "social_media", "legal", "supply_chain"]
        }
    ]
    
    for plan_data in plans:
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == plan_data["name"]).first()
        if not plan:
            plan = SubscriptionPlan(
                name=plan_data["name"],
                price=plan_data["price"],
                duration_days=plan_data["duration_days"],
                features=str(plan_data["features"])
            )
            db.add(plan)
            logger.info(f"Created subscription plan: {plan_data['name']}")
    
    try:
        db.commit()
        logger.info("Subscription plans created successfully")
    except IntegrityError:
        db.rollback()
        logger.error("Error creating subscription plans")

def create_admin_user(db: Session):
    """Create admin user if it doesn't exist"""
    logger.info("Creating admin user...")
    admin_email = "admin@corpai.com"
    admin_user = db.query(User).filter(User.email == admin_email).first()
    
    if not admin_user:
        # Get admin role
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            logger.error("Admin role not found. Please create roles first.")
            return
        
        # Create admin user
        hashed_password = get_password_hash("Admin@123")
        admin_user = User(
            email=admin_email,
            hashed_password=hashed_password,
            first_name="Admin",
            last_name="User",
            full_name="Admin User",
            company_name="CORP AI",
            role_id=admin_role.id,
            is_active=True,
            is_verified=True
        )
        db.add(admin_user)
        
        try:
            db.commit()
            db.refresh(admin_user)
            logger.info(f"Created admin user: {admin_email}")
            
            # Add enterprise subscription for admin
            enterprise_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == "enterprise").first()
            if enterprise_plan:
                try:
                    subscription = UserSubscription(
                        user_id=admin_user.id,
                        plan_id=enterprise_plan.id,
                        start_date=datetime.utcnow(),
                        end_date=datetime.utcnow() + timedelta(days=365),  # 1 year
                        active=True
                    )
                    db.add(subscription)
                    db.commit()
                    logger.info("Added enterprise subscription for admin user")
                except Exception as e:
                    db.rollback()
                    logger.error(f"Error adding subscription: {str(e)}")
                    # Continue without subscription if there's an error
            
        except IntegrityError:
            db.rollback()
            logger.error("Error creating admin user")
    else:
        logger.info(f"Admin user already exists: {admin_email}")

def main():
    """Main function to set up the database"""
    logger.info("Starting database setup...")
    
    # Create tables
    create_tables()
    
    # Get database session
    db = next(get_db())
    
    # Create roles
    create_roles(db)
    
    # Create subscription plans
    create_subscription_plans(db)
    
    # Create admin user
    create_admin_user(db)
    
    logger.info("Database setup completed successfully")

if __name__ == "__main__":
    main()
