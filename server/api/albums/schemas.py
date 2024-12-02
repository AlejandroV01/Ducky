from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AlbumCreate(BaseModel):
    title: str
    description: str
    public: bool

class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    public: Optional[bool] = None
    archived: Optional[bool] = None
    cover_photo_url: Optional[str] = None
    