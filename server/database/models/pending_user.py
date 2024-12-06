from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from .user import AuthProvider

class PendingUser(BaseModel):
    id: UUID
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    user_name: str
    auth_provider: AuthProvider
    created_at: datetime

    class Config:
        from_attributes = True