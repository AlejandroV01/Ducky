from pydantic import BaseModel

class Response(BaseModel):
    data: dict
    error: str
    status: int

    class Config:
        orm_mode = True

def generate_response(data:dict=None, error:str='', status:int=200):
    response = Response(
        data=data,
        error=error,
        status=status
    )
    return response.model_dump()