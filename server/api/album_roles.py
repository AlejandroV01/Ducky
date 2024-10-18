from database.supabase import supabase
from uuid import UUID
from database.models.album_role import AlbumAccess

def get_album_role(user_id: UUID, album_id: UUID):
    return supabase.table('album_roles').select('*').eq('album_id', album_id).eq('user_id', user_id).execute()

def add_album_role(user_id: UUID, album_id: UUID, role: AlbumAccess):
    new_role = {
        'user_id': user_id,
        'album_id': album_id,
        'role': role
    }
    return supabase.table('album_roles').insert(new_role).execute()

def update_album_role(user_id: UUID, album_id: UUID, role_id: UUID, new_role: AlbumAccess):
    updated_role = {
        'role': new_role
    }
    return supabase.table('album_roles').update(updated_role).eq('album_id', album_id).eq('user_id', user_id).eq('role_id', role_id).execute()

def delete_album_role(user_id: UUID, album_id: UUID, role_id: UUID):
    return supabase.table('album_roles').delete().eq('album_id', album_id).eq('user_id', user_id).eq('role_id', role_id).execute()