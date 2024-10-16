from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.supabase import get_users, add_user, check_user_in_db
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "https://ducky.pics", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/user")
def read_user():
    response = get_users()
    return {"data": response}

class User(BaseModel):
    first_name: str
    last_name: str

@app.post("/user")
def create_user(user: User):
    print(f"Received user data: {user}")
    data = user.dict()
    print(f"User to dict: {data}")
    response = add_user(data)
    print(f"Response to data: {response}")
    
    return {"data": response}


# Define the expected data model
class UserData(BaseModel):
    username: str

@app.post("/check-user")
def check_user(data: UserData):
    print(f"Received user data: {data.username}")
    
    # Use only the username to call check_user
    response = check_user_in_db(data.username)
    
    print(f"Response to data: {response}")
    
    return {"data": response}

