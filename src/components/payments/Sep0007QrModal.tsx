import { useState } from 'react';
import { X, QrCode, ExternalLink, Copy, Check, Smartphone } from 'lucide-react';

interface Sep0007QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  amount: string;
  memo?: string;
  asset?: string;
}

export function Sep0007QrModal({
  isOpen,
  onClose,
  destination,
  amount,
  memo,
  asset = 'native',
}: Sep0007QrModalProps) {
  const [copiedUri, setCopiedUri] = useState(false);

  if (!isOpen) return null;

  // Build standard SEP-0007 URI
  const params = new URLSearchParams();
  params.set('destination', destination);
  params.set('amount', amount);
  if (memo) {
    params.set('memo', memo);
    params.set('memo_type', 'MEMO_TEXT');
  }
  if (asset && asset !== 'native') {
    params.set('asset_code', asset);
  }

  const sep0007Uri = `web+stellar:pay?${params.toString()}`;

  const copyUri = async () => {
    try {
      await navigator.clipboard.writeText(sep0007Uri);
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2000);
    } catch {
      //
    }
  };

  const openInWallet = () => {
    if (typeof window !== 'undefined') {
      window.location.href = sep0007Uri;
    }
  };

  return (
    <div className="modal-backdrop" data-testid="sep0007-qr-modal">
      <div className="modal-card modal-card-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Smartphone size={20} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">SEP-0007 Mobile Pay</h3>
              <span className="text-muted text-xs">Standard Stellar URI Scheme</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Scan with any SEP-0007 compliant mobile wallet (Lobstr, Solar, xBull) to sign and submit immediately.
          </p>

          {/* QR Code Container */}
          <div
            style={{
              width: '180px',
              height: '180px',
              margin: '0 auto 1.25rem auto',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
            }}
          >
            <QrCode size={150} color="#07090e" />
          </div>

          <div
            style={{
              textAlign: 'left',
              background: 'rgba(255,255,255,0.02)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>SEP-0007 URI</span>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                wordBreak: 'break-all',
                color: 'var(--accent-cyan)',
              }}
              data-testid="sep0007-uri-text"
            >
              {sep0007Uri}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openInWallet}
              data-testid="sep0007-open-btn"
            >
              <ExternalLink size={15} /> Open in Wallet
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={copyUri}
              data-testid="sep0007-copy-btn"
            >
              {copiedUri ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              {copiedUri ? 'URI Copied!' : 'Copy URI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
