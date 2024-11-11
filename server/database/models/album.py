from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class Album(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    admin_id: UUID  # foreign key : user table

    class Config:
        from_attributes = True
