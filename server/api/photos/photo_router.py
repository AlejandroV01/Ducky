from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from database.supabase_service import SupabaseService, supabase
from utils import generate_response
from ..middleware.auth import verify_token, AuthData
from .schemas import PhotoCreate, PhotoUpdate
from database.models import MemberRole, Photo
from typing import List
import uuid
import mimetypes
from datetime import datetime

router = APIRouter(
    prefix="/albums/{album_id}/photos",
    tags=["photos"]
)

photo_db = SupabaseService("photo")
member_db = SupabaseService("album_member")
album_db = SupabaseService("album")

ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def check_member_role(album_id: str, user_id: str) -> MemberRole:
    """Helper to check member's role"""
    response = member_db.get_by_fields({
        "album_id": album_id,
        "user_id": user_id
    })
    if not response.data:
        return None
    return MemberRole(response.data[0]["role"])

def can_upload_photos(role: MemberRole) -> bool:
    """Check if role can upload photos"""
    return role in [MemberRole.OWNER, MemberRole.ADMIN, MemberRole.CONTRIBUTOR]

def can_delete_photo(role: MemberRole, photo_owner_id: str, current_user_id: str) -> bool:
    """Check if user can delete a photo based on roles"""
    if role == MemberRole.OWNER:
        return True
    if role == MemberRole.ADMIN:
        # Get photo owner's role
        photo_owner_role = check_member_role(album_id, photo_owner_id)
        return photo_owner_role == MemberRole.CONTRIBUTOR
    if role == MemberRole.CONTRIBUTOR:
        return photo_owner_id == current_user_id
    return False

@router.post("/")
async def upload_photos(
    album_id: str,
    files: List[UploadFile] = File(...),
    description: str = None,
    auth_data: AuthData = Depends(verify_token)
):
    """Upload one or multiple photos to an album"""
    try:
        # Check member role and upload permissions
        role = check_member_role(album_id, str(auth_data.user.id))
        if not role or not can_upload_photos(role):
            return generate_response(error="Not authorized to upload photos", status=403)

        # Check if album exists and is not archived
        album = album_db.get_by_id(album_id)
        if not album.data:
            return generate_response(error="Album not found", status=404)
        if album.data[0]["archived"]:
            return generate_response(error="Cannot upload to archived album", status=400)

        uploaded_photos = []
        errors = []

        for file in files:
            try:
                # Validate file type
                if file.content_type not in ALLOWED_MIME_TYPES:
                    errors.append(f"{file.filename}: Invalid file type")
                    continue

                # Read and validate file size
                content = await file.read()
                if len(content) > MAX_FILE_SIZE:
                    errors.append(f"{file.filename}: File too large")
                    continue

                # Generate unique filename and storage path
                file_ext = mimetypes.guess_extension(file.content_type) or '.jpg'
                storage_path = f"albums/{album_id}/{uuid.uuid4()}{file_ext}"

                # Upload to Supabase Storage
                supabase.storage.from_("photos").upload(
                    storage_path,
                    content
                )

                # Get public URL
                url = supabase.storage.from_("photos").get_public_url(storage_path)

                # Create photo record
                photo = Photo(
                    album_id=album_id,
                    user_id=auth_data.user.id,
                    url=url,
                    storage_path=storage_path,
                    file_name=file.filename,
                    description=description,
                    mime_type=file.content_type,
                    size=len(content),
                    uploaded_at=datetime.utcnow()
                )

                photo_response = photo_db.save(photo)
                if photo_response.data:
                    uploaded_photos.append(photo_response.data[0])
            except Exception as e:
                errors.append(f"{file.filename}: Upload failed")
                continue

        if not uploaded_photos:
            return generate_response(
                error="No photos were successfully uploaded",
                data={"errors": errors},
                status=400
            )

        return generate_response(
            data={
                "uploaded": uploaded_photos,
                "errors": errors if errors else None
            },
            status=201
        )

    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/")
