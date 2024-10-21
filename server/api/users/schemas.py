from pydantic import BaseModel, EmailStr

class CreateUser(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    user_name: str
    icon_url: str

    class Config:
        orm_mode = True