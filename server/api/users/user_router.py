from fastapi import APIRouter, Depends
from database.supabase_service import SupabaseService
from utils import generate_response
from ..middleware.auth import verify_token, AuthData
from .schemas import UserUpdateModel

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

db = SupabaseService("user")

# returns the current user
'''
requires a valid token to access
'''
@router.get("/me")
def get_current_user(auth_data: AuthData = Depends(verify_token)):
    try:
        user_data = auth_data.user.model_dump(
            exclude={
                'password',
                'login_attempts',
                'last_failed_login'
            }
        )
        return generate_response(data=user_data, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)


@router.get("/")
def get_all_users(auth_data: AuthData = Depends(verify_token)):
    """
    Get all users. Requires authentication.
    Returns a list of all users with sensitive information excluded.
    """
    try:
        response = db.get_all()
        if not response.data:
            return generate_response(data=[], status=200)
        
        users = [
            {k: v for k, v in user.items() if k not in ['password', 'login_attempts', 'last_failed_login']}
            for user in response.data
        ]
        
        return generate_response(data=users, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

# Move paginated route BEFORE the /{id} route
# http://localhost:8000/users/paginated/?page=1
# http://localhost:8000/users/paginated/?page=1&page_size=5
@router.get("/paginated/")
def get_users_paginated(
    page: int = 1,
    page_size: int = 20,
    auth_data: AuthData = Depends(verify_token)
):
    """
    Get paginated users. Requires authentication.
    Returns a page of users with sensitive information excluded.
    """
    try:
        offset = (page - 1) * page_size

        response = db.get_paginated(limit=page_size, offset=offset)
        if not response.data:
            return generate_response(data={
                "users": [],
                "page": page,
                "page_size": page_size,
                "total": 0
            }, status=200)

        users = [
            {k: v for k, v in user.items() if k not in ['password', 'login_attempts', 'last_failed_login']}
            for user in response.data
        ]

        total_users = len(db.get_all().data)

        return generate_response(data={
            "users": users,
            "page": page,
            "page_size": page_size,
            "total": total_users
        }, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.get("/{id}")
def get_user_by_id(id: str, auth_data: AuthData = Depends(verify_token)):
    """
    Get user by ID. Requires authentication.
    Returns the user data with sensitive information excluded.
    """
    try:
        response = db.get_by_id(id)
        if not response.data:
            return generate_response(error="User not found", status=404)
        
        user_data = {
            k: v for k, v in response.data[0].items() 
            if k not in ['password', 'login_attempts', 'last_failed_login']
        }
        
        return generate_response(data=user_data, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

@router.patch("/{id}")
def update_user(
    id: str,
    user_update: UserUpdateModel,
    auth_data: AuthData = Depends(verify_token)
):
    """
    Update user by ID. User can only update their own data.
    Requires authentication and authorization (must be the same user).
    """
    try:
        # Check if the authenticated user is trying to update their own data
        if str(auth_data.user.id) != id:
            return generate_response(
                error="Not authorized to update this user",
                status=403
            )

        # Get existing user data
        existing_user = db.get_by_id(id)
        if not existing_user.data:
            return generate_response(error="User not found", status=404)

        # Get current user data as dictionary
        current_user_data = existing_user.data[0]

        # Get update data, excluding unset fields
        update_data = user_update.model_dump(exclude_unset=True)
        
        # Remove protected fields from update data
        update_data.pop('email', None)
        update_data.pop('password', None)
        update_data.pop('login_attempts', None)
        update_data.pop('last_failed_login', None)

        # Merge current data with update data
        merged_data = {
            **current_user_data,
            **update_data
        }

        # Create new UserUpdateModel with merged data
        user_model = UserUpdateModel(**merged_data)

        # Update user in database
        response = db.update(id, user_model)
        if not response.data:
            return generate_response(error="Update failed", status=400)

        # Remove sensitive information for response
        updated_user = {
            k: v for k, v in response.data[0].items()
            if k not in ['password', 'login_attempts', 'last_failed_login']
        }

        return generate_response(data=updated_user, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)

"users/id"
@router.delete("/{id}")
def delete_user(id: str, auth_data: AuthData = Depends(verify_token)):
    
    

    """
    Delete user by ID. User can only delete their own account.
    Requires authentication and authorization (must be the same user).
    """
    try:
        # Check if the authenticated user is trying to delete their own account
        if str(auth_data.user.id) != id:
            return generate_response(
                error="Not authorized to delete this user",
                status=403
            )

        # Verify user exists
        existing_user = db.get_by_id(id)
        if not existing_user.data:
            return generate_response(error="User not found", status=404)

        # Delete user
        response = db.delete(id)
        if not response.data:
            return generate_response(error="Delete failed", status=400)

        return generate_response(
            data={"message": "User successfully deleted"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)
    

@router.get("/album/{album_id}/members")
def get_album_members_with_roles(
    album_id: str, 
    auth_data: AuthData = Depends(verify_token)
):
    """
    Get all users in an album who have a role that is not 'none'.
    Requires authentication.
    """
    try:
        # Fetch users with roles in the album
        query = """
            SELECT 
                u.id, u.email, u.first_name, u.last_name, u.user_name, 
                u.icon_url, u.is_verified, ar.role
            FROM 
                users AS u
            INNER JOIN 
                album_role AS ar 
            ON 
                u.id = ar.user_id
            WHERE 
                ar.album_id = %s AND ar.role != 'none'
        """
        response = db.execute_query(query, [album_id])
        
        if not response.data:
            return generate_response(data=[], status=200)

        # Exclude sensitive information and return
        members = [
            {
                "id": user["id"],
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "user_name": user["user_name"],
                "icon_url": user["icon_url"],
                "is_verified": user["is_verified"],
                "role": user["role"]
            }
            for user in response.data
        ]
        
        return generate_response(data=members, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)
