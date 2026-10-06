import { useState, useEffect, useCallback } from 'react';
import { TrackerPayment, paymentApiService, TrackerPaymentStatus } from '../services/payments';
import { STELLAR_CONFIG } from '../config/env';

export function usePaymentStream(filterStatus?: TrackerPaymentStatus) {
  const [payments, setPayments] = useState<TrackerPayment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const refreshPayments = useCallback(async () => {
    setIsLoading(true);
    const data = await paymentApiService.getPayments(filterStatus);
    setPayments(data);
    setIsLoading(false);
  }, [filterStatus]);

  useEffect(() => {
    refreshPayments();
  }, [refreshPayments]);

  // Connect to SSE stream
  useEffect(() => {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${STELLAR_CONFIG.backendUrl}/api/payments/stream`);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.addEventListener('payment:created', (e) => {
        try {
          const newPayment: TrackerPayment = JSON.parse(e.data);
          setPayments((prev) => [newPayment, ...prev.filter((p) => p.id !== newPayment.id)]);
        } catch (err) {
          console.warn('[SSE Parse Error]:', err);
        }
      });

      eventSource.addEventListener('payment:updated', (e) => {
        try {
          const payload = JSON.parse(e.data);
          const updatedPayment: TrackerPayment = payload.payment || payload;
          setPayments((prev) =>
            prev.map((p) => (p.id === updatedPayment.id ? { ...p, ...updatedPayment } : p))
          );
        } catch (err) {
          console.warn('[SSE Parse Error]:', err);
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        // Automatic reconnection happens by EventSource spec
      };
    } catch {
      setIsConnected(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return {
    payments,
    isLoading,
    isRealtimeConnected: isConnected,
    refetch: refreshPayments,
  };
}
