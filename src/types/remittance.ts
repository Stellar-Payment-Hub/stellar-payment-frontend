export type CurrencyCode = 'XLM' | 'USDC' | 'EURC' | 'NGN' | 'BRL' | 'PHP' | 'ARS';

export interface PaymentCorridor {
  id: string;
  sourceCurrency: CurrencyCode;
  destinationCurrency: CurrencyCode;
  corridorName: string;
  averageTimeSeconds: number;
  anchorName: string;
}

export interface CurrencyQuote {
  sourceCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  exchangeRate: number;
  stellarFeeUsd: number;
  bankFeeUsd: number;
  savingsUsd: number;
  expiresAt: number;
}

export interface RemittanceRecipient {
  id: string;
  name: string;
  destinationAddress: string;
  targetCurrency: CurrencyCode;
  corridorTag: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export interface RemittanceRecord {
  id: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  sourceAmount: number;
  sourceCurrency: CurrencyCode;
  destinationAmount: number;
  destinationCurrency: CurrencyCode;
  status: 'initiated' | 'converted' | 'delivered';
  txHash: string;
  timestamp: number;
}
