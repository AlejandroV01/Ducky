from database.supabase import supabase
from fastapi import HTTPException

def verify_admin(admin_id, album_id):
    response = supabase.table('album').select('admin_id').eq('id', album_id).execute()
    
    if not response.data or response.data[0]['admin_id'] != str(admin_id):
        raise HTTPException(status_code=403, detail="User is not an admin for this album")
    
    return True