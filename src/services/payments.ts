import { STELLAR_CONFIG } from '../config/env';

export type TrackerPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

export type TrackerSettlementStatus =
  | 'CREATED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export interface TrackerPayment {
  id: string;
  on_chain_id: number;
  creator_address: string;
  recipient_address: string;
  amount: string;
  memo: string;
  status: TrackerPaymentStatus;
  contract_address: string;
  transaction_hash?: string;
  ledger?: number;
  created_at: string;
  updated_at: string;
}

export interface TrackerSettlementRecipient {
  id: string;
  settlement_id: string;
  recipient: string;
  amount: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  sub_payment_id?: string;
}

export interface TrackerSettlement {
  id: string;
  on_chain_id: number;
  payer: string;
  total_amount: string;
  recipient_count: number;
  memo: string;
  status: TrackerSettlementStatus;
  contract_address: string;
  recipients: TrackerSettlementRecipient[];
  sub_payment_ids: string[];
  transaction_hash?: string;
  ledger?: number;
  created_at: string;
  updated_at: string;
}

export interface TrackerPaymentRequest {
  id: string;
  requester: string;
  amount: string;
  memo: string;
  status: 'ACTIVE' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  expires_at: string;
  created_at: string;
  paid_by?: string;
  transaction_hash?: string;
}

export interface TrackerTransaction {
  id: string;
  hash: string;
  source: string;
  destination: string;
  amount: string;
  asset: string;
  type: 'Native Payment' | 'Contract Payment' | 'Settlement' | 'Tip';
  status: 'Success' | 'Pending' | 'Failed';
  ledger: number;
  created_at: string;
}

export interface TrackerEvent {
  id: string;
  payment_id?: string;
  settlement_id?: string;
  event_type: string;
  transaction_hash: string;
  ledger: number;
  created_at: string;
}

// Fallback seed payments for offline/isolated frontend testing
const FALLBACK_PAYMENTS: TrackerPayment[] = [
  {
    id: 'PAY-001',
    on_chain_id: 1,
    creator_address: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    recipient_address: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    amount: '25.0000000',
    memo: 'Invoice #1042',
    status: 'PENDING',
    contract_address: STELLAR_CONFIG.contractId,
    transaction_hash: '3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889',
    ledger: 104250,
    created_at: '2026-10-06T11:30:00Z',
    updated_at: '2026-10-06T11:30:00Z',
  },
  {
    id: 'PAY-002',
    on_chain_id: 2,
    creator_address: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    recipient_address: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7',
    amount: '10.0000000',
    memo: 'Domain Renewal',
    status: 'COMPLETED',
    contract_address: STELLAR_CONFIG.contractId,
    transaction_hash: '9a7b6c5d4e3f210987654321fedcba0987654321fedcba0987654321fedcba09',
    ledger: 104100,
    created_at: '2026-10-06T11:00:00Z',
    updated_at: '2026-10-06T11:05:00Z',
  },
  {
    id: 'PAY-003',
    on_chain_id: 3,
    creator_address: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    recipient_address: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    amount: '15.5000000',
    memo: 'Project Advance',
    status: 'PROCESSING',
    contract_address: STELLAR_CONFIG.contractId,
    transaction_hash: '1234abcd5678ef901234abcd5678ef901234abcd5678ef901234abcd5678ef90',
    ledger: 104190,
    created_at: '2026-10-06T11:15:00Z',
    updated_at: '2026-10-06T11:20:00Z',
  },
];

