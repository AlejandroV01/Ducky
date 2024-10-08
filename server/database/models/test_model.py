
from pydantic import BaseModel, ValidationError

class User(BaseModel):
    id: int
    name: str
    email: str

test_data = {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
}

try:
    user = User(**test_data)
    print("Pydantic model created successfully:")
    print(user)
except ValidationError as e:
    print("Validation error:", e)
