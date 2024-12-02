from pydantic import BaseModel
from uuid import UUID
from database.models import MemberRole, JoinRequestStatus

class JoinRequestResponse(BaseModel):
    request_id: UUID
    status: JoinRequestStatus
    role: MemberRole = MemberRole.CONTRIBUTOR