const FALLBACK_SETTLEMENTS: TrackerSettlement[] = [
  {
    id: 'SETTLE-001',
    on_chain_id: 1,
    payer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    total_amount: '100.0000',
    recipient_count: 3,
    memo: 'Group Project Settlement',
    status: 'COMPLETED',
    contract_address: STELLAR_CONFIG.settlementContractId,
    transaction_hash: '7789a1b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef',
    ledger: 104300,
    sub_payment_ids: ['PAY-001', 'PAY-002', 'PAY-003'],
    recipients: [
      { id: 'REC-1', settlement_id: 'SETTLE-001', recipient: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', amount: '50.0000', status: 'COMPLETED', sub_payment_id: 'PAY-001' },
      { id: 'REC-2', settlement_id: 'SETTLE-001', recipient: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7', amount: '30.0000', status: 'COMPLETED', sub_payment_id: 'PAY-002' },
      { id: 'REC-3', settlement_id: 'SETTLE-001', recipient: 'GD6W7Z4DF57Q3B6U2L8K7X9V1N4P0M2Y6W6X7XF5Q2VLL4X7R7SD5XYZ', amount: '20.0000', status: 'COMPLETED', sub_payment_id: 'PAY-003' },
    ],
    created_at: '2026-10-06T11:40:00Z',
    updated_at: '2026-10-06T11:45:00Z',
  },
];

const FALLBACK_TRANSACTIONS: TrackerTransaction[] = [
  {
    id: 'TX-1',
    hash: '3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889',
    source: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    destination: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    amount: '25.0000 XLM',
    asset: 'native',
    type: 'Contract Payment',
    status: 'Success',
    ledger: 104250,
    created_at: '2026-10-06T11:30:00Z',
  },
  {
    id: 'TX-2',
    hash: '9a7b6c5d4e3f210987654321fedcba0987654321fedcba0987654321fedcba09',
    source: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    destination: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7',
    amount: '10.0000 XLM',
    asset: 'native',
    type: 'Contract Payment',
    status: 'Success',
    ledger: 104100,
    created_at: '2026-10-06T11:00:00Z',
  },
  {
    id: 'TX-3',
    hash: '7789a1b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef',
    source: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    destination: 'CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E',
    amount: '100.0000 XLM',
    asset: 'native',
    type: 'Settlement',
    status: 'Success',
    ledger: 104300,
    created_at: '2026-10-06T11:45:00Z',
  },
];

class PaymentApiService {
  private localPayments: TrackerPayment[] = [...FALLBACK_PAYMENTS];
  private localSettlements: TrackerSettlement[] = [...FALLBACK_SETTLEMENTS];
  private localRequests: TrackerPaymentRequest[] = [
    {
      id: 'REQ-001',
      requester: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      amount: '25.0000',
      memo: 'Design Consultation #204',
      status: 'ACTIVE',
      expires_at: '2026-10-09T12:00:00Z',
      created_at: '2026-10-06T12:00:00Z',
    },
  ];
  private localTransactions: TrackerTransaction[] = [...FALLBACK_TRANSACTIONS];

  // --- Payments ---
  public async getPayments(filterStatus?: TrackerPaymentStatus): Promise<TrackerPayment[]> {
    try {
      const url = new URL(`${STELLAR_CONFIG.backendUrl}/api/payments`);
      if (filterStatus) url.searchParams.append('status', filterStatus);

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        if (data.payments) {
          return data.payments;
        }
      }
    } catch {
      // Backend not running or timeout; return local cache
    }

    if (filterStatus) {
      return this.localPayments.filter((p) => p.status === filterStatus);
    }
    return this.localPayments;
  }

  public async getPaymentById(
    id: string
  ): Promise<{ payment: TrackerPayment; events: TrackerEvent[] } | null> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/payments/${id}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return { payment: data.payment, events: data.events || [] };
      }
    } catch {
      // Fallback
    }

    const local = this.localPayments.find((p) => p.id === id);
    if (local) {
      return {
        payment: local,
        events: [
          {
            id: 'evt-1',
            payment_id: local.id,
            event_type: 'PaymentCreated',
            transaction_hash: local.transaction_hash || 'tx-seed',
            ledger: local.ledger || 104000,
            created_at: local.created_at,
          },
        ],
      };
    }
    return null;
  }

  public async registerPayment(newPayment: {
    creator_address: string;
    recipient_address: string;
    amount: string;
    memo: string;
    on_chain_id?: number;
    transaction_hash?: string;
    ledger?: number;
  }): Promise<TrackerPayment> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.payment;
      }
    } catch {
      // Fallback local registration
    }

    const nextIdNum = this.localPayments.length + 1;
    const formattedId = `PAY-${String(nextIdNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const created: TrackerPayment = {
      id: formattedId,
      on_chain_id: newPayment.on_chain_id || nextIdNum,
      creator_address: newPayment.creator_address,
      recipient_address: newPayment.recipient_address,
      amount: newPayment.amount,
      memo: newPayment.memo,
      status: 'PENDING',
      contract_address: STELLAR_CONFIG.contractId,
      transaction_hash: newPayment.transaction_hash,
      ledger: newPayment.ledger,
      created_at: now,
      updated_at: now,
    };

    this.localPayments.unshift(created);
    return created;
  }

  // --- Settlements (Level 3) ---
  public async getSettlements(): Promise<TrackerSettlement[]> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/settlements`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settlements) return data.settlements;
      }
    } catch {
      // Fallback
    }
    return this.localSettlements;
  }

  public async createSettlement(payload: {
    payer: string;
    total_amount: string;
    memo: string;
    recipients: { recipient: string; amount: string }[];
    transaction_hash?: string;
    ledger?: number;
  }): Promise<TrackerSettlement> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/settlements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.settlement;
      }
    } catch {
      // Fallback
    }

    const nextNum = this.localSettlements.length + 1;
    const formattedId = `SETTLE-${String(nextNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newSettle: TrackerSettlement = {
      id: formattedId,
      on_chain_id: nextNum,
      payer: payload.payer,
      total_amount: payload.total_amount,
      recipient_count: payload.recipients.length,
      memo: payload.memo,
      status: 'COMPLETED',
      contract_address: STELLAR_CONFIG.settlementContractId,
      sub_payment_ids: payload.recipients.map((_, i) => `PAY-SUB-${i + 1}`),
      recipients: payload.recipients.map((r, i) => ({
        id: `${formattedId}-REC-${i + 1}`,
        settlement_id: formattedId,
        recipient: r.recipient,
        amount: r.amount,
        status: 'COMPLETED',
        sub_payment_id: `PAY-SUB-${i + 1}`,
      })),
      transaction_hash: payload.transaction_hash,
      ledger: payload.ledger,
      created_at: now,
      updated_at: now,
    };

    this.localSettlements.unshift(newSettle);
    return newSettle;
  }

  // --- Payment Requests (Level 3) ---
  public async getPaymentRequests(): Promise<TrackerPaymentRequest[]> {
    return this.localRequests;
  }

  public async getPaymentRequestById(id: string): Promise<TrackerPaymentRequest | null> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/payment-requests/${id}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.request;
      }
    } catch {
      // Fallback
    }
    return this.localRequests.find((r) => r.id === id) || null;
  }

  public async createPaymentRequest(data: {
    requester: string;
    amount: string;
    memo: string;
  }): Promise<TrackerPaymentRequest> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/payment-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const body = await res.json();
        return body.request;
      }
    } catch {
      // Fallback
    }

    const nextNum = this.localRequests.length + 1;
    const req: TrackerPaymentRequest = {
      id: `REQ-${String(nextNum).padStart(3, '0')}`,
      requester: data.requester,
      amount: data.amount,
      memo: data.memo,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };
    this.localRequests.unshift(req);
    return req;
  }

  public async payPaymentRequest(id: string, payer: string, txHash: string): Promise<boolean> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/payment-requests/${id}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paid_by: payer, transaction_hash: txHash }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    const req = this.localRequests.find((r) => r.id === id);
    if (req) {
      req.status = 'PAID';
      req.paid_by = payer;
      req.transaction_hash = txHash;
      return true;
    }
    return false;
  }

  // --- Transactions (Level 3) ---
  public async getTransactions(): Promise<TrackerTransaction[]> {
    try {
      const res = await fetch(`${STELLAR_CONFIG.backendUrl}/api/transactions`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.transactions) return data.transactions;
      }
    } catch {
      // Fallback
    }
    return this.localTransactions;
  }

  public async recordTransaction(tx: Omit<TrackerTransaction, 'id' | 'created_at'>): Promise<TrackerTransaction> {
    const fullTx: TrackerTransaction = {
      id: `TX-${Date.now()}`,
      ...tx,
      created_at: new Date().toISOString(),
    };
    this.localTransactions.unshift(fullTx);
    return fullTx;
  }
}

export const paymentApiService = new PaymentApiService();
