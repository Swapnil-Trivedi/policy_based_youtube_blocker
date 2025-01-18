from fastapi import APIRouter

blocker_router=APIRouter(tags=["Blocker endpoints"],prefix="/blocker")

@blocker_router.get("/")
def root():
    return {"message": "Hello World"}