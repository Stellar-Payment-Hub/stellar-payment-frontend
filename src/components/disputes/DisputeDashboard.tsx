import { useState } from 'react';
import { Gavel, CheckCircle2, RotateCcw } from 'lucide-react';

export interface PendingDispute {
  disputeId: string;
  paymentId: string;
  amount: string;
  payer: string;
  payee: string;
  reason: string;
  evidenceHash: string;
  createdAt: number;
}

interface DisputeDashboardProps {
  disputes?: PendingDispute[];
  onResolve?: (disputeId: string, resolution: 'refund_buyer' | 'release_seller') => Promise<void> | void;
}

const DEFAULT_DISPUTES: PendingDispute[] = [
  {
    disputeId: 'DSP-001',
    paymentId: 'PAY-8821',
    amount: '350.00 XLM',
    payer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    payee: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    reason: 'Goods or Services Not Received',
    evidenceHash: 'ipfs://bafybeic3...',
    createdAt: Date.now() - 7200000,
  },
];

export function DisputeDashboard({ disputes = DEFAULT_DISPUTES, onResolve }: DisputeDashboardProps) {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (disputeId: string, resolution: 'refund_buyer' | 'release_seller') => {
    setResolvingId(disputeId);
    try {
      if (onResolve) await onResolve(disputeId, resolution);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="card" data-testid="dispute-dashboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div className="icon-badge icon-badge-cyan">
          <Gavel size={18} />
        </div>
        <div>
          <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Arbitrator Adjudication Dashboard</h3>
          <p className="card-subtitle">Resolve on-chain disputes according to evidence</p>
        </div>
      </div>

      {disputes.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          No active disputes require arbitration at this time.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {disputes.map((d) => (
            <div
              key={d.disputeId}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
              }}
              data-testid={`dispute-card-${d.disputeId}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Dispute #{d.disputeId} (Ref: {d.paymentId})
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>
                  {d.amount}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Reason:</span> {d.reason}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Payer:</span> <span className="font-mono">{d.payer.substring(0, 8)}...</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Payee:</span> <span className="font-mono">{d.payee.substring(0, 8)}...</span></div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Evidence:</span>{' '}
                  <span className="font-mono text-cyan-400">{d.evidenceHash}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleResolve(d.disputeId, 'refund_buyer')}
                  disabled={resolvingId === d.disputeId}
                  data-testid={`resolve-refund-btn-${d.disputeId}`}
                >
                  <RotateCcw size={13} /> Refund Buyer
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleResolve(d.disputeId, 'release_seller')}
                  disabled={resolvingId === d.disputeId}
                  data-testid={`resolve-release-btn-${d.disputeId}`}
                >
                  <CheckCircle2 size={13} /> Release to Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
