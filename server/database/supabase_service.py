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
        - **example** .get_all()
        - **returns** data=[{key: value, ...}, {}, {}, ...]
        """
        return supabase.table(self.table).select("*").execute()
    
    def get_by_id(self, id):
        """
        Get data from a table by id
        - **param**: the id of the data to get
        - **example**: .get_by_id("123abcdef")
        - **returns**: data=[{key: value, ...}]
        """
        return supabase.table(self.table).select("*").eq("id", id).execute()

    def save(self, data: BaseModel):
        """
        Add data to a table
        - **param** data: a BaseModel object
        - **example**
        -  data = Post(
        -   title="Hello, World!"
        -   content="This is a new post"
        -  )
        - posts_db.save(data)
        - **returns** data=[{key: value, ...}]
        """
        return supabase.table(self.table).insert(data.model_dump(mode="json")).execute()

    def update(self, id:str, data:BaseModel):
        """
        Update data in a table
        - **param** id: the id of the data to update
        - **param** data: a BaseModel object
        - **example**
        -  data = Post(
        -   title="Hello, World!"
        -   content="This is an update"
        -  )
        - posts_db.update("123abcdef", data)
        - **returns**: data=[{key: value, ...}]
        """
        return supabase.table(self.table).update(data.model_dump(mode="json")).eq("id", id).execute()

    def delete(self, id:str):
        """
        Delete data from a table
        - **param** id: the id of the data to delete
        - **example** .delete("123abcdef")
        - **returns**: data=[{key: value, ...}]
        """
        return supabase.table(self.table).delete().eq("id", id).execute()

    def get_by_field(self, field:str, value: any):
        """
        Get data from a table by field
        - **param** field: the field to search by as a string
        - **param** value: the value to search for in the field
        - **example** .get_by_field("field", value)
        - **returns** data=[{key: value, ...}, {}, {}, ...]
        """
        return supabase.table(self.table).select("*").eq(field, value).execute()

    def get_by_fields(self, fields:dict):
        """
        Get data from a table by fields
        - **param**: fields: the fields to search by as a dictionary
        - **example**: .get_by_fields({"field1": "value1", "field2": "value2"})
        - **returns**: data=[{key: value, ...}, {}, {}, ...]
        """
        query = supabase.table(self.table).select("*")
        for field, value in fields.items():
            query = query.eq(field, value)
        return query.execute()