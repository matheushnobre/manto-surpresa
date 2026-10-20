from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://manto-surpresa.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.box_routes import box_router
from app.routes.order_routes import order_routes
from app.routes.webhook import webhook_router

app.include_router(box_router)
app.include_router(order_routes)
app.include_router(webhook_router)