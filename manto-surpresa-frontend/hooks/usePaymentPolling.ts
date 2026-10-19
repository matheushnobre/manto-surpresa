"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getOrderStatus } from "@/services/checkoutService";

interface UsePaymentPollingOptions {
  orderId: number | null;
  initialStatus?: string;
  intervalMs?: number; // Padrão de 30000 (30 segundos)
  onPaymentApproved?: (status: string) => void;
}

export function usePaymentPolling({
  orderId,
  initialStatus = "Pendente",
  intervalMs = 30000,
  onPaymentApproved,
}: UsePaymentPollingOptions) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);

  // Normaliza verificação de status pago/aprovado
  const isApproved =
    status?.toLowerCase() === "pago" || status?.toLowerCase() === "approved";

  // Refs para controle do ciclo de vida e evitar concorrência
  const inFlightRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const onPaymentApprovedRef = useRef(onPaymentApproved);

  useEffect(() => {
    onPaymentApprovedRef.current = onPaymentApproved;
  }, [onPaymentApproved]);

  // Sincroniza status se initialStatus mudar, sem disparar setState em useEffect
  const [prevInitialStatus, setPrevInitialStatus] = useState(initialStatus);
  if (prevInitialStatus !== initialStatus) {
    setPrevInitialStatus(initialStatus);
    setStatus(initialStatus);
  }

  const checkStatus = useCallback(async () => {
    // Evita requisição se já houver uma em andamento ou se o componente foi desmontado
    if (!orderId || inFlightRef.current || !isMountedRef.current) {
      return false;
    }

    inFlightRef.current = true;
    setIsChecking(true);
    abortControllerRef.current = new AbortController();

    try {
      const data = await getOrderStatus(orderId, abortControllerRef.current.signal);

      if (!isMountedRef.current) return false;

      if (data && data.status) {
        setStatus(data.status);
        setLastCheckedAt(new Date());

        const approved =
          data.status.toLowerCase() === "pago" ||
          data.status.toLowerCase() === "approved";

        if (approved) {
          // Interrompe imediatamente as verificações periódicas
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          onPaymentApprovedRef.current?.(data.status);
          return true;
        }
      }
    } catch (error: unknown) {
      // Ignora abortos normais ao desmontar componente
      if (error instanceof Error && error.name === "AbortError") {
        return false;
      }
      // Trata falhas temporárias de comunicação sem interromper definitivamente o monitoramento
      console.warn("Falha temporária ao verificar status do pagamento:", error);
    } finally {
      inFlightRef.current = false;
      if (isMountedRef.current) {
        setIsChecking(false);
      }
    }

    return false;
  }, [orderId]);

  useEffect(() => {
    isMountedRef.current = true;

    // Se não houver pedido ou o status já estiver pago, não agenda verificações
    if (!orderId || isApproved) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Loop recursivo com setTimeout para evitar sobreposição de requisições
    const scheduleNextCheck = () => {
      timerRef.current = setTimeout(async () => {
        if (!isMountedRef.current) return;
        const approved = await checkStatus();
        if (!approved && isMountedRef.current) {
          scheduleNextCheck();
        }
      }, intervalMs);
    };

    // Inicia o temporizador periódico
    scheduleNextCheck();

    // Limpa o temporizador e cancela requisições ao desmontar ou ao mudar de página
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [orderId, isApproved, intervalMs, checkStatus]);

  return {
    status,
    isApproved,
    isChecking,
    lastCheckedAt,
    checkNow: checkStatus,
  };
}

