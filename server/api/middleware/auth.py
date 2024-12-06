from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database.supabase_service import SupabaseService
from database.models import User
from pydantic import BaseModel
import jwt
import os
from utils import generate_response, generate_tokens

# Get environment variables
ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
REFRESH_TOKEN_SECRET = os.getenv('REFRESH_TOKEN_SECRET')

class AuthData(BaseModel):
    user: User
    token: str

# Initialize services
user_db = SupabaseService("user")
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security), request: Request = None) -> AuthData:
    """
    Verify and decode the JWT token from the Authorization header.
    If access token is expired, attempt to use refresh token to get new access token.
    Returns AuthData containing user info and token if valid.
    """
    try:
        if not credentials:
            raise HTTPException(
                status_code=401,
                detail="No authorization credentials provided"
            )

        token = credentials.credentials

        try:
            # Try to decode the access token
            payload = jwt.decode(
                token,
                ACCESS_TOKEN_SECRET,
                algorithms=["HS256"]
            )

            # Verify it's an access token
            if payload.get("type") != "access":
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token type"
                )

            user_id = payload.get("user_id")

        except jwt.ExpiredSignatureError:
            # Access token expired, try to use refresh token
            refresh_token = request.cookies.get("refresh_token") if request else None
            
            if not refresh_token:
                raise HTTPException(
                    status_code=401,
                    detail="Access token expired and no refresh token provided"
                )

            try:
                # Verify refresh token
                refresh_payload = jwt.decode(
                    refresh_token,
                    REFRESH_TOKEN_SECRET,
                    algorithms=["HS256"]
                )

                if refresh_payload.get("type") != "refresh":
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid refresh token type"
                    )

                # Generate new tokens using the imported function
                user_id = refresh_payload.get("user_id")
                new_tokens = generate_tokens(user_id)
                
                # Use new access token
                token = new_tokens["access_token"]

            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                raise HTTPException(
                    status_code=401,
                    detail="Refresh token is invalid or expired"
                )

        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        # Get user from database
        user_response = user_db.get_by_id(user_id)
        if not user_response.data:
            raise HTTPException(
                status_code=401,
                detail="User not found in database"
            )

        # Create User model from database response
        user = User.model_validate(user_response.data[0])

        return AuthData(
            user=user,
            token=token
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return generate_response(error="Authentication failed", status=401)