from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class PhotoCreate(BaseModel):
    description: Optional[str] = None
    taken_at: Optional[datetime] = None

class PhotoUpdate(BaseModel):
    description: Optional[str] = None
    taken_at: Optional[datetime] = None

class PhotoResponse(BaseModel):
    id: UUID
    url: str
    description: Optional[str]
    taken_at: Optional[datetime]
    uploaded_at: datetime
    uploaded_by: UUID  # user_id of uploader