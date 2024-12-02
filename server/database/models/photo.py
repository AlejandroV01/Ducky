from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class Photo(BaseModel):
    id: UUID
    album_id: UUID
    user_id: UUID
    url: str
    storage_path: str
    file_name: str
    description: Optional[str] = None
    taken_at: Optional[datetime] = None
    uploaded_at: datetime
    size: Optional[int] = None
    mime_type: Optional[str] = None

    class Config:
        from_attributes = True