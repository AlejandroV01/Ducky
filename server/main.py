from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.supabase_service import get_users, add_user
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
