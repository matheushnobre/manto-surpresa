from fastapi import HTTPException, status
from models import Order, Client, Address, OrderItem, Box
from sqlalchemy.orm import Session
from fastapi import Depends
from dependencies import get_session
from schemas import OrderSchema
from datetime import date
from services.mercado_pago import create_pix_order

def get_orders(session: Session = Depends(get_session)):
    orders = session.query(Order).all()
    return orders

def create_order(order_data: OrderSchema, session: Session = Depends(get_session)):
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
    
    session.commit()

    return new_order, payment

    