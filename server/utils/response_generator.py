from pydantic import BaseModel
from typing import Any

class Response(BaseModel):
    """
    A response object to be returned by the API
    """

    data: Any  # Allow data to be a dictionary (JSON object)
    error: str
    status: int

    class Config:
        from_attributes = True

def generate_response(data: Any = None, error: str = '', status: int = 200):
    """
    Generate a response object with the given data, error, and status
    :param data: any data to return
    :param error: any error message to return
    :param status: the status code to return
    :return: a serialized response object
    """
    response = Response(
        data=data,
        error=error,
        status=status
    )
    return response.model_dump()  # Return the serialized response

def create_response(supabase_response):
    """
    Create a response object from the given response
    :param supabase_response: a response from the supabase service
    :return: a serialized response object
    """
    try:
        if supabase_response.data:
            obj = supabase_response.data[0]
            return generate_response(obj, status=200)
        else:
            return generate_response(error="Object not found", status=404)
    except Exception as e:
        return generate_response(error=str(e), status=500)

