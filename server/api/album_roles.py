from database.supabase import supabase

# PUBLIC ROUTES

def get_album_role(user_id, album_id):
    return supabase.table('album_role').select('*').eq('album_id', album_id).eq('user_id', user_id).execute()

# ADMIN ROUTES

def add_album_role(user_id, album_id, role):

    new_role = {
        'user_id': user_id,
        'album_id': album_id,
        'role': role
    }
    return supabase.table('album_role').insert(new_role).execute()

def update_album_role(user_id, album_id, id, new_role):
    updated_role = {
        'role': new_role
    }
    return supabase.table('album_role').update(updated_role).eq('album_id', album_id).eq('user_id', user_id).eq('id', id).execute()

def delete_album_role(user_id, album_id, id):
    return supabase.table('album_role').delete().eq('album_id', album_id).eq('user_id', user_id).eq('id', id).execute()