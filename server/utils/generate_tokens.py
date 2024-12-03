from datetime import datetime, timedelta
import jwt
import os

ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
REFRESH_TOKEN_SECRET = os.getenv('REFRESH_TOKEN_SECRET')

def generate_tokens(user_id: str):
    """
    Create access and refresh tokens containing the user's ID
    """
    # create access token (1 hour)
    access_token_expires = datetime.utcnow() + timedelta(hours=1)
    access_token_data = {
        "user_id": str(user_id),
        "exp": access_token_expires,
        "type": "access"
    }
    access_token = jwt.encode(
        access_token_data,
        ACCESS_TOKEN_SECRET,
        algorithm="HS256"
    )

    # create refresh token (3 weeks)
    refresh_token_expires = datetime.utcnow() + timedelta(weeks=3)
    refresh_token_data = {
        "user_id": str(user_id),
        "exp": refresh_token_expires,
        "type": "refresh"
    }
    refresh_token = jwt.encode(
        refresh_token_data,
        REFRESH_TOKEN_SECRET,
        algorithm="HS256"
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }
