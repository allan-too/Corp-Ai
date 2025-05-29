from sqlalchemy import engine_from_config
from sqlalchemy import pool
from logging.config import fileConfig
import os
from alembic import context

# add this to import your models
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.base_class import Base
from models.user import User
from models.tool_history import ToolHistory

def run_migrations_online():
    config = context.config
    url = config.get_main_option("sqlalchemy.url")
    config.set_main_option('sqlalchemy.url', url)
    fileConfig(config.config_file_name)
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=Base.metadata)
        with context.begin_transaction():
            context.run_migrations()
