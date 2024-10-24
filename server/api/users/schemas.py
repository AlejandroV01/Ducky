from pydantic import BaseModel, EmailStr

class CreateUser(BaseModel):
    """
    A class to allow for the creation of a new user
    """

    email: EmailStr
    first_name: str
    last_name: str
    user_name: str
    icon_url: str

    class Config:
        from_attributes = True