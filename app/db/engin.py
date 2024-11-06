from sqlmodel import create_engine
from app.core.conf import settings

def get_engine():
     return create_engine(settings.DATABASE_URL)


"""
The get_engine function is a simple function that returns a connection to the database.
"""