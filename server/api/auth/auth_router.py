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

"""
test route
"""
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


@router.post("/signup")
def signup(data: SignUpRequest):
    try:
        # check if email exists in pending users
        if pending_user_db.get_by_field("email", data.email).data:
            return generate_response(
                error="Email pending verification. Please check your email or wait to request a new code.",
                status=400
            )
        
        # check if email exists in active users
        if user_db.get_by_field("email", data.email).data:
            return generate_response(error="Email already registered", status=400)
        
        # check username in pending users
        if pending_user_db.get_by_field("user_name", data.user_name).data:
            return generate_response(error="Username already taken", status=400)
        
        # check username in active users
        if user_db.get_by_field("user_name", data.user_name).data:
            return generate_response(error="Username already taken", status=400)

        # generate verification code
        code = str(uuid.uuid4())[:6].upper()
        
        # create verification attempt (10 minute expiry)
        verification = VerificationAttempt(
            id=uuid.uuid4(),
            email=data.email,
            code=code,
            attempts=0,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            created_at=datetime.now(timezone.utc)
        )
        
        # store new verification attempt
        verification_result = verification_db.save(verification)
        if not verification_result.data:
            return generate_response(error="Failed to create verification", status=500)
                
        # create pending user
        pending_user = PendingUser(
            id=uuid.uuid4(),
            email=data.email,
            password=data.password,
            first_name=data.first_name,
            last_name=data.last_name,
            user_name=data.user_name,
            auth_provider="email",
            created_at=datetime.now(timezone.utc)
        )
        
        # store pending user
        pending_result = pending_user_db.save(pending_user)

        if not pending_result.data:
            # clean up verification if pending user fails
            verification_db.delete(verification.id)
            return generate_response(error="Failed to create pending user", status=500)
        
        # send verification email using Resend
        if not send_verification_email(data.email, code):
            # clean up everything if email fails
            verification_db.delete(verification.id)
            pending_user_db.delete(pending_user.id)
            return generate_response(error="Failed to send verification email", status=500)

        # return success response
        return generate_response(
            data={"message": "Verification code sent"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)


@router.post("/signin")
def signin(request: SignInRequest, response: Response):
    try:
        user = user_db.get_by_field("email", request.email)
        if not user.data:
            return generate_response(error="Invalid credentials", status=401)

        user_data = user.data[0]

        # check if account is locked due to failed attempts
        if user_data.get('login_attempts', 0) >= 5:
            last_attempt = datetime.fromisoformat(user_data.get('last_failed_login', ''))
            lockout_duration = datetime.now(timezone.utc) - last_attempt
            
            if lockout_duration.total_seconds() < 600:  # 10 minutes
                return generate_response(
                    error="Account is locked. Please try again later.",
                    status=401
                )
            else:
                # reset attempts after lockout period
                update_data = {
                    **user_data,
                    'login_attempts': 0,
                    'last_failed_login': None
                }
                user_update = UserUpdateModel(**update_data)
                user_db.update(user_data["id"], user_update)
        

        is_password_correct = verify_password(request.password, user_data["password"])

        # verify password and create session with 3 week expiry
        if is_password_correct:

            user_update_data = {
                **user_data,
                'login_attempts': 0,
                'last_failed_login': None,
                'last_login': datetime.now(timezone.utc)
            }

            # reset attempts and update last login
            user_update = UserUpdateModel(**user_update_data)

            updated_user = user_db.update(user_data["id"], user_update).data[0]
            updated_user.pop('password', None)

            # generate tokens
            tokens = generate_tokens(str(user_data["id"]))

            # set refresh token as HTTP-only cookie
            response.set_cookie(
                key="refresh_token",
                value=tokens["refresh_token"],
                httponly=True,
                secure=True,  # for HTTPS
                samesite="None",
                max_age=1814400  # 3 weeks in seconds
            )                

            # Return user data and session info
            return generate_response(
                data={
                    "message": "Signed in successfully",
                    "access_token": tokens["access_token"],
                    "user": updated_user
                },
                status=200
            )
        
        else:
            current_attempts = user_data.get('login_attempts', 0) + 1
            user_update_data = {
                **user_data,
                'login_attempts': current_attempts,
                'last_failed_login': datetime.now(timezone.utc)
            }
            user_update = UserUpdateModel(**user_update_data)
            user_db.update(user_data["id"], user_update)
            return generate_response(error="Invalid credentials", status=401)
    except Exception as e:
        return generate_response(error=str(e), status=500)


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
