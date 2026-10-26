from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.dependencies import get_current_user_email, get_session
from app.schemas import OrderSchema
from app.services import order_service

order_routes = APIRouter(prefix='/order', tags=['order'])


@order_routes.get(
    "/my-orders",
    summary="List authenticated user orders",
    description="Return all orders belonging to the authenticated client based on the validated JWT token.",
    status_code=status.HTTP_200_OK,
)
async def get_my_orders(
    current_user_email: str = Depends(get_current_user_email),
    session: Session = Depends(get_session),
):
    orders = order_service.get_orders_by_client_email(current_user_email, session)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder([
            {
                "id": order.id,
                "order_id": order.id,
                "date": order.date,
                "subtotal": order.subtotal,
                "status": order.status,
                "items": [
                    {
                        "box_id": item.box_id,
                        "quantity": item.quantity,
                        "size": item.size,
                        "unit_price": item.unit_price,
                    }
                    for item in order.items
                ],
            }
            for order in orders
        ]),
    )


@order_routes.get(
    "/",
    summary="List orders",
    description="Return all orders registered in the system.",
    status_code=status.HTTP_200_OK,
)
async def get_orders(session: Session = Depends(get_session)):
    orders = order_service.get_orders(session)
    return orders


@order_routes.get(
    "/{order_id}/status",
    summary="Get order payment status",
    description="Return the current payment status of an order.",
    status_code=status.HTTP_200_OK,
)
async def get_order_status(order_id: int, session: Session = Depends(get_session)):
    order = order_service.get_order_status(order_id, session)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({
            "id": order.id,
            "order_id": order.id,
            "status": order.status,
        })
    )


@order_routes.get(
    "/{order_id}",
    summary="Get order by id",
    description="Return order details including status.",
    status_code=status.HTTP_200_OK,
)
async def get_order_by_id(order_id: int, session: Session = Depends(get_session)):
    order = order_service.get_order_status(order_id, session)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({
            "id": order.id,
            "order_id": order.id,
            "date": order.date,
            "subtotal": order.subtotal,
            "status": order.status,
        })
    )


@order_routes.post(
    "/create",
    summary="Create a new order",
    description="Create a new order with client and product data.",
    status_code=status.HTTP_201_CREATED,
)
async def create_order(order_data: OrderSchema, session: Session = Depends(get_session)):
    new_order, payment = order_service.create_order(order_data, session)
    
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
