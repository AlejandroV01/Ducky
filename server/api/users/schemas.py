from pydantic import BaseModel, EmailStr

class CreateUser(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    user_name: str
    icon_url: str
    password: str

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    user_name: str
    icon_url: str
    created_on: str

    class Config:
        from_attributes = True