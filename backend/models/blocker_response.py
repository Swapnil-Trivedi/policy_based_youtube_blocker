from pydantic import BaseModel

class BlockerErrorResponse(BaseModel):
    success : bool
    error : str

class BlockerSuccessfullResponse(BaseModel):
    success: bool
    video_id: str
    blocked: bool
 