from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional

class Album(BaseModel):
    id: UUID = Field(default_factory=uuid4)  # This will generate a UUID if none is provided
    title: str
    description: str
    public: bool
    archived: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    owner_id: UUID
    cover_photo_url: Optional[str] = None
    total_photos: int = 0

    class Config:
        from_attributes = True