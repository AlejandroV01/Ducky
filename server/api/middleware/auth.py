from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database.supabase_service import supabase, SupabaseService
from database.models import User
from pydantic import BaseModel

class AuthData(BaseModel):
    user: User
    token: str

# initialize services
user_db = SupabaseService("user")
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthData:
    """
    Verify and decode the JWT token from the Authorization header
    if the access token is valid, return the user and session data
    else, check if the refresh token is valid and refresh the session
    else, return an error if entire session is invalid
    """
    try:
        if not credentials:
            raise HTTPException(
                status_code=401,
                detail="No authorization credentials provided"
            )

        token = credentials.credentials
        
        try:

            # Now use the fresh token to get user
            auth_response = supabase.auth.get_user(token)
            if not auth_response.user:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token"
                )
                
            # Get user from our database
            user_response = user_db.get_by_id(auth_response.user.id)
            if not user_response.data:
                raise HTTPException(
                    status_code=401,
                    detail="User not found in database"
                )

            # Create User model from database response
            user = User.model_validate(user_response.data[0])

            # Return AuthData model
            return AuthData(
                user=user,  # User
                token=token # Original Token
            )

        except Exception as e:
            print(f"Auth error: {str(e)}")
            raise HTTPException(
                status_code=401,
                detail="Authentication failed"
            )

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )