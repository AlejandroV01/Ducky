from pydantic import BaseModel
from typing import Any

class Response(BaseModel):
    data: Any  # Allow data to be a dictionary (JSON object)
    error: str
    status: int

    class Config:
        from_attributes = True

def generate_response(data: Any = None, error: str = '', status: int = 200):
    response = Response(
        data=data,
        error=error,
        status=status
    )
    return response.model_dump()  # Return the serialized response

def create_response(response):
    try:
        if response.data:
            obj = response.data[0]
            return generate_response(obj, status=200)
        else:
            return generate_response(error="Object not found", status=404)
    except Exception as e:
        return generate_response(error=str(e), status=500)

