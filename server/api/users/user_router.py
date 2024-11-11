# create a FastAPI route for the CRUD operations of the user

from .schemas import *
from database.models import User
from datetime import datetime
from fastapi import APIRouter, HTTPException
from database.supabase_service import SupabaseService
from utils import response_generator
import uuid

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
    # Create new user instance with UUID and other data
    new_user = User(
        **data.model_dump(),
        id=uuid.uuid4(),
        created_on=datetime.now()
    )

    # Save the user in the database (UUID is saved as a UUID in the DB)
    response = db.save(new_user)

    if response.data:
        saved_user = response.data[0]
        return response_generator.generate_response(saved_user, status=201)

    # Handle case when user creation fails
    raise HTTPException(status_code=404, detail="User not created")


@router.put("/{id}")
def update_user(id:str, data:CreateUser):
    response = db.update(id, data)

    if response.data:
        updated_user = response.data[0]
        return response_generator.generate_response(updated_user, status=200)
    else:
        return response_generator.generate_response(error="User not updated", status=404)

@router.get("/{id}")
def get_by_id(id:str):
    response = db.get_by_id(id)
    
    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="User not found", status=404)

@router.delete("/{id}")
def delete_user(id:str):
    response = db.delete(id)
    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="User not deleted", status=404)