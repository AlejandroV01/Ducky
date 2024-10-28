from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv() # loads env variables from .env

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)
