from supabase import create_client, Client
from dotenv import load_dotenv
import os

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

load_dotenv() # loads env variables from .env

def get_users():
    return supabase.table("user").select("*").execute()

def add_user(data):
    return supabase.table("user").insert(data).execute()
