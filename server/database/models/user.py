from pydantic import BaseModel, EmailStr, Field
from uuid import UUID, uuid4
from datetime import datetime

class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    email: EmailStr
    first_name: str
    last_name: str
    user_name: str
    icon_url: str
    created_on: datetime # datetime will be saved as datetime in the database

    class Config:
        from_attributes = True
