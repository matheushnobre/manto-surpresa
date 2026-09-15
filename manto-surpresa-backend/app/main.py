from fastapi import FastAPI

app = FastAPI()

from routes.box_routes import box_router

app.include_router(box_router)