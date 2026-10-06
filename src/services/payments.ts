import { STELLAR_CONFIG } from '../config/env';

export type TrackerPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

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

export interface TrackerEvent {
  id: string;
  payment_id: string;
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

class PaymentApiService {
  private localPayments: TrackerPayment[] = [...FALLBACK_PAYMENTS];

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
}

export const paymentApiService = new PaymentApiService();
