from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.dependencies import get_session
from app.services import order_service

webhook_router = APIRouter(prefix='/webhook', tags=['webhook'])

@webhook_router.post("/mercadopago")
async def mercadopago_webhook(
    request: Request,
    session: Session = Depends(get_session),
):
    try:
        payload = await request.json()
    except Exception:
        payload = {}

    result = order_service.process_mercadopago_webhook(
        payload=payload or {},
        query_params=dict(request.query_params),
        session=session,
    )

    print(f'result: {result}')

    return result