async def get_album_photos(
    album_id: str,
    page: int = 1,
    page_size: int = 20,
    auth_data: AuthData = Depends(verify_token)
):
    """Get paginated photos from an album"""
    try:
        # Check album access
        album = album_db.get_by_id(album_id)
        if not album.data:
            return generate_response(error="Album not found", status=404)

        role = check_member_role(album_id, str(auth_data.user.id))
        if not album.data[0]["public"] and not role:
            return generate_response(error="Not authorized to view photos", status=403)

        # Get paginated photos
        offset = (page - 1) * page_size
        response = photo_db.get_paginated(page_size, offset)
        
        # Get total count
        total_photos = len(photo_db.get_by_field("album_id", album_id).data)

        return generate_response(data={
            "photos": response.data,
            "total": total_photos,
            "page": page,
            "page_size": page_size
        }, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/me")
async def get_my_photos(
    album_id: str,
    page: int = 1,
    page_size: int = 20,
    auth_data: AuthData = Depends(verify_token)
):
    """Get paginated list of photos uploaded by the current user"""
    try:
        # Check album access
        album = album_db.get_by_id(album_id)
        if not album.data:
            return generate_response(error="Album not found", status=404)

        role = check_member_role(album_id, str(auth_data.user.id))
        if not album.data[0]["public"] and not role:
            return generate_response(error="Not authorized", status=403)

        # Get user's photos
        photos = photo_db.get_by_fields({
            "album_id": album_id,
            "user_id": str(auth_data.user.id)
        })

        # Manual pagination
        total = len(photos.data) if photos.data else 0
        start = (page - 1) * page_size
        end = start + page_size
        paginated_photos = photos.data[start:end] if photos.data else []

        return generate_response(data={
            "photos": paginated_photos,
            "total": total,
            "page": page,
            "page_size": page_size
        }, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/users/{user_id}")
async def get_user_photos(
    album_id: str,
    user_id: str,
    page: int = 1,
    page_size: int = 20,
    auth_data: AuthData = Depends(verify_token)
):
    """Get paginated list of photos uploaded by a specific user"""
    try:
        # Check album access
        album = album_db.get_by_id(album_id)
        if not album.data:
            return generate_response(error="Album not found", status=404)

        role = check_member_role(album_id, str(auth_data.user.id))
        if not album.data[0]["public"] and not role:
            return generate_response(error="Not authorized", status=403)

        # Check if target user is a member
        target_role = check_member_role(album_id, user_id)
        if not target_role:
            return generate_response(error="User is not a member of this album", status=404)

        # Get user's photos
        photos = photo_db.get_by_fields({
            "album_id": album_id,
            "user_id": user_id
        })

        # Manual pagination
        total = len(photos.data) if photos.data else 0
        start = (page - 1) * page_size
        end = start + page_size
        paginated_photos = photos.data[start:end] if photos.data else []

        return generate_response(data={
            "photos": paginated_photos,
            "total": total,
            "page": page,
            "page_size": page_size
        }, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.patch("/{photo_id}")
async def update_photo(
    album_id: str,
    photo_id: str,
    photo_update: PhotoUpdate,
    auth_data: AuthData = Depends(verify_token)
):
    """Update photo metadata (owners can update their own photos only)"""
    try:
        # Check photo exists and belongs to album
        photo = photo_db.get_by_id(photo_id)
        if not photo.data or photo.data[0]["album_id"] != album_id:
            return generate_response(error="Photo not found", status=404)

        # Only photo owner can update their photos
        if photo.data[0]["user_id"] != str(auth_data.user.id):
            return generate_response(error="Can only update your own photos", status=403)

        # Update photo
        update_data = photo_update.model_dump(exclude_unset=True)
        response = photo_db.update(photo_id, PhotoUpdate(**update_data))

        return generate_response(data=response.data[0], status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.delete("/{photo_id}")
async def delete_photo(
    album_id: str,
    photo_id: str,
    auth_data: AuthData = Depends(verify_token)
):
    """Delete photo based on role permissions"""
    try:
        # Get photo details
        photo = photo_db.get_by_id(photo_id)
        if not photo.data or photo.data[0]["album_id"] != album_id:
            return generate_response(error="Photo not found", status=404)

        # Check permissions
        role = check_member_role(album_id, str(auth_data.user.id))
        if not can_delete_photo(role, photo.data[0]["user_id"], str(auth_data.user.id)):
            return generate_response(error="Not authorized to delete this photo", status=403)

        # Delete from storage
        try:
            supabase.storage.from_("photos").remove(photo.data[0]["storage_path"])
        except Exception as e:
            print(f"Error deleting from storage: {str(e)}")

        # Delete from database
        photo_db.delete(photo_id)

        return generate_response(
            data={"message": "Photo successfully deleted"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)