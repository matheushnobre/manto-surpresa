from fastapi import HTTPException, status
from models import Order, Client, Address, OrderItem, Box
from sqlalchemy.orm import Session
from schemas import OrderSchema
from datetime import date
from requests import HTTPError
from services.mercado_pago import create_pix_order, get_order, get_payment
from services.email_service import send_email_when_create_order, send_email_when_confirmed_order

MP_ORDER_STATUS = {
    "processed": "Pago",
    "paid": "Pago",
    "cancelled": "Cancelado",
    "canceled": "Cancelado",
    "expired": "Expirado",
    "refunded": "Reembolsado",
    "charged_back": "Estornado",
}

MP_PAYMENT_STATUS = {
    "approved": "Pago",
    "processed": "Pago",
    "rejected": "Recusado",
    "cancelled": "Cancelado",
    "canceled": "Cancelado",
    "refunded": "Reembolsado",
    "charged_back": "Estornado",
}

def get_orders(session: Session):
    orders = session.query(Order).all()
    return orders

def create_order(order_data: OrderSchema, session: Session):
    # Verify client
    client = session.query(Client).filter(Client.email==order_data.client.email).first()
    
    if not client:
        client = Client(
            name=order_data.client.name,
            email=order_data.client.email,
            telephone=order_data.client.telephone
        )

        session.add(client)
        session.flush()

    # 2. Save address
    new_address = Address(
        cep=order_data.address.cep,
        road=order_data.address.road,
        number=order_data.address.number,
        complement=order_data.address.complement,
        neighborhood=order_data.address.neighborhood,
        city=order_data.address.city,
        state=order_data.address.state
    )

    session.add(new_address)
    session.flush()

    # 3. Create order
    new_order = Order(
        date=date.today(),
        client=client,
        address=new_address
    )

    session.add(new_order)
    session.flush()

    # 4. Add order items
    for item_data in order_data.items:

        box = (
            session.query(Box)
            .filter(Box.id == item_data.box_id)
            .first()
        )

        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Box {item_data.box_id} not found."
            )

        order_item = OrderItem(
            box=box,
            quantity=item_data.quantity,
            size=item_data.size
        )

        new_order.items.append(order_item)

    # 5. Calculate order price
    new_order.calcular_preco()

    # 6. Create pix order on MercadoPago
    pix = create_pix_order(new_order)
    payment = pix["transactions"]["payments"][0]

    # 7. Save Mercado Pago data in order
    new_order.mercado_pago_order_id = pix["id"]
    new_order.mercado_pago_payment_id = payment["id"]

    # Send email to confirm order
    send_email_when_create_order(new_order, payment)
    
    session.commit()

    return new_order, payment


def process_mercadopago_webhook(payload: dict, query_params: dict, session: Session):
    data = payload.get("data") or {}
    topic = payload.get("type") or query_params.get("type") or query_params.get("topic")
    resource_id = data.get("id") or query_params.get("data.id") or query_params.get("id")

    if not resource_id:
        return {"received": True, "processed": False, "reason": "missing_resource_id"}

    try:
        if topic == "payment":
            return _update_order_from_payment(str(resource_id), session, payload)

        return _update_order_from_mp_order(str(resource_id), session, payload)
    except HTTPError as error:
        if error.response is not None and error.response.status_code == 404:
            return {"received": True, "processed": False, "reason": "resource_not_found"}
        raise


def _fetch_mp_resource(fetcher, resource_id: str):
    try:
        return fetcher(resource_id)
    except HTTPError as error:
        if error.response is not None and error.response.status_code == 404:
            return None
        raise


def _resolve_status(status_map: dict, api_status: str | None, notification_status: str | None, current_status: str):
    if api_status in status_map:
        return status_map[api_status]

    if notification_status in status_map:
        return status_map[notification_status]

    return current_status


def _update_order_from_mp_order(mp_order_id: str, session: Session, payload: dict):
    notification = payload.get("data") or {}
    mp_order = _fetch_mp_resource(get_order, mp_order_id)
    order = _find_order_by_mp_data(
        session,
        mercado_pago_order_id=(mp_order or {}).get("id") or mp_order_id,
        external_reference=(mp_order or {}).get("external_reference") or notification.get("external_reference"),
    )

    if not order:
        return {"received": True, "processed": False, "reason": "order_not_found"}

    payments = ((mp_order or {}).get("transactions") or notification.get("transactions") or {}).get("payments") or []
    if payments:
        order.mercado_pago_payment_id = payments[0].get("id") or order.mercado_pago_payment_id

    api_status = (mp_order or {}).get("status")
    notification_status = notification.get("status")
    order.status = _resolve_status(MP_ORDER_STATUS, api_status, notification_status, order.status)
    if order.status == 'Pago':
        send_email_when_confirmed_order(order)

    session.commit()

    return {
        "received": True,
        "processed": True,
        "order_id": order.id,
        "status": order.status,
        "mp_status": api_status,
        "notification_status": notification_status,
    }


def _update_order_from_payment(payment_id: str, session: Session, payload: dict):
    notification = payload.get("data") or {}
    payment = _fetch_mp_resource(get_payment, payment_id)
    order = _find_order_by_mp_data(
        session,
        mercado_pago_payment_id=str((payment or {}).get("id") or payment_id),
        external_reference=(payment or {}).get("external_reference") or notification.get("external_reference"),
    )

    if not order:
        return {"received": True, "processed": False, "reason": "order_not_found"}

    if payment:
        order.mercado_pago_payment_id = str(payment.get("id"))

    api_status = (payment or {}).get("status")
    notification_status = notification.get("status")
    order.status = _resolve_status(MP_PAYMENT_STATUS, api_status, notification_status, order.status)
    if order.status == 'Pago':
        send_email_when_confirmed_order(order)

    session.commit()

    return {
        "received": True,
        "processed": True,
        "order_id": order.id,
        "status": order.status,
        "mp_status": api_status,
        "notification_status": notification_status,
    }


def _find_order_by_mp_data(
    session: Session,
    mercado_pago_order_id: str | None = None,
    mercado_pago_payment_id: str | None = None,
    external_reference: str | None = None,
):
    if mercado_pago_order_id:
        order = session.query(Order).filter(
            Order.mercado_pago_order_id == mercado_pago_order_id
        ).first()
        if order:
            return order

    if mercado_pago_payment_id:
        order = session.query(Order).filter(
            Order.mercado_pago_payment_id == mercado_pago_payment_id
        ).first()
        if order:
            return order

    if external_reference and str(external_reference).isdigit():
        return session.query(Order).filter(Order.id == int(external_reference)).first()

    return None

    