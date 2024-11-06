from pydantic_settings import BaseSettings , SettingsConfigDict
from enum import Enum

class DatabaseTypes(str, Enum):
    sqlite = "sqlite"
    postgres = "postgres"


class Settings(BaseSettings):
    API_KEY: str
    API_SECRET: str
    PROJECT_NAME: str
    API_VERSION: str
    
    DATABASE_TYPE: str = DatabaseTypes.sqlite
    
    
    
    DATABASE_USERNAME: str|None = None
    DATABASE_PASSWORD: str|None = None
    DATABASE_HOST: str|None = None
    DATABASE_PORT: str|None = None
    DATABASE_NAME: str|None = None
    
    
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    @property
    def DATABASE_URL(self):
        if self.DATABASE_TYPE == DatabaseTypes.sqlite:
            return self.DATABASE_NAME
        return f"{self.DATABASE_TYPE}://{self.DATABASE_USERNAME}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"


settings = Settings()