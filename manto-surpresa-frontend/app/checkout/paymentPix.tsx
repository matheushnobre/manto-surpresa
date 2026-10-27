"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Copy, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentPixProps {
  qrCodeBase64: string;
  qrCodeText?: string;
  orderId?: number | null;
  status?: string;
  isChecking?: boolean;
  onCheckNow?: () => void;
}

export default function PaymentPix({
  qrCodeBase64,
  qrCodeText,
  orderId,
  status = "Pendente",
}: PaymentPixProps) {
  const [copied, setCopied] = useState(false);

  const isApproved =
    status?.toLowerCase() === "pago" || status?.toLowerCase() === "approved";

  const isFailed =
    status && ["cancelado", "expirado", "recusado"].includes(status.toLowerCase());

  async function handleCopy() {
    if (!qrCodeText) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(qrCodeText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = qrCodeText;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Falha ao copiar código Pix:", err);
    }
  }

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

  // Estado pendente (exibe Chave Pix Copia e Cola e QR Code)
  return (
    <div className="border-2 border-primary/30 rounded-lg px-5 pb-6 pt-4 bg-white shadow-xs">
      <div className="flex justify-between items-center -mt-8 mb-4">
        <h2 className="px-3 bg-background text-2xl font-bold text-primary">
          Pagamento via Pix
        </h2>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Opção 1: Chave Pix Copia e Cola (Ideal para celular) */}
        {qrCodeText && (
          <div className="w-full flex flex-col items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 text-primary font-semibold text-base sm:text-lg">
              <Smartphone className="h-5 w-5 text-primary" />
              <span>Pix Copia e Cola</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 text-center max-w-md">
              Para pagar pelo celular, copie o código abaixo e utilize a opção <strong>Pix Copia e Cola</strong> no aplicativo do seu banco:
            </p>

            <div className="w-full max-w-lg flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2.5">
              <input
                type="text"
                readOnly
                value={qrCodeText}
                className="w-full bg-transparent text-xs sm:text-sm text-gray-700 font-mono outline-none truncate cursor-pointer"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>

            <Button
              type="button"
              onClick={handleCopy}
              className={`w-full max-w-lg py-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copied
                  ? "bg-green-600 text-white hover:bg-green-700 border-green-700 shadow-none"
                  : ""
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Código Pix Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Código Pix
                </>
              )}
            </Button>
          </div>
        )}

        {/* Divisor */}
        <div className="flex items-center gap-3 w-full max-w-md my-1">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs font-semibold uppercase text-gray-400">
            Ou escaneie o QR Code
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Opção 2: QR Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code para pagamento via Pix"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
            />
          </div>

          <p className="text-center text-sm font-medium text-gray-600">
            Abra o app do seu banco e escaneie o código acima com a câmera.
          </p>
        </div>
      </div>
    </div>
  );
}
