export type TransactionStatusState =
  | 'idle'
  | 'preparing'
  | 'awaiting_signature'
  | 'submitting'
  | 'success'
  | 'failed';

export interface PaymentFormData {
  recipient: string;
  amount: string;
  memo: string;
}

export interface PaymentFormErrors {
  recipient?: string;
  amount?: string;
  memo?: string;
  general?: string;
}

export interface PaymentSubmissionResult {
  status: 'success' | 'failed';
  hash?: string;
  ledger?: number;
  error?: string;
  timestamp?: number;
  recipient: string;
  amount: string;
  memo?: string;
}
