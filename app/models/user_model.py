from sqlmodel import Relationship , ForeignKey , DateTime, SQLModel, Field, Column, Integer, String, Boolean

from app.models.task.task_assignee_model import TaskAssignee
from app.models.task.task_coments_model import TaskComment
from .base_model import DbBaseModel
from datetime import datetime
from app.models.task.task_update_model import TaskUpdate
from app.models.task.task_accountable_model import TaskAccountable
from app.models.profile import Profile
from app.models.project_model import Team_Member
class User(DbBaseModel, table=True):
    __tablename__ = "users"
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    name: str = Field(sa_column=Column(String, index=True))
    email: str = Field(sa_column=Column(String, unique=True, index=True))
    password: str = Field(sa_column=Column(String))
    is_active: bool = Field(sa_column=Column(Boolean, default=True))
    is_superuser: bool = Field(sa_column=Column(Boolean, default=False))
    is_temp_password: bool = Field(sa_column=Column(Boolean, default=False))
    
    users_roll:list["UsersRoll"] = Relationship(back_populates="user")
    task_update:list["TaskUpdate"] = Relationship(back_populates="user")
    user_accountable:list["TaskAccountable"] = Relationship(back_populates="user")
    user_assign:list["TaskAssignee"] = Relationship(back_populates="user")
    user_comment:list["TaskComment"] = Relationship(back_populates="user")
    profile: "Profile" = Relationship(back_populates="user")
    team_members:list["Team_Member"] = Relationship(back_populates="user")

class UsersRoll(SQLModel, table=True):
    __tablename__ = "users_roll"
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
    user_id: int = Field(
         sa_column=Column(
              Integer,
              ForeignKey("users.id", ondelete="CASCADE"),
              index=True, 
          ),
     )
    roll_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(
                "roll.id",
                ondelete="CASCADE",
            ),
        )
    )
    is_active: bool = Field(sa_column=Column(Boolean, default=True))
    user: "User" = Relationship(
         back_populates="users_roll"
    )
    roll: "Roll" = Relationship(
         back_populates="users_roll"
    )
    # is active for these user or not


class Roll(DbBaseModel, table=True):
    __tablename__ = "roll"
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
            nullable=True,
        )
    )
    name: str = Field(sa_column=Column(String, index=True))
    description: str = Field(sa_column=Column(String))
    is_active: bool = Field(sa_column=Column(Boolean, default=True))
    users_roll:list["UsersRoll"] = Relationship(back_populates="roll")
    # is active for these roll or not

    