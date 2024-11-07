from app.db.depend import get_session
from typing import Generic , TypeVar , Type 
from sqlmodel import SQLModel , select
from dataclasses import dataclass


T = TypeVar("T" , bound=SQLModel)

@dataclass
class BaseController(Generic[T]):
     model:Type[T]
     def __init__(self , model:Type[T]):
          self.session = next(get_session())
          self.model = model

     def get(self, id):
          try:
               query = select(self.model).where(self.model.id == id)
               return self.session.exec(query).first()
          except Exception:
               return False

     def create(self, data:T)->bool|T:
          try:
               self.session.add(data)
               self.session.commit()
               return data
          except Exception:
               self.session.rollback()
               return False

     def update(self, id, data:T)->bool|T:
          try:
               self.session.add(data)
               self.session.commit()
               return data
          except Exception:
               self.session.rollback()
               return False

     def delete(self, id):
          try:
               query = select(self.model).where(self.model.id == id)
               self.session.exec(query).delete()
               self.session.commit()
               return True
          except Exception:
               self.session.rollback()
               return False

     def read(self)->list[T]:
         query = select(self.model)
         return list(self.session.exec(query).all())