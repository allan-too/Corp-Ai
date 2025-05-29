import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from db.session import SessionLocal
from db.models import User
from passlib.context import CryptContext

def update_admin_password():
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    db = SessionLocal()
    
    try:
        # Find admin user
        admin_email = "admin@corpai.com"
        admin = db.query(User).filter_by(email=admin_email).first()
        
        if admin:
            # Update password
            admin.hashed_password = pwd_context.hash("Admin@123")
            db.commit()
            print(f"Admin password updated successfully for {admin_email}")
        else:
            print(f"Admin user with email {admin_email} not found")
    except Exception as e:
        print(f"Error updating admin password: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    update_admin_password()
