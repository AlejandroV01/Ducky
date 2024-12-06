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
    print("generate_tokens.py user_id: ", user_id)
    access_token_expires = datetime.utcnow() + timedelta(hours=1)
    print("100")
    access_token_data = {
        "user_id": str(user_id),
        "exp": access_token_expires,
        "type": "access"
    }
    print('101')
    print("access_token_data: ", access_token_data)
    print("ACCESS_TOKEN_SECRET: ", ACCESS_TOKEN_SECRET)
    access_token = jwt.encode(
        access_token_data,
        ACCESS_TOKEN_SECRET,
        algorithm="HS256"
    )
    print('102')
    # create refresh token (3 weeks)
    refresh_token_expires = datetime.utcnow() + timedelta(weeks=3)
    print('103')
    refresh_token_data = {
        "user_id": str(user_id),
        "exp": refresh_token_expires,
        "type": "refresh"
    }
    print('104')
    refresh_token = jwt.encode(
        refresh_token_data,
        REFRESH_TOKEN_SECRET,
        algorithm="HS256"
    )
    print('105')
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }
