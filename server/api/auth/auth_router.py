from fastapi import APIRouter
from .schemas import SignUpRequest, SignInRequest, GoogleCallbackRequest
from database.supabase_service import SupabaseService, supabase
from ..users.schemas import UserUpdateModel
from database.models import PendingUser, VerificationAttempt, User
from utils import generate_response, verify_password, send_verification_email, generate_tokens
from datetime import datetime, timedelta, timezone
from ..middleware.auth import verify_token, AuthData
import httpx

from fastapi import Request
import jwt
import os

REFRESH_TOKEN_SECRET = os.getenv("REFRESH_TOKEN_SECRET")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

from fastapi import Response
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

user_db = SupabaseService("user")
pending_user_db = SupabaseService("pending_user")
verification_db = SupabaseService("verification_attempt")

'''
test route
'''
@router.post("/test")
def test():
    user = user_db.get_by_id("6536362c-5c9e-4193-bc9b-ba5a7ad91f75").data[0]

    update_data = {
        **user,
        'first_name': 'Bob',
        'last_name': 'Demarcus'
    }

    update_data.pop('password', None)
    data = UserUpdateModel(**update_data)

    new_user = user_db.update("6536362c-5c9e-4193-bc9b-ba5a7ad91f75", data).data[0]
    new_user.pop('password', None)
    return generate_response(data={"message": "Hello World!", "user": new_user}, status=200)

'''
ex. request
{
    "email": "",
    "password": "",
    "first_name": "",
    "last_name": "",
    "user_name": ""
}
'''
@router.post("/signup")
def signup(data: SignUpRequest):
    print("entering signup with this data", data) 
    try:
        # Check if email already exists in active users
        if user_db.get_by_field("email", data.email).data:
            return generate_response(error="Email already registered", status=400)
        
        # Check if username is already taken
        if user_db.get_by_field("user_name", data.user_name).data:
            return generate_response(error="Username already taken", status=400)
        
        # Create active user
        new_user = User(
            id=uuid.uuid4(),
            email=data.email,
            password=data.password,
            first_name=data.first_name,
            last_name=data.last_name,
            user_name=data.user_name,
            auth_provider="email",
            created_at=datetime.now(timezone.utc)
        )
        
        # Store new user in active users database
        result = user_db.save(new_user)
        if not result.data:
            return generate_response(error="Failed to create user", status=500)

        # Return success response
        return generate_response(
            data={"message": "Signup successful"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)



'''
ex. request
{
    "email": "",
    "password": ""
}
'''
@router.post("/signin")
def signin(request: SignInRequest, response: Response):
    print(f"Received Payload: {request.dict()}")
    try:
        # Fetch the user by email
        user = user_db.get_by_field("email", request.email)
        if not user.data:
            return generate_response(error="Invalid credentials", status=401)

        user_data = user.data[0]
        print("1")
        # Debugging: Log password fields
        print(f"Request Password: {request.password} (Type: {type(request.password)})")
        print(f"User Password: {user_data['password']} (Type: {type(user_data['password'])})")

        # Ensure both passwords are strings
        if not isinstance(request.password, str) or not isinstance(user_data["password"], str):
            return generate_response(error="Invalid credentials", status=401)
        print("2")
        # Check if the account is locked
        if user_data.get('login_attempts', 0) >= 5:
            last_attempt = datetime.fromisoformat(user_data.get('last_failed_login', ''))
            lockout_duration = datetime.now(timezone.utc) - last_attempt
            print("3")
            if lockout_duration.total_seconds() < 600:  # 10 minutes
                return generate_response(
                    error="Account is locked. Please try again later.",
                    status=401
                )
            else:
                # Reset attempts after lockout period
                update_data = {
                    **user_data,
                    'login_attempts': 0,
                    'last_failed_login': None
                }
                user_update = UserUpdateModel(**update_data)
                user_db.update(user_data["id"], user_update)
        print("4")
        # Verify the password directly
        if request.password == user_data["password"]:
            user_update_data = {
                **user_data,
                'login_attempts': 0,
                'last_failed_login': None,
                'last_login': datetime.now(timezone.utc)
            }
            print("5")
            # Reset login attempts and update last login
            user_update = UserUpdateModel(**user_update_data)
            print("5.1")
            updated_user = user_db.update(user_data["id"], user_update).data[0]
            print("5.2")
            updated_user.pop('password', None)
            print("5.3")
            # Generate tokens
            tokens = generate_tokens(str(user_data["id"]))
            print("5.4")
            print("6")
            # Set refresh token as HTTP-only cookie
            response.set_cookie(
                key="refresh_token",
                value=tokens["refresh_token"],
                httponly=True,
                secure=True,  # For HTTPS
                samesite="None",
                max_age=1814400  # 3 weeks in seconds
            )
            print("7")
            # Return user data and session info
            print("Response Data Sent:", {
    "message": "Signed in successfully",
    "access_token": tokens["access_token"],
    "user": updated_user
})
            return generate_response(
                
                data={
                    "message": "Signed in successfully",
                    "access_token": tokens["access_token"],
                    "user": updated_user
                },
                status=200
            )
        else:
            # Increment login attempts on incorrect password
            print("8")
            current_attempts = user_data.get('login_attempts', 0) + 1
            user_update_data = {
                **user_data,
                'login_attempts': current_attempts,
                'last_failed_login': datetime.now(timezone.utc)
            }
            print("9")
            user_update = UserUpdateModel(**user_update_data)
            user_db.update(user_data["id"], user_update)
            print("10")
            return generate_response(error="Invalid credentials", status=401)
    except Exception as e:
        print("11")
        print(f"Signin error: {str(e)}")
        return generate_response(error=str(e), status=500)




'''
ex. request, have a refresh token cookie set
credentials = True
'''
@router.post("/signout")
def signout(response: Response):
    try:
        # invalidate previous refresh token cookie by setting it to empty with immediate expiry
        response.set_cookie(
            key="refresh_token",
            value="",  # empty value
            httponly=True,
            secure=True,
            samesite="None",
            expires=0,  # immediate expiration
            max_age=0   # alternative way to expire immediately
        )
        
        return generate_response(
            data={"message": "Signed out successfully"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500) # refresh token extends current user session

'''
ex. request
credentials = True
'''
@router.post("/refresh")
def refresh_session(response: Response, request: Request):
    try:
        print("refreshing session", request.cookies)
        # get refresh token from cookie
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            return generate_response(
                error="No refresh token found",
                status=401
            )
        print("refresh token", refresh_token)

        try:
            # verify refresh token
            decoded = jwt.decode(
                refresh_token,
                REFRESH_TOKEN_SECRET,
                algorithms=["HS256"]
            )
            print("decoded", decoded)

            # check if it's actually a refresh token
            if decoded["type"] != "refresh":
                return generate_response(
                    error="Invalid token type",
                    status=401
                )

            # get user
            user = user_db.get_by_id(decoded["user_id"])
            if not user.data:
                return generate_response(
                    error="User not found",
                    status=404
                )
            print("user", user.data[0])

            # generate new tokens
            tokens = generate_tokens(decoded["user_id"])

            # set new refresh token cookie
            response.set_cookie(
                key="refresh_token",
                value=tokens["refresh_token"],
                httponly=True,
                secure=True,
                samesite="None",
                max_age=1814400  # 3 weeks
            )

            # remove password from user data
            user_data = user.data[0]
            user_data.pop("password", None)

            return generate_response(
                data={
                    "message": "Token refreshed successfully",
                    "access_token": tokens["access_token"],
                    "user": user_data
                },
                status=200
            )

        except jwt.ExpiredSignatureError:
            return generate_response(
                error="Refresh token expired",
                status=401
            )
        except jwt.InvalidTokenError:
            return generate_response(
                error="Invalid refresh token",
                status=401
            )

    except Exception as e:
        return generate_response(
            error=str(e),
            status=500
        )


'''
ex. request
{
    "code": ""
}
'''
@router.post("/google/callback")
async def google_callback(request: GoogleCallbackRequest, response: Response):
    try:
        # exchange code for Google access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": request.code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": "http://localhost:3000/auth/google/callback",  # match frontend redirect URI
            "grant_type": "authorization_code"
        }

        async with httpx.AsyncClient() as client:
            # get tokens from Google
            token_response = await client.post(token_url, data=token_data)
            if not token_response.is_success:
                return generate_response(error="Failed to exchange code for tokens", status=400)
            
            google_tokens = token_response.json()
            
            # get user info using access token
            user_info = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {google_tokens['access_token']}"}
            )
            if not user_info.is_success:
                return generate_response(error="Failed to get user info", status=400)
            
            google_user = user_info.json()

        # check if user exists
        users = user_db.get_by_field("email", google_user["email"])
        existing_user = users.data[0] if users.data else None

        if existing_user:
            # update last login
            update_data = {
                **existing_user,
                'last_login': datetime.now(timezone.utc)
            }
            update_data.pop('password', None)
            
            user_update = UserUpdateModel(**update_data)
            user = user_db.update(existing_user["id"], user_update).data[0]
        else:
            # create new user
            new_user = User(
                id=uuid.uuid4(),
                email=google_user["email"],
                password=None,
                first_name=google_user.get("given_name", ""),
                last_name=google_user.get("family_name", ""),
                user_name=google_user["email"].split('@')[0],
                icon_url=google_user.get("picture"),
                is_verified=True,
                auth_provider="google",
                last_login=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc),
                login_attempts=0,
                last_failed_login=None
            )
            
            user = user_db.save(new_user).data[0]


        # generate our app's tokens
        tokens = generate_tokens(user["id"])

        # remove password from user data
        user.pop("password", None)

        # set refresh token cookie
        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh_token"],
            httponly=True,
            secure=True,
            samesite="None",
            max_age=1814400  # 3 weeks
        )

        print("THE USER WITHOUT PASSWORD", user)
        print("THE TOKENS", tokens)
        print("ACCESS TOKEN", tokens["access_token"])

        # return access token and user data
        return generate_response(
            data={
                "message": "Google sign in successful",
                "access_token": tokens["access_token"],
                "user": user
            },
            status=200
        )

    except Exception as e:
        print(f"Google callback error: {str(e)}")
        return generate_response(error=str(e), status=500)
