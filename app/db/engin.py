from sqlmodel import create_engine
from app.core.conf import settings
import os


current_path = os.path.dirname(os.path.abspath(__file__))
print(f"Current path ====================>: {current_path}")
engin = create_engine(settings.DATABASE_URL)
"""
The get_engine function is a simple function that returns a connection to the database.
"""