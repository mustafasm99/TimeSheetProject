from sqlmodel import (
#     ForeignKey,
    Boolean,
    Relationship,
    String,
    DateTime,
    Field,
    Column,
    Integer,
    SQLModel,
#     Relationship,
)
from datetime import datetime

from app.models.task.task_counter_model import TaskCounter

class TaskCounterType(SQLModel , table = True):
     __tablename__ = "task_counter_type"
     id:int = Field(
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
     counter_type: str = Field(sa_column=Column(String, index=True))
     is_active: bool = Field(sa_column=Column(Boolean, default=True))
     task_counter: "TaskCounter" = Relationship(back_populates="counter_type")