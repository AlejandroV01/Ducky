from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr

class VerificationAttempt(BaseModel):
    id: UUID
    email: EmailStr
    code: str
    attempts: int
    expires_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
