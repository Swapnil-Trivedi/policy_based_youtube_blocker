from fastapi import FastAPI
from backend.routes import blocker

#declaration for our server application
backend_server=FastAPI(title="Youtube-Policy-Blocker",
                       description="This is the backend service for the policy based youtube blocker",
                       version="0.0.1",
                       docs_url="/documentation",
                       root_path="/policy-blocker/v1",
                       openapi_tags=[
                           {
                               "name":"Blocker endpoints",
                               "description": "Collection of endpoints which can be used to interact with the blocker services"
                           },
                       ],
                       debug=True)

#Importing routes
backend_server.include_router(blocker.blocker_router)