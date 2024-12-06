from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum

class AuthProvider(str, Enum):
    email = "email"
    google = "google"

class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    email: EmailStr
    password: Optional[str]
    first_name: str
    last_name: str
    user_name: str
    icon_url: Optional[str] = None  # Default to None
    is_verified: Optional[bool] = False
    auth_provider: Optional[AuthProvider] = AuthProvider.email
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    login_attempts: Optional[int] = 0
    last_failed_login: Optional[datetime] = None

    class Config:
        from_attributes = True
