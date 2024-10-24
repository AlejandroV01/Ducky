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
    """
    Get all users from the database
    :return: a response object with the data
    """
    response = db.get_all()
    return create_response(response)


@router.post("/")
def add_user(data: CreateUser):
    """
    Add a new user to the database
    :param data: the data of the user to be added
    :return: The complete user object
    """
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
    """
    Update a user in the database
    :param id: The users id
    :param data: the updated user object
    :return:
    """
    response = db.update(id, data)
    return create_response(response)


@router.get("/{id}")
def get_by_id(id:str):
    """
    Get a user by id
    :param id: The user's id
    :return: A response object with the user data
    """
    response = db.get_by_id(id)
    return create_response(response)

@router.get("/{param}/{value}")
def get_by_param(param:str, value:str):
    """
    Get a user by a specific parameter
    :param param: The name of the parameter
    :param value: The value of the parameter
    :return: A response object with the user data
    """
    fields = {param: value}
    response = db.get_by_fields(fields)
    return create_response(response)

@router.delete("/{id}")
def delete_user(id:str):
    """
    Delete a user by id
    :param id: The user's id
    :return: A response object with the user data
    """
    response = db.delete(id)
    return create_response(response)
