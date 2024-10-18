from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.users import get_users, add_user
from api.album_roles import add_album_role, get_album_role, update_album_role, delete_album_role
from database.models.album_role import AlbumAccess
from uuid import UUID
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
    return {"data": response.data[0]}

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


# -- Album Role Routes --
# Will need some middleware to verify if user is the owner of the album, fairly certain
# Only owner of the album can add, update, and delete album roles (I assume)
# Any user can view album roles, probably idk tho

# Get album role for a given album and user
@app.get("/album/{album_id}/user/{user_id}/album_roles")
def read_album_role(user_id: UUID, album_id: UUID):
    response = get_album_role(user_id, album_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"data": response.data[0]}

# Add album role to user for a given album
@app.post("/album/{album_id}/user/{user_id}/album_roles")
def create_album_role(user_id: UUID, album_id: UUID, role: AlbumAccess):
    response = add_album_role(user_id, album_id, role)
    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"data": response.data[0]}

# Update album role for a given album and user
@app.put("/album/{album_id}/user/{user_id}/album_roles/{role_id}")
def update_role(user_id: UUID, album_id: UUID, role_id: UUID, new_role: AlbumAccess):
    response = update_album_role(user_id, album_id, role_id, new_role)
    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"data": response.data[0]}

# Delete album role for a given album and user
@app.delete("/album/{album_id}/user/{user_id}/album_roles/{role_id}")
def remove_album_role(user_id: UUID, album_id: UUID, role_id: UUID):
    response = delete_album_role(user_id, album_id, role_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"message": "Album role deleted successfully"}
