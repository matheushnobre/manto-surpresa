from fastapi import APIRouter, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from schemas import OrderSchema
from services import order_service

order_routes = APIRouter(prefix='/order', tags=['order'])

@order_routes.get("/",
                summary = "List orders",
                description = "Return all orders registered in the system.",
                status_code = status.HTTP_200_OK,
)
async def get_orders():
    orders = order_service.get_orders()
    return orders

@order_routes.post("/create",
                summary = "Create a new order",
                description = "Create a new order with client and product data.",
                status_code = status.HTTP_201_CREATED,
)
async def create_order(order_data: OrderSchema):
    new_order, payment = order_service.create_order(order_data)
    
    return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=jsonable_encoder({
                "id": new_order.id,
                "date": new_order.date,
                "subtotal": new_order.subtotal,
                "status": new_order.status,
                "pix": {
                    "qr_code": payment["payment_method"]["qr_code"],
                    "qr_code_base64": payment["payment_method"]["qr_code_base64"],
                    "ticket_url": payment["payment_method"]["ticket_url"],
                },
                "message": "Order created successfully"
            })
        )