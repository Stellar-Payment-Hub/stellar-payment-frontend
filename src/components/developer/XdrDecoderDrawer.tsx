import { useState } from 'react';
import { Code2, X, Play, Copy, Check } from 'lucide-react';

interface XdrDecoderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialXdr?: string;
}

export function XdrDecoderDrawer({
  isOpen,
  onClose,
  initialXdr = '',
}: XdrDecoderDrawerProps) {
  const [xdr, setXdr] = useState(initialXdr);
  const [decoded, setDecoded] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDecode = () => {
    if (!xdr.trim()) return;
    try {
      // Mock decode / parse base64 XDR
      setDecoded({
        type: 'TransactionEnvelope',
        v1: {
          tx: {
            sourceAccount: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
            fee: 100,
            seqNum: '104530882194',
            operations: [
              {
                type: 'InvokeHostFunction',
                function: 'create_payment',
              },
            ],
          },
        },
      });
    } catch {
      setDecoded({ error: 'Invalid Base64 XDR string' });
    }
  };

  const copyJson = async () => {
    if (!decoded) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(decoded, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  };

  return (
    <div className="modal-backdrop" data-testid="xdr-decoder-drawer">
      <div className="modal-card modal-card-lg">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Code2 size={20} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">Raw XDR Inspector & Decoder</h3>
              <span className="text-muted text-xs">Soroban ScVal & TransactionEnvelope</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Base64 XDR Payload
            </label>
            <textarea
              className="input-field font-mono"
              rows={3}
              placeholder="Paste Base64 XDR..."
              value={xdr}
              onChange={(e) => setXdr(e.target.value)}
              data-testid="xdr-input-textarea"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDecode}
              data-testid="decode-xdr-btn"
            >
              <Play size={14} /> Decode XDR
            </button>
            {decoded && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={copyJson}
                data-testid="copy-decoded-json-btn"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Copied JSON' : 'Copy JSON'}
              </button>
            )}
          </div>

          {decoded && (
            <div style={{ background: '#07090e', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
              <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', overflowX: 'auto' }} data-testid="decoded-json-output">
                {JSON.stringify(decoded, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
