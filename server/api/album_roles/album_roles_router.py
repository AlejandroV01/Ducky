from .schemas import *
from database.models.album_role import AlbumRole
from fastapi import APIRouter
from database.supabase_service import SupabaseService
from utils import response_generator, verifyAdmin
import uuid

router = APIRouter(
    prefix="/album/{album_id}",
    tags=["album_roles"],
    responses={404: {"description": "Not found"}},
)

db = SupabaseService("album_role")


# PUBLIC ROUTES / Any user is able to view any given user's album roles

# Get album role for a given album and user
@router.get("/user/{user_id}/album_roles")
def get_all(user_id, album_id):
    response = db.get_by_fields({"user_id": user_id, "album_id": album_id})
    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="No album roles found", status=404)



# ADMIN ROUTES / Only the album admin can add, update, or delete album roles
# Add album role to user for a given album
@router.post("/admin/{admin_id}/user/{user_id}/album_roles")
def add_album_role(user_id, album_id, data: CreateAlbumRole, admin_id):
    verifyAdmin.verify_admin(admin_id, album_id)
    new_album_role = AlbumRole(
        role=data.role,
        id=uuid.uuid4(),
        album_id=album_id,
        user_id=user_id
    )

    response = db.save(new_album_role)

    if response.data:
        saved_album_role = response.data[0]
        return response_generator.generate_response(saved_album_role, status=201)
    else:
        return response_generator.generate_response(error="Album role not created", status=404)


# Update album role for a given album and user
@router.put("/admin/{admin_id}/album_roles/{id}")
def update_album_role(album_id, id, data: UpdateAlbumRole, admin_id):
    verifyAdmin.verify_admin(admin_id, album_id)
    response = db.update(id, data)

    if response.data:
        updated_album_role = response.data[0]
        return response_generator.generate_response(updated_album_role, status=200)
    else:
        return response_generator.generate_response(error="Album role not updated", status=404)


# Delete album role for a given album and user
@router.delete("/admin/{admin_id}/album_roles/{id}")
def delete_album_role(album_id, id, admin_id):
    verifyAdmin.verify_admin(admin_id, album_id)
    response = db.delete(id)

    if response.data:
        return response_generator.generate_response(response.data, status=200)
    else:
        return response_generator.generate_response(error="Album role not deleted", status=404)