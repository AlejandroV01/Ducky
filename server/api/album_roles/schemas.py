from pydantic import BaseModel
from database.models.album_role import AlbumAccess

class CreateAlbumRole(BaseModel):
    role: AlbumAccess

    class Config:
        from_attributes = True

class UpdateAlbumRole(BaseModel):
    role: AlbumAccess

    class Config:
        from_attributes = True