from fastapi import APIRouter, Depends, HTTPException
from database.supabase_service import SupabaseService
from utils import generate_response
from ..middleware.auth import verify_token, AuthData
from database.models import AlbumMember, MemberRole, JoinRequest, JoinRequestStatus
from .schemas import JoinRequestResponse
from datetime import datetime

router = APIRouter(
    prefix="/albums/{album_id}/members",
    tags=["album members"]
)

member_db = SupabaseService("album_member")
request_db = SupabaseService("join_request")
album_db = SupabaseService("album")
photo_db = SupabaseService("photo")

def check_member_role(album_id: str, user_id: str) -> MemberRole:
    """Helper to check member's role"""
    response = member_db.get_by_fields({
        "album_id": album_id,
        "user_id": user_id
    })
    if not response.data:
        return None
    return MemberRole(response.data[0]["role"])

@router.post("/join")
def join_album(album_id: str, auth_data: AuthData = Depends(verify_token)):
    """Join or request to join an album"""
    try:
        # Verify album exists
        album = album_db.get_by_id(album_id)
        if not album.data:
            return generate_response(error="Album not found", status=404)

        # Check if already a member
        existing_role = check_member_role(album_id, str(auth_data.user.id))
        if existing_role:
            return generate_response(error="Already a member of this album", status=400)

        album_data = album.data[0]
        if album_data["archived"]:
            return generate_response(error="Cannot join archived album", status=400)

        if album_data["public"]:
            # Direct join for public albums
            member = AlbumMember(
                album_id=album_id,
                user_id=auth_data.user.id,
                role=MemberRole.CONTRIBUTOR,
                joined_at=datetime.utcnow()
            )
            response = member_db.save(member)
            return generate_response(data=response.data[0], status=200)
        else:
            # Check if already has a pending request
            existing_request = request_db.get_by_fields({
                "album_id": album_id,
                "user_id": str(auth_data.user.id),
                "status": JoinRequestStatus.PENDING
            })
            if existing_request.data:
                return generate_response(error="Already have a pending join request", status=400)

            # Create join request for private albums
            join_request = JoinRequest(
                album_id=album_id,
                user_id=auth_data.user.id,
                status=JoinRequestStatus.PENDING,
                requested_at=datetime.utcnow()
            )
            response = request_db.save(join_request)
            return generate_response(data={"message": "Join request submitted"}, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/requests")
def get_join_requests(
    album_id: str,
    page: int = 1,
    page_size: int = 20,
    auth_data: AuthData = Depends(verify_token)
):
    """Get all pending join requests (owner/admin only)"""
    try:
        # Verify permission to view requests
        role = check_member_role(album_id, str(auth_data.user.id))
        if not role or role not in [MemberRole.OWNER, MemberRole.ADMIN]:
            return generate_response(error="Not authorized to view join requests", status=403)

        offset = (page - 1) * page_size
        requests = request_db.get_by_fields({
            "album_id": album_id,
            "status": JoinRequestStatus.PENDING
        })

        total_requests = len(requests.data) if requests.data else 0
        paginated_requests = requests.data[offset:offset + page_size] if requests.data else []

        return generate_response(data={
            "requests": paginated_requests,
            "total": total_requests,
            "page": page,
            "page_size": page_size
        }, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.post("/requests/{request_id}")
def handle_join_request(
    album_id: str,
    request_id: str,
    response_data: JoinRequestResponse,
    auth_data: AuthData = Depends(verify_token)
):
    """Process join requests (owner/admin only)"""
    try:
        # Check if handler is owner or admin
        handler_role = check_member_role(album_id, str(auth_data.user.id))
        if not handler_role or handler_role not in [MemberRole.OWNER, MemberRole.ADMIN]:
            return generate_response(error="Not authorized to handle join requests", status=403)

        # Get and verify request
        request = request_db.get_by_id(request_id)
        if not request.data or request.data[0]["album_id"] != album_id:
            return generate_response(error="Invalid request", status=404)

        request_data = request.data[0]
        if request_data["status"] != JoinRequestStatus.PENDING:
            return generate_response(error="Request has already been processed", status=400)

        # Process the request
        if response_data.status == JoinRequestStatus.APPROVED:
            # Add new member
            member = AlbumMember(
                album_id=album_id,
                user_id=request_data["user_id"],
                role=response_data.role or MemberRole.CONTRIBUTOR,
                joined_at=datetime.utcnow()
            )
            member_db.save(member)

        # Update request status
        request_update = JoinRequest(
            **request_data,
            status=response_data.status,
            processed_at=datetime.utcnow(),
            processed_by=auth_data.user.id
        )
        request_db.update(request_id, request_update)

        return generate_response(
            data={"message": f"Request {response_data.status.value}"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.patch("/{user_id}/role")
def update_member_role(
    album_id: str,
    user_id: str,
    new_role: MemberRole,
    auth_data: AuthData = Depends(verify_token)
):
    """Update member role following permission hierarchy"""
    try:
        # Get roles
        updater_role = check_member_role(album_id, str(auth_data.user.id))
        target_role = check_member_role(album_id, user_id)

        # Validate roles exist
        if not updater_role or not target_role:
            return generate_response(error="Invalid member", status=404)

        # Prevent changing to owner role
        if new_role == MemberRole.OWNER:
            return generate_response(error="Cannot assign owner role", status=400)

        # Role hierarchy checks
        if updater_role == MemberRole.OWNER:
            if target_role == MemberRole.OWNER:
                return generate_response(error="Cannot modify owner role", status=403)
        elif updater_role == MemberRole.ADMIN:
            if target_role in [MemberRole.OWNER, MemberRole.ADMIN]:
                return generate_response(error="Admins cannot modify owner or other admin roles", status=403)
            if new_role == MemberRole.ADMIN:
                return generate_response(error="Admins cannot promote to admin", status=403)
        else:
            return generate_response(error="Not authorized to update roles", status=403)

        # Update role
        member_data = AlbumMember(
            album_id=album_id,
            user_id=user_id,
            role=new_role,
            joined_at=datetime.utcnow()
        )
        response = member_db.update(user_id, member_data)
        return generate_response(data=response.data[0], status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.delete("/{user_id}")
def remove_member(
    album_id: str,
    user_id: str,
    auth_data: AuthData = Depends(verify_token)
):
    """Remove member and their photos following permission hierarchy"""
    try:
        # Get roles
        remover_role = check_member_role(album_id, str(auth_data.user.id))
        target_role = check_member_role(album_id, user_id)

        # Validate roles exist
        if not remover_role or not target_role:
            return generate_response(error="Invalid member", status=404)

        # Cannot remove owner
        if target_role == MemberRole.OWNER:
            return generate_response(error="Cannot remove owner", status=403)

        # Role hierarchy checks
        if remover_role == MemberRole.OWNER:
            # Owner can remove anyone except themselves
            pass
        elif remover_role == MemberRole.ADMIN:
            if target_role in [MemberRole.OWNER, MemberRole.ADMIN]:
                return generate_response(error="Admins cannot remove owner or other admins", status=403)
        else:
            return generate_response(error="Not authorized to remove members", status=403)

        # Remove member's photos
        photos = photo_db.get_by_fields({
            "album_id": album_id,
            "user_id": user_id
        })
        if photos.data:
            for photo in photos.data:
                photo_db.delete(photo["id"])

        # Remove member
        response = member_db.delete(user_id)
        return generate_response(
            data={"message": "Member and their photos removed successfully"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/")
def get_album_members(
    album_id: str,
    page: int = 1,
    page_size: int = 20,
    auth_data: AuthData = Depends(verify_token)
):
    """Get paginated list of album members"""
    try:
        # Check if user has access to album
        role = check_member_role(album_id, str(auth_data.user.id))
        album = album_db.get_by_id(album_id)
        
        if not album.data:
            return generate_response(error="Album not found", status=404)
            
        if not album.data[0]["public"] and not role:
            return generate_response(error="Not authorized to view members", status=403)

        # Get paginated members
        offset = (page - 1) * page_size
        members = member_db.get_paginated(page_size, offset)
        total_members = len(member_db.get_by_field("album_id", album_id).data)

        return generate_response(data={
            "members": members.data,
            "total": total_members,
            "page": page,
            "page_size": page_size
        }, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)