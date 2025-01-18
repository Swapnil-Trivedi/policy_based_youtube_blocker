from fastapi import APIRouter
from typing import Union
from ..models.blocker_response import BlockerSuccessfullResponse,BlockerErrorResponse

#constants for errors
INPUT_VALIDATION_ERROR = "110000 - input validation error"


blocker_router=APIRouter(tags=["Blocker endpoints"],
                         prefix="/blocker"
                        )

response={
             200: {
                 "description": "Successful request",
                 "content": {
                     "application/json": {
                         "example": {
                             "success": True,
                             "video_id":"asdakl1231",
                             "blocked": True
                         }
                     }
                 }
             },
             500: {
                 "description": "Internal Server Error",
                 "content": {
                     "application/json": {
                         "example": {
                             "success": False,
                             "error" : "110001 - Unable to fetch data for the video"
                         }
                     }
                 }
             },
             422: {
                 "description": "Bad Request",
                 "content": {
                     "application/json": {
                         "example": {
                             "success": False,
                             "error": "110000 - Input validation error"
                         }
                     }
                 }
             }
         }

@blocker_router.post("/check_video_block/{video_id}",
                     description="The endpoint can be used to check wether an incoming video is to be blocked or not based on the specific policy",
                     response_model=Union[BlockerErrorResponse,BlockerSuccessfullResponse],
                     responses=response   
                    )
def check_video_block(video_id: str):
    try:
        # Check if video_id is alphanumeric
        if video_id.isnumeric():
            raise ValueError(INPUT_VALIDATION_ERROR)  
        response = BlockerSuccessfullResponse(
            success=True,
            video_id=video_id,
            blocked=True
        )
        return response
    except ValueError as e:
        if str(e)==INPUT_VALIDATION_ERROR:
            response=BlockerErrorResponse(success=False,error=INPUT_VALIDATION_ERROR)
            return response