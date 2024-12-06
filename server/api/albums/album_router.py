from fastapi import APIRouter, Depends, HTTPException
from database.supabase_service import SupabaseService
from utils import generate_response
from ..middleware.auth import verify_token, AuthData
from .schemas import AlbumCreate, AlbumUpdate
from database.models import Album, AlbumMember, MemberRole
from datetime import datetime
from typing import Optional

router = APIRouter(
    prefix="/albums",
    tags=["albums"]
)

album_db = SupabaseService("album")
member_db = SupabaseService("album_member")
photo_db = SupabaseService("photo")

def check_member_role(album_id: str, user_id: str) -> Optional[MemberRole]:
    """Helper to check member's role"""
    response = member_db.get_by_fields({
        "album_id": album_id,
        "user_id": user_id
    })
    if not response.data:
        return None
    return MemberRole(response.data[0]["role"])

@router.post("/")
def create_album(album_data: AlbumCreate, auth_data: AuthData = Depends(verify_token)):
    """Create a new album"""
    try:
        new_album = Album(
            title=album_data.title,
            description=album_data.description,
            public=album_data.public,
            owner_id=auth_data.user.id
        )
        album_response = album_db.save(new_album)
        
        if not album_response.data:
            return generate_response(error="Failed to create album", status=400)
        
        # Add owner as member - the ID will be auto-generated
        member = AlbumMember(
            album_id=album_response.data[0]["id"],
            user_id=auth_data.user.id,
            role=MemberRole.OWNER
        )
        member_response = member_db.save(member)
        
        if not member_response.data:
            # Should probably delete the album here if member creation fails
            return generate_response(error="Failed to create album member", status=400)
        
        return generate_response(data=album_response.data[0], status=201)
    except Exception as e:
        return generate_response(error=str(e), status=500)
    
@router.get("/")
def get_all_albums(auth_data: AuthData = Depends(verify_token)):
    """Get all public albums and private albums where user is a member"""
    try:
        # Get all public albums
        public_albums = album_db.get_by_field("public", True).data or []
        
        # Get user's private album memberships
        memberships = member_db.get_by_field("user_id", str(auth_data.user.id))
        private_album_ids = [m["album_id"] for m in memberships.data] if memberships.data else []
        
        # Get private albums user is member of
        private_albums = []
        for album_id in private_album_ids:
            album = album_db.get_by_id(album_id)
            if album.data and not album.data[0]["public"]:
                private_albums.extend(album.data)
        
        all_albums = public_albums + private_albums
        return generate_response(data=all_albums, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/paginated")
def get_paginated_albums(
    page: int = 1,
    page_size: int = 20,
    auth_data: AuthData = Depends(verify_token)
):
    """Get paginated albums user has access to"""
    try:
        offset = (page - 1) * page_size
        
        # Get public albums
        public_albums = album_db.get_by_field("public", True).data or []
        
        # Get user's private album memberships
        memberships = member_db.get_by_field("user_id", str(auth_data.user.id))
        private_album_ids = [m["album_id"] for m in memberships.data] if memberships.data else []
        
        # Get private albums user is member of
        private_albums = []
        for album_id in private_album_ids:
            album = album_db.get_by_id(album_id)
            if album.data and not album.data[0]["public"]:
                private_albums.extend(album.data)
        
        all_albums = public_albums + private_albums
        total = len(all_albums)
        
        # Manual pagination
        paginated_albums = all_albums[offset:offset + page_size]
        
        return generate_response(data={
            "albums": paginated_albums,
            "total": total,
            "page": page,
            "page_size": page_size
        }, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/me")
def get_my_albums(auth_data: AuthData = Depends(verify_token)):
    """Get all albums where the authenticated user is a member"""
    try:
        memberships = member_db.get_by_field("user_id", str(auth_data.user.id))
        if not memberships.data:
            return generate_response(data=[], status=200)
        
        albums = []
        for member in memberships.data:
            album = album_db.get_by_id(member["album_id"])
            if album.data:
                album_data = album.data[0]
                album_data["role"] = member["role"]  # Add user's role in the album
                albums.append(album_data)
        
        return generate_response(data=albums, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/users/{user_id}")
def get_user_albums(user_id: str, auth_data: AuthData = Depends(verify_token)):
    """Get all albums where specified user is a member (only public albums if not the authenticated user)"""
    try:
        memberships = member_db.get_by_field("user_id", user_id)
        if not memberships.data:
            return generate_response(data=[], status=200)
        
        albums = []
        for member in memberships.data:
            album = album_db.get_by_id(member["album_id"])
            if album.data:
                album_data = album.data[0]
                # Only include if album is public or viewer is the owner
                if album_data["public"] or str(auth_data.user.id) == user_id:
                    album_data["role"] = member["role"]
                    albums.append(album_data)
        
        return generate_response(data=albums, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/{album_id}")
def get_album(album_id: str, auth_data: AuthData = Depends(verify_token)):
    """Get album details if user has access"""
    try:
        album = album_db.get_by_id(album_id)
        if not album.data:
            return generate_response(error="Album not found", status=404)
            
        album_data = album.data[0]
        
        # Check if user has access
        if not album_data["public"]:
            membership = member_db.get_by_fields({
                "album_id": album_id,
                "user_id": str(auth_data.user.id)
            })
            if not membership.data:
                return generate_response(error="Not authorized to view this album", status=403)
            
            # Add user's role to the response
            album_data["role"] = membership.data[0]["role"]
        
        return generate_response(data=album_data, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.patch("/{album_id}")
def update_album(
    album_id: str,
    album_update: AlbumUpdate,
    auth_data: AuthData = Depends(verify_token)
):
    """Update album details (owner only)"""
    try:
        # Verify ownership
        album = album_db.get_by_id(album_id)
        if not album.data or album.data[0]["owner_id"] != str(auth_data.user.id):
            return generate_response(error="Not authorized to update this album", status=403)
        
        update_data = album_update.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        response = album_db.update(album_id, AlbumUpdate(**update_data))
        if not response.data:
            return generate_response(error="Update failed", status=400)
            
        return generate_response(data=response.data[0], status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.delete("/{album_id}")
def delete_album(album_id: str, auth_data: AuthData = Depends(verify_token)):
    """Delete album and all associated data (owner only)"""
    try:
        # Verify ownership
        album = album_db.get_by_id(album_id)
        if not album.data or album.data[0]["owner_id"] != str(auth_data.user.id):
            return generate_response(error="Not authorized to delete this album", status=403)
        
        # Delete all photos first
        photos = photo_db.get_by_field("album_id", album_id)
        if photos.data:
            for photo in photos.data:
                photo_db.delete(photo["id"])
        
        # Delete all members
        members = member_db.get_by_field("album_id", album_id)
        if members.data:
            for member in members.data:
                member_db.delete(member["id"])
        
        # Finally delete album
        response = album_db.delete(album_id)
        if not response.data:
            return generate_response(error="Delete failed", status=400)
        
        return generate_response(
            data={"message": "Album and all associated data successfully deleted"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)