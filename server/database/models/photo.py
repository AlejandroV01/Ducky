from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class Photo(BaseModel):
    id: UUID
    url: str
    caption: str
    created_at: datetime
    album_id: UUID  # foreign key : album table

    class Config:
        from_attributes = True
