from sqlmodel import Field, SQLModel , String , Integer , Boolean , DateTime , Column
from datetime import datetime , date

class Attendance(SQLModel, table=True):
    __tablename__ = "attendance"
    
    id: int = Field(
        sa_column=Column(Integer, primary_key=True)
    )
    user_id:int = Field(
         sa_column=Column(Integer, nullable=False)
    )
    day:date = Field(
            sa_column=Column(DateTime, default=datetime.today)
     )
    time:datetime = Field(
               sa_column=Column(DateTime, default=datetime.now)
      )
    token:str = Field(
        sa_column=Column(String, nullable=False)
    )
    status:bool = Field(
            sa_column=Column(Boolean, default=False)
     )