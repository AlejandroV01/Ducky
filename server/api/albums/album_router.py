
from fastapi import APIRouter, HTTPException
from database.models import Album
from database.supabase_service import SupabaseService
from datetime import datetime
from .schemas import *
from utils import response_generator
import uuid

router = APIRouter(
    prefix = "/albums",
    tags = ["albums"],
    response = {404: {"description": "Not found"}},
)

db = SupabaseService("album")

@router.post("/album")
async def add_album(data : AlbumCreate):

    new_album = Album(
        **data.model_dump(),
        id = uuid.uuid4(),
        created_on = datetime.now(),
    )

    response = db.save(new_album)

    if response.data:
        saved_album = response.data[0]
        return response_generator.generate_response(response.data,status=200)
    else:
        raise HTTPException(status_code=404, detail="Album not created")

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
