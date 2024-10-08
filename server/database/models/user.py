from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class User(BaseModel):
    id: UUID
    email: EmailStr
    first_name: str
    last_name: str
    user_name: str
    icon_url: str
    created_on: datetime

    class Config:
        orm_mode = True
