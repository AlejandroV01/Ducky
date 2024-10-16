from database.supabase import supabase

def get_users():
    return supabase.table("user").select("*").execute()

def add_user(data):
    print(f"Adding user: {data}")
    return supabase.table("user").insert(data).execute()
