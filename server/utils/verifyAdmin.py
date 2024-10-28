from database.supabase_service import SupabaseService
from utils import response_generator

'''
Check if the 'admin' making a request is actually
the admin of the album, used for admin protected routes
'''
def verify_admin(admin_id, album_id):
    db = SupabaseService("album")
    response = db.get_by_id(album_id)
    if response.data:
        album = response.data[0]
        if album["admin_id"] != admin_id:
            response_generator.generate_response(error="Unauthorized", status=401)
    else:
        response_generator.generate_response(error="Album not found", status=404)