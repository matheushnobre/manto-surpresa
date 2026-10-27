"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getMyOrders, MyOrder } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Package, LogOut, Loader2, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Tenta pegar do estado atual do Zustand
  const stateToken = useAuthStore.getState().token;
  if (stateToken) return stateToken;

  // 2. Tenta pegar diretamente do cookie
  const cookieMatch = document.cookie.match(/(^| )auth_token=([^;]+)/);
  if (cookieMatch) return decodeURIComponent(cookieMatch[2]);

  // 3. Fallback no localStorage do persist do Zustand
  try {
    const raw = localStorage.getItem("auth-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.token) return parsed.state.token;
    }
  } catch {
    // Ignora erro de parsing
  }

  return null;
}

export default function Tracking() {
  const token = useAuthStore((state) => state.token);
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);

  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Obtém o token considerando Zustand, cookies ou localStorage sincronamente
    const activeToken = token || getStoredToken();

    // Se realmente não houver token em lugar nenhum, redireciona para a verificação
    if (!activeToken) {
      redirect("/code_verification?redirect=/tracking");
      return;
    }

    // Se o token foi recuperado do storage mas o Zustand ainda não hidratou, sincroniza
    if (!token && activeToken) {
      useAuthStore.setState({ token: activeToken });
    }

    async function fetchOrders(tokenToUse: string) {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyOrders(tokenToUse);
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          if (
            err.message.includes("autenticado") ||
            err.message.includes("expirada")
          ) {
            logout();
            redirect("/code_verification?redirect=/tracking");
          }
        } else {
          setError("Não foi possível carregar seus pedidos.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrders(activeToken);
  }, [mounted, token, logout]);

  const handleLogout = () => {
    logout();
    redirect("/code_verification?redirect=/tracking");
  };

  // Enquanto o componente monta e checa a autenticação
  if (!mounted) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-gray-500">Verificando autenticação...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0E2357]">Meus Pedidos</h1>
          <p className="text-sm text-gray-600">
            Logado como: <span className="font-semibold text-gray-900">{email || "Cliente"}</span>
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Carregando seus pedidos...</p>
        </div>
      )}

      {error && !loading && (
        <div className="my-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">Nenhum pedido encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Ainda não identificamos compras registradas com este e-mail.
          </p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase text-gray-400">
                    Pedido #{order.order_id || order.id}
                  </span>
                  <p className="text-sm text-gray-500">
                    Data: {new Date(order.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                    Status: {order.status}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    R$ {order.subtotal?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Itens:</h4>
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span>
                          {item.box_name} - Tamanho: <strong>{item.size}</strong> (x{item.quantity})
                        </span>
                      </div>
                      <span className="font-medium text-gray-700">
                        R$ {(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
