#!/usr/bin/env python3
"""
Script to update the database schema without dropping existing data
"""
import sys
import os
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import modules using absolute imports
from corp_agent_backend.db.base_class import Base
from corp_agent_backend.db.session import engine
from corp_agent_backend.models.finance import Budget, FinanceReport
from corp_agent_backend.models.user import User
from sqlalchemy import inspect

def create_tables():
    """Create tables that don't exist yet without dropping existing ones"""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    # Get all model classes from Base.metadata.tables
    for table_name, table in Base.metadata.tables.items():
        if table_name not in existing_tables:
            print(f"Creating table: {table_name}")
            table.create(engine)
        else:
            print(f"Table {table_name} already exists, checking for missing columns...")
            # Get existing columns
            existing_columns = {col['name'] for col in inspector.get_columns(table_name)}
            # Get model columns
            model_columns = {col.name for col in table.columns}
            # Find missing columns
            missing_columns = model_columns - existing_columns
            if missing_columns:
                print(f"Missing columns in {table_name}: {missing_columns}")
                print(f"Please run a manual migration to add these columns")

if __name__ == "__main__":
    print("Updating database schema...")
    create_tables()
    print("Schema update completed.")
