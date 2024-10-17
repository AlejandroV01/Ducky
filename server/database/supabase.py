from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv() # loads env variables from .env

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def get_users():
    return supabase.table("user").select("*").execute()

def add_user(data):
    print(f"Adding user: {data}")
    return supabase.table("user").insert(data).execute()

def check_user_in_db(username):
    print(f"Checking user: {username}")
    # Adjust as needed for your actual supabase client and environment
    response = supabase.table("user").select("*").eq("user_name", username).execute()
    
    if not response.data or len(response.data) == 0:
        return False
    return True
