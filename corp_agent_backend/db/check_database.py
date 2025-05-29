"""
Script to check the database setup and verify tables.
"""
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
parent_dir = str(Path(__file__).resolve().parent.parent)
sys.path.append(parent_dir)

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
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

def check_tables():
    """Check if all required tables exist in the database"""
    inspector = inspect(engine)
    
    # Get all table names
    table_names = inspector.get_table_names()
    
    # Required tables
    required_tables = [
        "roles",
        "users",
        "subscription_plans",
        "user_subscriptions",
        "password_resets"
    ]
    
    # Check if all required tables exist
    missing_tables = [table for table in required_tables if table not in table_names]
    
    if missing_tables:
        print(f"Missing tables: {', '.join(missing_tables)}")
        return False
    
    print(f"All required tables exist: {', '.join(required_tables)}")
    return True

def check_roles():
    """Check if roles are properly seeded"""
    db = SessionLocal()
    try:
        # Check roles
        result = db.execute(text("SELECT COUNT(*) FROM roles")).scalar()
        if result > 0:
            roles = db.execute(text("SELECT name FROM roles")).fetchall()
            role_names = [role[0] for role in roles]
            print(f"Roles in database: {', '.join(role_names)}")
            return True
        else:
            print("No roles found in the database")
            return False
    except Exception as e:
        print(f"Error checking roles: {e}")
        return False
    finally:
        db.close()

def check_subscription_plans():
    """Check if subscription plans are properly seeded"""
    db = SessionLocal()
    try:
        # Check subscription plans
        result = db.execute(text("SELECT COUNT(*) FROM subscription_plans")).scalar()
        if result > 0:
            plans = db.execute(text("SELECT name, price FROM subscription_plans")).fetchall()
            plan_info = [f"{plan[0]} (${plan[1]/100:.2f})" for plan in plans]
            print(f"Subscription plans in database: {', '.join(plan_info)}")
            return True
        else:
            print("No subscription plans found in the database")
            return False
    except Exception as e:
        print(f"Error checking subscription plans: {e}")
        return False
    finally:
        db.close()

def check_users():
    """Check if any users exist in the database"""
    db = SessionLocal()
    try:
        # Check users
        result = db.execute(text("SELECT COUNT(*) FROM users")).scalar()
        if result > 0:
            users = db.execute(text("SELECT email, oauth_provider FROM users")).fetchall()
            user_info = [f"{user[0]} ({user[1] if user[1] else 'email'})" for user in users]
            print(f"Users in database: {', '.join(user_info)}")
            return True
        else:
            print("No users found in the database")
            return False
    except Exception as e:
        print(f"Error checking users: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Checking database setup...")
    
    # Check tables
    tables_ok = check_tables()
    
    # Check roles
    roles_ok = check_roles()
    
    # Check subscription plans
    plans_ok = check_subscription_plans()
    
    # Check users
    users_ok = check_users()
    
    # Print summary
    print("\nDatabase check summary:")
    print(f"Tables: {'✓' if tables_ok else '✗'}")
    print(f"Roles: {'✓' if roles_ok else '✗'}")
    print(f"Subscription Plans: {'✓' if plans_ok else '✗'}")
    print(f"Users: {'✓' if users_ok else '✗'}")
    
    if tables_ok and roles_ok and plans_ok:
        print("\nDatabase is properly set up for user authentication!")
    else:
        print("\nDatabase setup is incomplete. Please run the migration scripts.")
