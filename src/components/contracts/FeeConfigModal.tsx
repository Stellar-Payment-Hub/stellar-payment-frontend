import { useState } from 'react';
import { X, Settings2, Check } from 'lucide-react';
import { isValidAddress } from '../../lib/validation/payment';

interface FeeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBps?: number;
  currentTreasury?: string;
  onSave?: (bps: number, treasury: string) => Promise<void> | void;
}

export function FeeConfigModal({
  isOpen,
  onClose,
  currentBps = 25,
  currentTreasury = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
  onSave,
}: FeeConfigModalProps) {
  const [bps, setBps] = useState(String(currentBps));
  const [treasury, setTreasury] = useState(currentTreasury);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const numBps = parseInt(bps, 10) || 0;
  const pct = (numBps / 100).toFixed(2);
  const fee100 = ((100 * numBps) / 10000).toFixed(4);
  const fee1000 = ((1000 * numBps) / 10000).toFixed(4);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(treasury.trim())) return;

    if (onSave) {
      await onSave(numBps, treasury.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" data-testid="fee-config-modal">
      <div className="modal-card modal-card-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Settings2 size={20} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">Fee Configuration</h3>
              <span className="text-muted text-xs">Platform Governance Parameters</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Platform Fee Basis Points (BPS)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="0"
                max="500"
                className="input-field"
                value={bps}
                onChange={(e) => setBps(e.target.value)}
                data-testid="fee-bps-input"
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                {pct}%
              </span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Treasury Payout Address
            </label>
            <input
              type="text"
              className="input-field font-mono"
              value={treasury}
              onChange={(e) => setTreasury(e.target.value)}
              data-testid="fee-treasury-input"
            />
          </div>

          {/* Fee impact preview */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Fee Impact Preview:</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>On 100 XLM Payment:</span>
              <span className="font-mono font-bold" data-testid="preview-fee-100">{fee100} XLM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
              <span>On 1,000 XLM Settlement:</span>
              <span className="font-mono font-bold" data-testid="preview-fee-1000">{fee1000} XLM</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            data-testid="save-fee-config-btn"
          >
            {saved ? <Check size={15} /> : null}
            {saved ? 'Parameters Saved' : 'Save Parameters'}
          </button>
        </form>
      </div>
    </div>
  );
}
