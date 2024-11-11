from fastapi import APIRouter, HTTPException
from database.models import Album
from database.supabase_service import SupabaseService
from datetime import datetime
from .schemas import *
from utils import response_generator
import uuid

router = APIRouter(
    prefix="/albums",
    tags=["albums"],
    responses={404: {"description": "Not found"}},  # Use `responses` instead of `response`
)

db = SupabaseService("album")

@router.post("/")
def add_album(data: AlbumCreate):
    new_album = Album(
        **data.model_dump(),
        id=uuid.uuid4(),
        created_on=datetime.now(),
    )

    response = db.save(new_album)

    if response.data:
        saved_album = response.data[0]
        return response_generator.generate_response(response.data, status=200)
    else:
        raise HTTPException(status_code=404, detail="Album not created")

@router.get("/")
def get_all():
    response = db.get_all()
    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="No albums found", status=404)

@router.get("/{id}")
def get_album_by_id(id: str):
    response = db.get_by_id(id)

    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="Album not found", status=404)

@router.get("/{user_id}")
def get_albums_by_userid(user_id:str):

    response = db.get_by_field("admin_id", str(user_id))
    
    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        response_generator.generate_response(error="Albums not found", status=404)

@router.put("/{id}")
def update_album_info(id: str, data:AlbumCreate):
    
    response = db.update(id, data)
    
    if response.data:
        updated_user = response.data[0]
        return response_generator.generate_response(updated_user, status=200)
    else:
        return response_generator.generate_response(error="User not updated", status=404)

@router.delete("/{id}")
def delete_album(id: str):
    response = db.delete(id)
    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="Album not deleted", status=404)
    
