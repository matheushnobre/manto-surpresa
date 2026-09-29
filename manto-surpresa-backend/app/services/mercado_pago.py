import os
import uuid
import requests

from dotenv import load_dotenv

load_dotenv()

MERCADO_PAGO_ACCESS_TOKEN = os.getenv("MERCADO_PAGO_ACCESS_TOKEN")

BASE_URL = "https://api.mercadopago.com"

def create_pix_order(order):
    headers = {
        "Authorization": f"Bearer {MERCADO_PAGO_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Idempotency-Key": str(uuid.uuid4())
    }

    data = {
        "type": "online",
        "total_amount": f"{order.subtotal:.2f}",
        "external_reference": str(order.id),
        "processing_mode": "automatic",
        "transactions": {
            "payments": [
                {
                    "amount": f"{order.subtotal:.2f}",
                    "payment_method": {
                        "id": "pix",
                        "type": "bank_transfer"
                    },
                    "expiration_time": "P1D"
                }
            ]
        },

        "payer": {
            "email": order.client.email
        }
    }

    response = requests.post(
        f"{BASE_URL}/v1/orders",
        headers=headers,
        json=data
    )

    response.raise_for_status()

    return response.json()