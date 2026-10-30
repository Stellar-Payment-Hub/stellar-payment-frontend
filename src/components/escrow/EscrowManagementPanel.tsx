import { useState } from 'react';
import { Shield, CheckCircle2, RotateCcw } from 'lucide-react';
import { EscrowTimer } from './EscrowTimer';

export interface EscrowRecord {
  id: string;
  amount: string;
  asset: string;
  depositor: string;
  beneficiary: string;
  unlockTimestamp: number;
  status: 'locked' | 'unlocked' | 'claimed' | 'refunded';
}

interface EscrowManagementPanelProps {
  escrows?: EscrowRecord[];
  connectedAddress?: string | null;
  onClaim?: (escrowId: string) => void;
  onRefund?: (escrowId: string) => void;
}

const DEFAULT_ESCROWS: EscrowRecord[] = [
  {
    id: 'ESC-101',
    amount: '500.00',
    asset: 'XLM',
    depositor: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    beneficiary: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    unlockTimestamp: Date.now() + 1800000,
    status: 'locked',
  },
  {
    id: 'ESC-102',
    amount: '120.00',
    asset: 'USDC',
    depositor: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    beneficiary: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    unlockTimestamp: Date.now() - 3600000,
    status: 'unlocked',
  },
];

export function EscrowManagementPanel({
  escrows = DEFAULT_ESCROWS,
  onClaim,
  onRefund,
}: EscrowManagementPanelProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = escrows.filter((e) => {
    if (filter === 'active') return e.status === 'locked' || e.status === 'unlocked';
    if (filter === 'completed') return e.status === 'claimed' || e.status === 'refunded';
    return true;
  });

  return (
    <div className="card" data-testid="escrow-management-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} className="text-cyan-400" />
          <div>
            <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Timelock Escrow Management</h3>
            <p className="card-subtitle">Non-custodial smart contract lockups</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter('all')}
            data-testid="filter-escrow-all"
          >
            All
          </button>
          <button
            type="button"
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter('active')}
            data-testid="filter-escrow-active"
          >
            Active
          </button>
          <button
            type="button"
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter('completed')}
            data-testid="filter-escrow-completed"
          >
            Completed
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((item) => {
          const isUnlockPassed = Date.now() >= item.unlockTimestamp;
          return (
            <div
              key={item.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
              }}
              data-testid={`escrow-card-${item.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.id}</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {item.amount} <span className="text-cyan-400 text-xs">{item.asset}</span>
                </span>
              </div>

              <div style={{ marginBottom: '0.65rem' }}>
                <EscrowTimer unlockTimestamp={item.unlockTimestamp} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ color: 'var(--text-muted)' }}>
                  Beneficiary: {item.beneficiary.substring(0, 6)}...{item.beneficiary.substring(item.beneficiary.length - 4)}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {isUnlockPassed && item.status !== 'claimed' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onClaim && onClaim(item.id)}
                      data-testid={`claim-escrow-btn-${item.id}`}
                    >
                      <CheckCircle2 size={13} /> Claim Funds
                    </button>
                  )}
                  {isUnlockPassed && item.status !== 'refunded' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onRefund && onRefund(item.id)}
                      data-testid={`refund-escrow-btn-${item.id}`}
                    >
                      <RotateCcw size={13} /> Refund
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
