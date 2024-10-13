from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv() # loads env variables from .env

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

router = APIRouter()

class AlbumCreate(BaseModel):
    title: str
    admin_id: UUID

    class Config:
        orm_mode = True

class Album(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    admin_id: UUID  # foreign key : user table

    class Config:
        orm_mode = True

@router.post("/album", tags=["album"])
async def create_album(album : AlbumCreate):

    data = {
        "title": album.title,
        "admin_id": str(album.admin_id)
    }

    supabase.table("album").insert(data).execute()

    return album

@router.get("/album/{album_id}", tags=["album"])
async def get_album_by_id(album_id : UUID):

    try:
        response = supabase.from_("album").select("*").eq("id",str(album_id)).execute()

        if not response.data:
            return {"error": "Album not found"}
        
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        print(error_message)
        return {"error": error_message}

    return response

@router.put("/album/update-name-by-id", tags = ["album"])
def update_album_name(album_id : UUID, album_name : str):

    try:
        response = supabase.from_("album").update({"title": album_name}).eq("id", str(album_id)).execute()
    except Exception as e:

        print(e)

        return {"error": e}
    
    return response


@router.delete("/album/delete", tags=["album"])
def delete_album_by_id(album_id : UUID):

    try:
        supabase.from_("album").delete().eq("id", str(album_id)).execute()
        
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        print(error_message)
        return {"error": error_message}
    
    return "Album successfully deleted"

# create_album(AlbumCreate(title="Bronny.Pics", admin_id=UUID("1b5117df-888a-42af-8f17-01e55bfee088")))