from pydantic_settings import BaseSettings , SettingsConfigDict
from enum import Enum
import os

class DatabaseTypes(str, Enum):
    sqlite = "sqlite"
    postgres = "postgres"


class Settings(BaseSettings):
    API_KEY: str
    API_SECRET: str
    PROJECT_NAME: str
    API_VERSION: str
    
    DATABASE_TYPE: str = DatabaseTypes.sqlite
    BASE_DIR:str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    
    DATABASE_USERNAME: str|None = None
    DATABASE_PASSWORD: str|None = None
    DATABASE_HOST: str|None = None
    DATABASE_PORT: str|None = None
    DATABASE_NAME: str|None = None
    
    MAX_IMAGE_SIZE:int = 1024 * 1024 * 5
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    MEDIA_PATH: str = "media"
    DOMAIN: str
    @property
    def DATABASE_URL(self):
        if self.DATABASE_TYPE == DatabaseTypes.sqlite:
            return self.DATABASE_NAME
        return f"{self.DATABASE_TYPE}://{self.DATABASE_USERNAME}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"


settings = Settings()