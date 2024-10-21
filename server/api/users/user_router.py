# create a FastAPI route for the CRUD operations of the user

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
def add_user(data):
    response = db.save(data)
    if response.data:
        return response_generator.generate_response(response.data, status=201)
    else:
        return response_generator.generate_response(error="User not created", status=404)


@router.get("/{id}")
def get_by_id(id:str):
    return db.get_by_id(id)


