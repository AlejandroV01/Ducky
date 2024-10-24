# create a FastAPI route for the CRUD operations of the user
from .schemas import *
from database.models import User
from datetime import datetime
from fastapi import APIRouter
from database.supabase_service import SupabaseService
from utils import create_response
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
    return create_response(response)


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
    return create_response(response)


@router.put("/{id}")
def update_user(id:str, data:CreateUser):
    response = db.update(id, data)
    return create_response(response)


@router.get("/{id}")
def get_by_id(id:str):
    response = db.get_by_id(id)
    return create_response(response)

@router.delete("/{id}")
def delete_user(id:str):
    response = db.delete(id)
    return create_response(response)
