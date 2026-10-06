import { useState, useCallback } from 'react';
import {
  TransactionStatusState,
  PaymentFormData,
  PaymentSubmissionResult,
} from '../types/payment';
import { executeStellarPayment } from '../lib/stellar/transactions';

export function usePayment(onSuccess?: () => void) {
  const [status, setStatus] = useState<TransactionStatusState>('idle');
  const [lastResult, setLastResult] = useState<PaymentSubmissionResult | null>(null);

  const sendPayment = useCallback(
    async (formData: PaymentFormData, senderAddress: string) => {
      setStatus('preparing');
      setLastResult(null);

      const result = await executeStellarPayment({
        sender: senderAddress,
        recipient: formData.recipient.trim(),
        amount: formData.amount.trim(),
        memo: formData.memo.trim() || undefined,
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
        },
      });

      setLastResult(result);

      if (result.status === 'success') {
        setStatus('success');
        onSuccess?.();
      } else {
        setStatus('failed');
      }

      return result;
    },
    [onSuccess]
  );

  const resetPayment = useCallback(() => {
    setStatus('idle');
    setLastResult(null);
  }, []);

  return {
    status,
    lastResult,
    sendPayment,
    resetPayment,
  };
}
