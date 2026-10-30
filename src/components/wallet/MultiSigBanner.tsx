import { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';

interface MultiSigBannerProps {
  signersCount?: number;
  threshold?: number;
  accountAddress?: string;
  pendingXdr?: string;
}

export function MultiSigBanner({
  signersCount = 3,
  threshold = 2,
  accountAddress: _accountAddress,
  pendingXdr,
}: MultiSigBannerProps) {
  const [copiedXdr, setCopiedXdr] = useState(false);

  const copyXdr = async () => {
    if (!pendingXdr) return;
    try {
      await navigator.clipboard.writeText(pendingXdr);
      setCopiedXdr(true);
      setTimeout(() => setCopiedXdr(false), 2000);
    } catch {
      //
    }
  };

  return (
    <div
      className="card"
      data-testid="multisig-banner"
      style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} className="text-indigo-400" />
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Multi-Signature Account Detected
          </h4>
        </div>
        <span
          className="badge"
          style={{
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            fontSize: '0.7rem',
          }}
          data-testid="multisig-threshold-badge"
        >
          Threshold: {threshold} of {signersCount} Signers
        </span>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        This account requires multiple cryptographic signatures to authorize transactions. Once you sign, share the transaction envelope XDR with remaining co-signers.
      </p>

      {pendingXdr && (
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <input
            type="text"
            readOnly
            className="input-field font-mono"
            style={{ fontSize: '0.7rem', padding: '0.35rem 0.6rem' }}
            value={pendingXdr}
            data-testid="multisig-xdr-input"
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={copyXdr}
            data-testid="copy-multisig-xdr-btn"
          >
            {copiedXdr ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copiedXdr ? 'Copied' : 'Copy XDR'}
          </button>
        </div>
      )}
    </div>
  );
}
