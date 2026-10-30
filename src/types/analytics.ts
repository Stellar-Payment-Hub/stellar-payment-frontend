export interface VolumeTimeseriesPoint {
  timestamp: string;
  volumeUsd: number;
  txCount: number;
}

export interface AssetDistribution {
  assetCode: string;
  amount: number;
  valueUsd: number;
  percentage: number;
}

export interface CounterpartyRiskRecord {
  address: string;
  label?: string;
  totalVolumeUsd: number;
  txCount: number;
  riskScore: 'low' | 'medium' | 'high';
}

export interface TaxInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceUsd: number;
  totalUsd: number;
}

export interface TaxInvoiceEntity {
  invoiceNumber: string;
  issuerTaxId: string;
  clientName: string;
  clientAddress: string;
  issuedAt: number;
  dueDate: number;
  items: TaxInvoiceItem[];
  subtotal: number;
  taxBps: number;
  totalDue: number;
  settledTxHash?: string;
}
