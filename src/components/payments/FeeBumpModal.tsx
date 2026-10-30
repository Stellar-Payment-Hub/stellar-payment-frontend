import { useState } from 'react';
import { X, Zap, ArrowUp } from 'lucide-react';

interface FeeBumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  currentFeeStroops?: number;
  onFeeBump?: (txHash: string, newFeeStroops: number) => Promise<void> | void;
}

export function FeeBumpModal({
  isOpen,
  onClose,
  txHash,
  currentFeeStroops = 100,
  onFeeBump,
}: FeeBumpModalProps) {
  const [newFee, setNewFee] = useState(String(currentFeeStroops * 10));
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBump = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (onFeeBump) await onFeeBump(txHash, parseInt(newFee, 10));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" data-testid="fee-bump-modal">
      <div className="modal-card modal-card-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Zap size={20} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">Expedite Transaction (Fee-Bump)</h3>
              <span className="text-muted text-xs">Stellar Protocol 20 FeeBumpTransaction</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleBump} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Increase the transaction inclusion fee to expedite ledger confirmation during periods of high network congestion.
          </p>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Pending Transaction Hash
            </label>
            <div className="font-mono text-xs" style={{ wordBreak: 'break-all', color: 'var(--accent-cyan)' }}>
              {txHash}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Bumped Maximum Fee (Stroops)
            </label>
            <input
              type="number"
              className="input-field font-mono"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              data-testid="fee-bump-input"
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Current: {currentFeeStroops} Stroops • Bumped: {newFee} Stroops ({(parseInt(newFee, 10) / 10000000).toFixed(6)} XLM)
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || parseInt(newFee, 10) <= currentFeeStroops}
            data-testid="submit-fee-bump-btn"
          >
            <ArrowUp size={15} /> Accelerate Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
