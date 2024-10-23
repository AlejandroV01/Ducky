from supabase import create_client, Client
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv() # loads env variables from .env

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class SupabaseService:
    """
    A class to interact with the Supabase database
    """

    def __init__(self, table):
        """
        Constructor for the SupabaseService class
        :param table: the table to interact with
        """
        self.table = table

    def get_all(self):
        """
            Get all data from a table
            :return: all data from the table
            """
        return supabase.table(self.table).select("*").execute()

    def save(self, data: BaseModel):
        """
        Add data to a table
        :param data: the data to add to the table
        :return: the response from the database
        """
        return supabase.table(self.table).insert(data.model_dump(mode="json")).execute()

    def get_by_id(self, id):
        """
        Get data from a table by id
        :param id: the id of the data to get
        :return: the data from the table
        """
        return supabase.table(self.table).select("*").eq("id", id).execute()

    def update(self, id:str, data:BaseModel):
        """
        Update data in a table
        :param id: the id of the data to update
        :param data: the data to update
        :return: the response from the database
        """
        return supabase.table(self.table).update(data.model_dump(mode="json")).eq("id", id).execute()

    def delete(self, id:str):
        """
        Delete data from a table
        :param id: the id of the data to delete
        :return: the response from the database
        """
        return supabase.table(self.table).delete().eq("id", id).execute()

    def get_by_field(self, field:str, value: any):
        """
        Get data from a table by field
        :param field: the field to search by
        :param value: the value to search for
        :return: the data from the table
        """
        return supabase.table(self.table).select("*").eq(field, value).execute()

    def get_by_fields(self, fields:dict):
        """
        Get data from a table by fields
        :param fields: the fields to search by
        :return: the data from the table
        """
        query = supabase.table(self.table).select("*")
        for field, value in fields.items():
            query = query.eq(field, value)
        return query.execute()

#
# def get_users():
#     return supabase.table("user").select("*").execute()
#
# def add_user(data):
#     print(f"Adding user: {data}")
#     return supabase.table("user").insert(data).execute()
