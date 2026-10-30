import { useState } from 'react';
import { ShieldAlert, PauseCircle, PlayCircle, Clock, CheckCircle2 } from 'lucide-react';

interface ContractAdminPanelProps {
  isPaused?: boolean;
  currentTtlLedger?: number;
  onTogglePause?: (newPaused: boolean) => Promise<void> | void;
  onExtendTtl?: (ledgersToAdd: number) => Promise<void> | void;
}

export function ContractAdminPanel({
  isPaused = false,
  currentTtlLedger = 500000,
  onTogglePause,
  onExtendTtl,
}: ContractAdminPanelProps) {
  const [paused, setPaused] = useState(isPaused);
  const [ttl, setTtl] = useState(currentTtlLedger);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handlePauseToggle = async () => {
    setLoading(true);
    try {
      const next = !paused;
      if (onTogglePause) await onTogglePause(next);
      setPaused(next);
      setMsg(next ? 'Contract execution PAUSED.' : 'Contract execution RESUMED.');
      setTimeout(() => setMsg(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleTtlExtend = async () => {
    setLoading(true);
    try {
      if (onExtendTtl) await onExtendTtl(100000);
      setTtl((prev) => prev + 100000);
      setMsg('Soroban state TTL extended by +100,000 ledgers.');
      setTimeout(() => setMsg(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" data-testid="contract-admin-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div className="icon-badge icon-badge-purple">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Contract Admin Controls</h3>
          <p className="card-subtitle">Emergency Circuit Breaker & TTL Management</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Contract Status</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: paused ? 'var(--danger)' : 'var(--success)' }} data-testid="admin-contract-status">
            {paused ? 'PAUSED' : 'ACTIVE'}
          </span>
          <button
            type="button"
            className={`btn ${paused ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={handlePauseToggle}
            disabled={loading}
            data-testid="toggle-pause-btn"
          >
            {paused ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
            {paused ? 'Unpause Contract' : 'Emergency Pause'}
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Storage TTL Expiration</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }} data-testid="admin-ttl-display">
            Ledger #{ttl.toLocaleString()}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={handleTtlExtend}
            disabled={loading}
            data-testid="extend-ttl-btn"
          >
            <Clock size={14} /> Extend TTL (+100k)
          </button>
        </div>
      </div>

      {msg && (
        <div className="alert alert-success" style={{ fontSize: '0.75rem' }} data-testid="admin-alert-msg">
          <CheckCircle2 size={14} /> {msg}
        </div>
      )}
    </div>
  );
}
