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
