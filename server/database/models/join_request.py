from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from enum import Enum

class JoinRequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class JoinRequest(BaseModel):
    id: UUID
    album_id: UUID
    user_id: UUID
    status: JoinRequestStatus = JoinRequestStatus.PENDING
    requested_at: datetime
    processed_at: Optional[datetime] = None
    processed_by: Optional[UUID] = None

    class Config:
        from_attributes = True
