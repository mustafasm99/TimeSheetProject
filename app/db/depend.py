from sqlmodel import Session
from app.db.engin import get_engine
from fastapi import Depends
from typing import Annotated

def get_session():
     with Session(get_engine()) as session:
          yield session
          
session = Annotated[Session,Depends(get_session)]

"""
     Create in depend to inject the session into 
     All the endpoints that need database connection.

"""