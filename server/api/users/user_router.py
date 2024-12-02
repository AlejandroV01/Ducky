from fastapi import APIRouter, Depends
from database.supabase_service import SupabaseService
from utils import generate_response
from ..middleware.auth import verify_token, AuthData

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

db = SupabaseService("user")

# returns the current user
@router.get("/me")
def get_current_user(auth_data: AuthData = Depends(verify_token)):
    try:
        user_data = auth_data.user.model_dump(
            exclude={
                'password'
            }
        )
        return generate_response(data=user_data, status=200)
    except Exception as e:
        return generate_response(error=str(e), status=500)