import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from db.session import SessionLocal, Base, engine
from db.models import Role, SubscriptionPlan, User
from models.finance import Budget, FinanceReport
from models.social_media import SocialMediaPost

def seed_roles(session):
    roles = ["admin", "user"]
    for role_name in roles:
        role = session.query(Role).filter_by(name=role_name).first()
        if not role:
            session.add(Role(name=role_name))
    session.commit()

def seed_admin_user(session):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # Check if admin exists
    admin_email = "admin@corpai.com"
    admin = session.query(User).filter_by(email=admin_email).first()
    if not admin:
        # Get admin role
        admin_role = session.query(Role).filter_by(name="admin").first()
        if not admin_role:
            raise Exception("Admin role not found")

        # Create admin user
        admin = User(
            email=admin_email,
            hashed_password=pwd_context.hash("Admin@123"),  # Change in production
            first_name="Admin",
            last_name="User",
            role_id=admin_role.id,
            is_active=True
        )
        session.add(admin)
        session.commit()

def seed_subscription_plans(session):
    plans = [
        {
            "name": "basic",
            "price": 0.0,
            "features": "Basic tools and features",
            "duration_days": 30
        },
        {
            "name": "professional",
            "price": 49.99,
            "features": "Professional tools including HR, Reviews, and Social Media Management",
            "duration_days": 30
        },
        {
            "name": "enterprise",
            "price": 199.99,
            "features": "Full access to all tools including Legal and Supply Chain Management",
            "duration_days": 30
        }
    ]

    for plan_data in plans:
        plan = session.query(SubscriptionPlan).filter_by(name=plan_data["name"]).first()
        if not plan:
            session.add(SubscriptionPlan(**plan_data))
    session.commit()

def main(drop_tables=True):
    # Drop all tables
    if os.getenv("ENVIRONMENT") != "production":
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
    
    # Create all tables
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    # Seed data
    print("Seeding database...")
    db = SessionLocal()
    try:
        seed_roles(db)
        seed_subscription_plans(db)
        seed_admin_user(db)
        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
