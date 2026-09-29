from fastapi import FastAPI

app = FastAPI()

from routes.box_routes import box_router
from routes.order_routes import order_routes

app.include_router(box_router)
app.include_router(order_routes)