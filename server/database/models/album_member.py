from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum

class MemberRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    CONTRIBUTOR = "contributor"
    VIEWER = "viewer"

class AlbumMember(BaseModel):
    id: UUID = Field(default_factory=uuid4)  # Add default UUID generation
    album_id: UUID
    user_id: UUID
    role: MemberRole
    joined_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True