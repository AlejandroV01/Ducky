from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class AlbumCreate(BaseModel):
    title: str
    admin_id: UUID

    class Config:
        from_attributes = True

class Album(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    admin_id: UUID  # foreign key : user table

    class Config:
        from_attributes = True