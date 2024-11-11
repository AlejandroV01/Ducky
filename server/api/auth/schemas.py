from pydantic import BaseModel, EmailStr

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    user_name: str

class SignInRequest(BaseModel):
    email: str
    password: str

class GoogleCallbackRequest(BaseModel):
    code: str