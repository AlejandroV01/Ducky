from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from api import add_routers
from utils import Response
# from database.supabase import get_users, add_user, check_user_in_db
# from pydantic import BaseModel

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

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc):
    response = Response(
        data=None,
        error="Invalid request data",
        status=400
    )

    return JSONResponse(
        status_code=400,
        content=response.model_dump()
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc):
    response = Response(
        data=None,
        error="Invalid request data",
        status=400
    )

    return JSONResponse(
        status_code=400,
        content=response.model_dump()
    )

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

add_routers(app)

#
# @app.get("/user")
# def read_user():
#     response = get_users()
#     return {"data": response}
#
# class User(BaseModel):
#     first_name: str
#     last_name: str
#
# @app.post("/user")
# def create_user(user: User):
#     print(f"Received user data: {user}")
#     data = user.dict()
#     print(f"User to dict: {data}")
#     response = add_user(data)
#     print(f"Response to data: {response}")
#
#     return {"data": response}
#
#
# # Define the expected data model
# class UserData(BaseModel):
#     username: str
#
# @app.post("/check-user")
# def check_user(data: UserData):
#     print(f"Received user data: {data.username}")
#
#     # Use only the username to call check_user
#     response = check_user_in_db(data.username)
#
#     print(f"Response to data: {response}")
#
#     return {"data": response}



# -- Album Role Routes --

# PUBLIC ROUTES / Any user is able to view any given user's album roles

# Get album role for a given album and user
@app.get("/album/{album_id}/user/{user_id}/album_roles")
def read_album_role(user_id, album_id):

    response = get_album_role(user_id, album_id)

    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"data": response.data}


# ADMIN ROUTES / Only the album admin can add, update, or delete album roles

class RoleRequest(BaseModel):
    role: AlbumAccess

# Add album role to user for a given album
@app.post("/album/{album_id}/admin/{admin_id}/user/{user_id}/album_roles")
def create_album_role(user_id, album_id, req: RoleRequest, admin_id):

    verify_admin(admin_id, album_id)
    
    response = add_album_role(user_id, album_id, req.role)

    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"data": response.data[0]}



# Update album role for a given album and user
@app.put("/album/{album_id}/admin/{admin_id}/user/{user_id}/album_roles/{id}")
def update_role(user_id, album_id, id, req: RoleRequest, admin_id):

    verify_admin(admin_id, album_id)

    response = update_album_role(user_id, album_id, id, req.role)

    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"data": response.data[0]}



# Delete album role for a given album and user
@app.delete("/album/{album_id}/admin/{admin_id}/user/{user_id}/album_roles/{id}")
def remove_album_role(user_id, album_id, id, admin_id):

    verify_admin(admin_id, album_id)

    response = delete_album_role(user_id, album_id, id)

    if not response.data:
        raise HTTPException(status_code=404, detail="Album role not found")
    return {"message": "Album role deleted successfully"}