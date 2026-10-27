import { useAuthStore } from "@/stores/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface OrderItem {
  box_id: number;
  box_name: string;
  quantity: number;
  size: string;
  unit_price: number;
}

export interface MyOrder {
  id: number;
  order_id: number;
  date: string;
  subtotal: number;
  status: string;
  items: OrderItem[];
}

export async function getMyOrders(token?: string): Promise<MyOrder[]> {
  const authToken = token ?? useAuthStore.getState().token;

  if (!authToken) {
    throw new Error("Usuário não autenticado. Realize o login novamente.");
  }

  const response = await fetch(`${API_URL}/order/my-orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
      throw new Error("Sessão expirada. Por favor, autentique-se novamente.");
    }

    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Falha ao consultar produtos do cliente.");
  }

  return response.json();
}

