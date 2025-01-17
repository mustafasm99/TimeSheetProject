from sqlmodel import (
    ForeignKey,
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
    from .user_model import User


class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    name: str = Field(sa_column=Column(String, index=True))
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

    team_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("teams.id", ondelete="CASCADE"),
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
    members_limit: int = Field(sa_column=Column(Integer))
    members_counter: int = Field(sa_column=Column(Integer))
    team_leader_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("users.id", ondelete="CASCADE"),
        ),
    )
    is_completed: bool = Field(sa_column=Column(Boolean, default=False))
    project_manager_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("users.id", ondelete="CASCADE"),
        ),
    )
    project_status_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("project_status.id", ondelete="CASCADE"),
        ),
    )
    team: "Team" = Relationship(back_populates="projects")
    project_status: "Project_Status" = Relationship(back_populates="projects")


class Team(SQLModel, table=True):
    """
    Team model
    manage members for each project
    """

    __tablename__ = "teams"
    id: int = Field(
        sa_column=Column(Integer, primary_key=True, index=True, autoincrement=True)
    )
    name: str = Field(sa_column=Column(String, index=True))
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

    members_limit: int = Field(sa_column=Column(Integer, default=10))
    members_counter: int = Field(sa_column=Column(Integer, default=0))
    projects: list["Project"] = Relationship(back_populates="team")

    team_members: list["Team_Member"] = Relationship(back_populates="team")


class Team_Member(SQLModel, table=True):
    __tablename__ = "team_members"
    id: int = Field(
        sa_column=Column(
            Integer,
            primary_key=True,
            index=True,
            autoincrement=True,
        ),
    )
    team_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("teams.id", ondelete="CASCADE"),
        ),
    )
    user_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("users.id", ondelete="CASCADE"),
        ),
    )
    is_active: bool = Field(
        sa_column=Column(
            Boolean,
            default=True,
        ),
    )
    is_leader: bool = Field(
        sa_column=Column(
            Boolean,
            default=False,
        ),
    )
    create_time: datetime = Field(
        sa_column=Column(
            DateTime,
            default=datetime.utcnow,
            nullable=True,
        ),
    )
    update_time: datetime = Field(
        sa_column=Column(
            DateTime,
            default=datetime.utcnow,
            nullable=True,
        ),
    )
    
    user: "User" = Relationship(back_populates="team_members")
    team: "Team" = Relationship(back_populates="team_members")
    
    
    


class Project_Status(SQLModel, table=True):
    __tablename__ = "project_status"
    id: int = Field(
        sa_column=Column(
            Integer,
            primary_key=True,
            index=True,
            autoincrement=True,
        ),
    )
    title: str = Field(
        sa_column=Column(
            String,
            nullable=False,
        ),
    )
    description: str = Field(
        sa_column=Column(
            String,
            nullable=False,
        ),
    )
    is_active: bool = Field(
        sa_column=Column(
            Boolean,
            default=True,
        ),
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
    projects: "Project" = Relationship(back_populates="project_status")
