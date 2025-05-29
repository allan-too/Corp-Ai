"""
Database migration script to create all necessary tables for authentication
including OAuth support.
"""
import sys
import os
import datetime
from pathlib import Path

# Add the parent directory to sys.path
parent_dir = str(Path(__file__).resolve().parent.parent.parent)
sys.path.append(parent_dir)

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL environment variable not set")
    sys.exit(1)

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define models
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    users = relationship("User", back_populates="role")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")
    
    # OAuth fields
    oauth_provider = Column(String, nullable=True)  # 'google', 'github', etc.
    oauth_id = Column(String, nullable=True)  # Provider's unique user ID
    profile_picture_url = Column(String, nullable=True)
    
    # Subscription relationship
    subscriptions = relationship("UserSubscription", back_populates="user")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    price = Column(Integer)  # Price in cents
    features = Column(String)  # JSON string of features
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="subscriptions")
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"))
    plan = relationship("SubscriptionPlan")
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class PasswordReset(Base):
    __tablename__ = "password_resets"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    token = Column(String, unique=True, index=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully")

def seed_initial_data():
    """Seed initial data for the application"""
    db = SessionLocal()
    try:
        # Check if roles already exist
        if db.query(Role).count() == 0:
            # Create default roles
            roles = [
                Role(name="admin", description="Administrator with full access"),
                Role(name="user", description="Regular user with standard access"),
            ]
            db.add_all(roles)
            db.commit()
            print("Default roles created")
        
        # Check if subscription plans already exist
        if db.query(SubscriptionPlan).count() == 0:
            # Create default subscription plans
            plans = [
                SubscriptionPlan(
                    name="basic",
                    description="Basic plan with limited features",
                    price=0,  # Free tier
                    features='["Limited queries per day", "Basic support"]'
                ),
                SubscriptionPlan(
                    name="professional",
                    description="Professional plan with advanced features",
                    price=1999,  # $19.99
                    features='["Unlimited queries", "Priority support", "Advanced analytics"]'
                ),
                SubscriptionPlan(
                    name="enterprise",
                    description="Enterprise plan with all features",
                    price=4999,  # $49.99
                    features='["Unlimited queries", "24/7 support", "Advanced analytics", "Custom integrations"]'
                ),
            ]
            db.add_all(plans)
            db.commit()
            print("Default subscription plans created")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding initial data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating database tables...")
    create_tables()
    print("Seeding initial data...")
    seed_initial_data()
    print("Database setup completed successfully!")
