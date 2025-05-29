#!/usr/bin/env python3
"""
Script to create the Budget table in the database
"""
import sqlite3
import os
from pathlib import Path

# Get the database path
DB_PATH = Path(__file__).parent.parent / "corp_agent.db"

# SQL to create the Budget table
CREATE_BUDGET_TABLE = """
CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    month TEXT NOT NULL,
    revenue REAL NOT NULL,
    expenses REAL NOT NULL,
    surplus REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
"""

def main():
    """Create the Budget table if it doesn't exist"""
    print(f"Database path: {DB_PATH}")
    
    if not DB_PATH.exists():
        print(f"Database file not found at {DB_PATH}")
        return
    
    try:
        # Connect to the database
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        
        # Check if the table already exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='budgets';")
        if cursor.fetchone():
            print("Budget table already exists")
        else:
            # Create the table
            print("Creating Budget table...")
            cursor.execute(CREATE_BUDGET_TABLE)
            conn.commit()
            print("Budget table created successfully")
        
        conn.close()
        print("Done")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
