from fastapi import APIRouter
from .schemas import CreateVerificationRequest, VerifyCodeRequest
from database.supabase_service import SupabaseService
from database.models import VerificationAttempt, User
from utils import generate_response, send_verification_email, send_welcome_email, verify_password, hash_password, generate_tokens
from datetime import datetime, timedelta, timezone
from fastapi import Response
import uuid

router = APIRouter(
    prefix="/verification",
    tags=["verification"]
)

verification_db = SupabaseService("verification_attempt")
pending_user_db = SupabaseService("pending_user")
user_db = SupabaseService("user")

"""
Send new verification code to email
- **returns**: verification code via email
"""
@router.post("/resend")
def resend_verification(data: CreateVerificationRequest):
    try:
        # check if there's an existing verification for the email
        existing_verification = verification_db.get_by_field("email", data.email).data[0]

        if existing_verification:
            current_time = datetime.now(timezone.utc)
            expires_at = datetime.fromisoformat(existing_verification["expires_at"])
            created_at = datetime.fromisoformat(existing_verification["created_at"])
            
            # if verification is still valid (not expired)
            if expires_at > current_time:
                time_left = (expires_at - current_time).seconds
                return generate_response(
                    error=f"Verification code still valid for {time_left} seconds",
                    status=400
                )

            # check cooldown period (30 minutes since last code)
            time_since_creation = current_time - created_at
            if time_since_creation.total_seconds() < 1800:  # 30 minutes
                wait_time = 1800 - int(time_since_creation.total_seconds())
                return generate_response(
                    error=f"Please wait {wait_time} seconds before requesting a new code",
                    status=400
                )
                
            # delete old verification if passed cooldown
            verification_db.delete(existing_verification["id"])

        # check if there's a pending user with the email
        if not pending_user_db.get_by_field("email", existing_verification["email"]).data:
            return generate_response(
                error="No pending registration found",
                status=400
            )

        # create new verification if pending user exists
        code = str(uuid.uuid4())[:6].upper()
        verification = VerificationAttempt(
            id=uuid.uuid4(),
            email=existing_verification["email"],
            code=code,
            attempts=0,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            created_at=datetime.now(timezone.utc)
        )
        
        saved_verification = verification_db.save(verification)
        
        if not saved_verification.data:
            return generate_response(
                error="Failed to create verification",
                status=500
            )
        
        # delete old verification
        verification_db.delete(existing_verification["id"])

        # send new verification email
        if not send_verification_email(data.email, code):
            verification_db.delete(verification.id)
            return generate_response(
                error="Failed to send verification email",
                status=500
            )

        return generate_response(
            data={"message": "New verification code sent"},
            status=200
        )
    except Exception as e:
        return generate_response(error=str(e), status=500)
    

"""
Verify email with code to email
- **returns**: access token and user data in body, refresh token in cookie
"""
@router.post("/verify")
def verify_code(data: VerifyCodeRequest, response: Response):
    try:
        # get verification attempt by email
        get_verification_attempt = verification_db.get_by_field("email", data.email)

        if not get_verification_attempt.data:
            return generate_response(error="No verification attempt found", status=400)

        verification_attempt = get_verification_attempt.data[0]

        current_time = datetime.now(timezone.utc)
        created_at = datetime.fromisoformat(verification_attempt["created_at"])
        expires_at = datetime.fromisoformat(verification_attempt["expires_at"])

        # check if verification code has been attempted more than 3 times
        # if so, return time to wait which is 30 minutes after the last code (verification attempt) was sent
        if verification_attempt["attempts"] >= 3:
            # calculate time until they can request a new code (30 minutes from creation)
            cooldown_end = created_at + timedelta(minutes=30)
            if current_time < cooldown_end:
                wait_time = int((cooldown_end - current_time).total_seconds())
                return generate_response(
                    error=f"Too many attempts. Please wait {wait_time} seconds before requesting a new code",
                    status=400
                )
            else:
                return generate_response(
                    error="Maximum attempts reached. Please request a new code",
                    status=400
                )

        # check if verification code has expired
        # (verfications expire after 10 minutes, the time to request a new code is 30 minutes from the last code request)
        if current_time > expires_at:
            # Calculate if they can request a new code yet
            cooldown_end = created_at + timedelta(minutes=30)
            if current_time < cooldown_end:
                wait_time = int((cooldown_end - current_time).total_seconds())
                return generate_response(
                    error=f"Code expired. Please wait {wait_time} seconds before requesting a new code",
                    status=400
                )
            else:
                return generate_response(
                    error="Code expired. You may request a new code now",
                    status=400
                )


        # check if code is correct, if not increment attempts
        if verification_attempt["code"] != data.code:
            # increment attempts
            verification_attempt["attempts"] += 1
            verification_attempt = VerificationAttempt(**verification_attempt)
            verification_db.update(verification_attempt.id, verification_attempt)
            
            attempts_left = 3 - verification_attempt.attempts
            return generate_response(
                error=f"Invalid code. {attempts_left} attempts remaining",
                status=400
            )

        # get pending user
        pending_user = pending_user_db.get_by_field("email", data.email)
        if not pending_user.data:
            return generate_response(error="No pending registration found", status=400)

        pending_user_data = pending_user.data[0]
        
        new_user = User(
            id=uuid.uuid4(),
            email=pending_user_data["email"],
            password=hash_password(pending_user_data["password"]),
            first_name=pending_user_data["first_name"],
            last_name=pending_user_data["last_name"],
            user_name=pending_user_data["user_name"],
            icon_url=None,
            is_verified=True,
            auth_provider="email",
            last_login=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
            login_attempts=0,
            last_failed_login=None
        )

        # save user to database
        user_data = user_db.save(new_user).data[0]
        user_data.pop("password", None)

        # generate access and refresh tokens
        tokens = generate_tokens(str(new_user.id))

        # set refresh token as HTTP-only cookie
        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh_token"],
            httponly=True,
            secure=True,  # for HTTPS
            samesite="None",
            max_age=1814400  # 3 weeks in seconds
        )
        
        # clean up
        verification_db.delete(verification_attempt["id"])
        pending_user_db.delete(pending_user_data["id"])

        '''
        # Send welcome email
        send_welcome_email(new_user.email, new_user.user_name)
        '''
        return generate_response(
            data={
                "message": "Account verified and created successfully",
                "access_token": tokens["access_token"],
                "user": user_data
            },
            status=200
        )
        
    except Exception as e:
        return generate_response(error=str(e), status=500)