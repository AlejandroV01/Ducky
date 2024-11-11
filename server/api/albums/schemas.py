from pydantic import BaseModel
import uuid

class AlbumCreate(BaseModel):
    title: str
    admin_id: UUID

    class Config:
        orm_mode = True

class Album(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    admin_id: UUID  # foreign key : user table

    class Config:
        orm_mode = True