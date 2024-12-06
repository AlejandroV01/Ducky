from database.supabase_service import SupabaseService
from fastapi import HTTPException

"""
Check if the user making the request is the admin of the album,
used for admin protected routes, throws err if not admin
:param admin_id: the id of the user making the request
:param album_id: the id of the album to check against
"""
def verify_album_admin(admin_id, album_id):
    db = SupabaseService("album")
    response = db.get_by_id(album_id)
    if response.data:
        album = response.data[0]
        if album["admin_id"] != admin_id:
            raise HTTPException(status_code=401, detail="Unauthorized")
    else:
        raise HTTPException(status_code=404, detail="Album not found")
