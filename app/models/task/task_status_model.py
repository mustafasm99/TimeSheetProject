from sqlmodel import (
    Boolean,
    String,
    DateTime,
    Field,
    Column,
    Integer,
    SQLModel,
    Relationship,
)
from datetime import datetime
from typing import TYPE_CHECKING
if TYPE_CHECKING:
     from .task_model import Task

class TaskStatus(SQLModel , table=True):
     __tablename__ = "task_status"
     id: int = Field(
          sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
     )
     create_time: datetime = Field(
          sa_column=Column(
               DateTime,
               default=datetime.utcnow,
          )
     )
     update_time: datetime = Field(
          sa_column=Column(
               DateTime,
               default=datetime.utcnow,
               onupdate=datetime.utcnow,
          )
     )
     status: str = Field(sa_column=Column(String, index=True))
     is_active: bool = Field(sa_column=Column(Boolean, default=True))
     task:"Task" = Relationship(back_populates="task_status")