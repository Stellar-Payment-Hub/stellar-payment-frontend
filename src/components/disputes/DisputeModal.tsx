import { useState } from 'react';
import { X, AlertTriangle, Send, Loader2 } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
  amount?: string;
  onSubmitDispute?: (paymentId: string, reason: string, evidenceHash: string) => Promise<void> | void;
}

const REASONS = [
  { value: 'goods_not_received', label: 'Goods or Services Not Received' },
  { value: 'defective_service', label: 'Defective / Incomplete Delivery' },
  { value: 'duplicate_payment', label: 'Duplicate / Erroneous Payment' },
  { value: 'fraudulent', label: 'Unauthorized / Fraudulent Transaction' },
];

export function DisputeModal({
  isOpen,
  onClose,
  paymentId,
  amount = '100.00 XLM',
  onSubmitDispute,
}: DisputeModalProps) {
  const [reason, setReason] = useState(REASONS[0].value);
  const [evidenceHash, setEvidenceHash] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceHash.trim()) {
      setError('Please provide an evidence URI or IPFS content hash.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (onSubmitDispute) {
        await onSubmitDispute(paymentId, reason, evidenceHash.trim());
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit dispute.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" data-testid="dispute-modal">
      <div className="modal-card modal-card-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <AlertTriangle size={20} className="text-amber-400" />
            <div>
              <h3 className="modal-title">Initiate On-Chain Dispute</h3>
              <span className="text-muted text-xs">Payment Reference #{paymentId}</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.75rem', color: 'var(--warning)' }}>
            Raising a dispute freezes the payment amount ({amount}) in the Soroban PaymentRegistry until reviewed by an authorized arbitrator.
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Dispute Reason
            </label>
            <select
              className="input-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              data-testid="dispute-reason-select"
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Evidence URI or IPFS Hash (Required)
            </label>
            <input
              type="text"
              className="input-field font-mono"
              placeholder="ipfs://Qm... or https://proof..."
              value={evidenceHash}
              onChange={(e) => setEvidenceHash(e.target.value)}
              data-testid="dispute-evidence-input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Additional Statement
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Describe what occurred..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="dispute-notes-input"
            />
          </div>

          {error && (
            <div className="alert alert-danger" style={{ fontSize: '0.75rem' }} data-testid="dispute-error-alert">
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !evidenceHash.trim()}
              data-testid="submit-dispute-btn"
              style={{ flex: 1 }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
