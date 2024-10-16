from database.supabase import supabase
from uuid import UUID
from database.models.album_role import AlbumAccess

def get_album_role(album_id: UUID, user_id: UUID):
    print("bruh")


def add_album_role(album_id: UUID, user_id: UUID, role: AlbumAccess):
    print("bruh")


def update_album_role(album_id: UUID, user_id: UUID, role_id: UUID, new_role: AlbumAccess):
    print("bruh")


def delete_album_role(album_id: UUID, user_id: UUID, role_id: UUID):
    print("bruh")