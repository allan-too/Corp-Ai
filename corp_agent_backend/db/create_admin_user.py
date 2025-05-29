"""
Script to create an admin user for testing.
"""
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
parent_dir = str(Path(__file__).resolve().parent.parent)
sys.path.append(parent_dir)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from passlib.context import CryptContext

from db.models import User, Role
from db.session import get_db

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

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)

def create_admin_user(email: str, password: str):
    """Create an admin user."""
    db = SessionLocal()
    try:
        # Check if user already exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists")
            return
        
        # Get admin role
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            print("Admin role not found")
            return
        
        # Hash password
        hashed_password = get_password_hash(password)
        
        # Create user
        user = User(
            email=email,
            hashed_password=hashed_password,
            full_name="Admin User",
            is_active=True,
            is_verified=True,
            role_id=admin_role.id
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"Admin user {email} created successfully")
    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Default admin credentials
    admin_email = "admin@corpai.com"
    admin_password = "Admin@123"
    
    # Create admin user
    create_admin_user(admin_email, admin_password)
    
    print(f"\nAdmin user credentials:")
    print(f"Email: {admin_email}")
    print(f"Password: {admin_password}")
    print("\nPlease change the password after first login.")
