# create a FastAPI route for the CRUD operations of the user

from .schemas import *
from database.models import User
from datetime import datetime
from fastapi import APIRouter
from database.supabase_service import SupabaseService
from utils import response_generator

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

db = SupabaseService("user")

@router.get("/")
def get_all():
    response = db.get_all()
    if response.data:
        return response_generator.generate_response(response.data,status=200)
    else:
        return response_generator.generate_response(error="No users found", status=404)


@router.post("/")
def add_user(data: CreateUser):
    new_user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        icon_url=data.icon_url if data.icon_url else "",
        email=data.email,
        password=data.password,
        created_on=datetime.now()
    )

    response = db.save(new_user.model_dump())
    if response.data:
        return response_generator.generate_response(response.data, status=201)
    else:
        return response_generator.generate_response(error="User not created", status=404)

@router.put("/{user_id}")
def update_user(user_id:str, data:CreateUser):

    response = db.update(user_id, data.model_dump())

    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="User not updated", status=404)

@router.get("/{user_id}")
def get_by_id(user_id:str):
    return db.get_by_id(user_id)

@router.delete("/{user_id}")
def delete_user(user_id:str):
    response = db.delete(user_id)
    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="User not deleted", status=404)