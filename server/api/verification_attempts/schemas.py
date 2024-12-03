from pydantic import BaseModel, EmailStr
from database.models import User
from datetime import datetime

class CreateVerificationRequest(BaseModel):
    email: EmailStr

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str