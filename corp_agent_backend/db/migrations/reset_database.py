"""
Script to reset the database by dropping all tables and recreating them.
"""
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
parent_dir = str(Path(__file__).resolve().parent.parent.parent)
sys.path.append(parent_dir)

from sqlalchemy import create_engine, inspect, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL environment variable not set")
    sys.exit(1)

# Create engine
engine = create_engine(DATABASE_URL)

def drop_all_tables():
    """Drop all tables in the database"""
    inspector = inspect(engine)
    
    # Get all table names
    table_names = inspector.get_table_names()
    
    if not table_names:
        print("No tables found in the database")
        return
    
    # Create a connection
    with engine.connect() as connection:
        # Start a transaction
        with connection.begin():
            # Drop each table
            for table_name in table_names:
                connection.execute(text(f'DROP TABLE IF EXISTS "{table_name}" CASCADE'))
    
    print(f"Dropped {len(table_names)} tables")

if __name__ == "__main__":
    print("Dropping all tables...")
    drop_all_tables()
    print("Database reset completed successfully!")
