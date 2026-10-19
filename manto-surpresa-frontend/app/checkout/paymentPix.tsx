"use client";

import { CheckCircle2, Loader2, RefreshCw, AlertCircle } from "lucide-react";

interface PaymentPixProps {
  qrCodeBase64: string;
  orderId?: number | null;
  status?: string;
  isChecking?: boolean;
  onCheckNow?: () => void;
}

export default function PaymentPix({
  qrCodeBase64,
  orderId,
  status = "Pendente",
}: PaymentPixProps) {
  const isApproved =
    status?.toLowerCase() === "pago" || status?.toLowerCase() === "approved";

  const isFailed =
    status && ["cancelado", "expirado", "recusado"].includes(status.toLowerCase());

  // Estado de confirmação com sucesso
  if (isApproved) {
    return (
      <div className="border-2 border-green-500 bg-green-50/70 rounded-lg px-6 py-8 flex flex-col items-center text-center gap-5 transition-all shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-1 items-center">
          <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
            Confirmado
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-green-900 mt-2">
            Pagamento realizado com sucesso!
          </h2>
          {orderId && (
            <p className="text-sm font-semibold text-green-800">
              Pedido #{orderId}
            </p>
          )}
        </div>

        <p className="text-gray-700 max-w-md text-base">
          Recebemos a confirmação do pagamento do seu pedido. O seu Manto Surpresa já está sendo preparado com muito carinho!
        </p>

        <div className="text-xs text-gray-600 bg-white border border-green-200 rounded-lg p-3 max-w-md shadow-xs">
          Enviamos os detalhes do pedido e a confirmação para o seu e-mail cadastrado.
        </div>
      </div>
    );
  }

  // Estado de falha/cancelamento
  if (isFailed) {
    return (
      <div className="border-2 border-red-400 bg-red-50/70 rounded-lg px-6 py-8 flex flex-col items-center text-center gap-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-red-900">
          Pagamento não concluído
        </h2>
        <p className="text-gray-700 max-w-md">
          O status do seu pedido é:{" "}
          <span className="font-semibold text-red-700">{status}</span>. Por favor,
          gere um novo pedido ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  // Estado pendente (exibe QR Code e status de monitoramento)
  return (
    <div className="border-2 border-primary/30 rounded-lg px-5 pb-6 pt-4 bg-white shadow-xs">
      <div className="flex justify-between items-center -mt-8 mb-4">
        <h2 className="px-3 bg-background text-2xl font-bold text-primary">
          Pagamento
        </h2>
        
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-xs">
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code para pagamento via Pix"
            className="w-64 h-64 object-contain"
          />
        </div>

        <p className="text-center font-medium text-gray-700">
          Escaneie o QR Code para realizar o pagamento.
        </p>

      </div>
    </div>
  );
}