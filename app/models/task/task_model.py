from sqlmodel import (
    ForeignKey,
    Boolean,
    String,
    DateTime,
    Field,
    Column,
    Integer,
    SQLModel,
)
from datetime import datetime

     


class Task(SQLModel , table = True):
     __tablename__ = "tasks"
     id: int = Field(
         sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
     )
     title: str = Field(sa_column=Column(String, index=True))
     description: str = Field(sa_column=Column(String))
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
     is_active: bool = Field(sa_column=Column(Boolean, default=True))
     project_id: int = Field(
         sa_column=Column(
              Integer,
              ForeignKey("projects.id", ondelete="CASCADE"),
           ),
     )
     start_time: datetime = Field(
         sa_column=Column(
             DateTime,
             default=datetime.utcnow,
         )
     )
     end_time: datetime = Field(
         sa_column=Column(
             DateTime,
             #  default=datetime.utcnow,
         )
     )
     status_id:int = Field(sa_column=Column(Integer))
     category_id:int = Field(sa_column=Column(Integer))