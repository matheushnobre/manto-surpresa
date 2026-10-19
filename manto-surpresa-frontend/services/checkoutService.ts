const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateOrderRequest {
  client: {
    name: string;
    email: string;
    telephone: string;
  };

  address: {
    cep: string;
    road: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };

  items: {
    box_id: number;
    quantity: number;
    size: string;
  }[];
}

export interface CreateOrderResponse {
  id: number;
  date: string;
  subtotal: number;
  status: string;
  pix: {
    qr_code: string;
    qr_code_base64: string;
    ticket_url: string;
  };
  message: string;
}

export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await fetch(`${API_URL}/order/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to create order"
    );
  }

  return response.json();
}

export interface OrderStatusResponse {
  id: number;
  order_id?: number;
  status: string;
}

export async function getOrderStatus(
  orderId: number,
  signal?: AbortSignal
): Promise<OrderStatusResponse> {
  const response = await fetch(`${API_URL}/order/${orderId}/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || `Failed to fetch status for order ${orderId}`
    );
  }

  return response.json();
}
