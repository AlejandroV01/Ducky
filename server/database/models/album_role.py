from pydantic import BaseModel
from uuid import UUID
from enum import Enum

class AlbumAccess(str, Enum):
    owner = "owner"
    viewer = "viewer"
    editor = "editor"
    none = "none"

class AlbumRole(BaseModel):
    id: UUID
    user_id: UUID  # foreign key : user table
    album_id: UUID  # foreign key : album table
    role: AlbumAccess

