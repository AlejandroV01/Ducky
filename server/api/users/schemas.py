from pydantic import BaseModel, EmailStr
from database.models.user import AuthProvider
from typing import Optional, List
from datetime import datetime

class UserUpdateModel(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_name: Optional[str] = None
    icon_url: Optional[str] = None
    is_verified: Optional[bool] = None
    auth_provider: Optional[AuthProvider] = None
    last_login: Optional[datetime] = None
    login_attempts: Optional[int] = None
    last_failed_login: Optional[datetime] = None

    class Config:
        from_attributes = True
