import { useState } from 'react';
import { Copy, Check, Link as LinkIcon } from 'lucide-react';

interface ShareablePaymentLinkProps {
  recipient: string;
  amount: string;
  asset?: string;
  memo?: string;
}

export function ShareablePaymentLink({
  recipient,
  amount,
  asset = 'native',
  memo = '',
}: ShareablePaymentLinkProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://stellar-hub.pay';
  const params = new URLSearchParams();
  if (recipient) params.set('pay', recipient);
  if (amount) params.set('amount', amount);
  if (asset) params.set('asset', asset);
  if (memo) params.set('memo', memo);

  const shareableUrl = `${baseUrl}/?${params.toString()}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.75rem',
      }}
      data-testid="shareable-payment-link"
    >
      <LinkIcon size={14} className="text-cyan-400" style={{ flexShrink: 0 }} />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--text-secondary)',
          flex: 1,
        }}
        data-testid="share-url-preview"
      >
        {shareableUrl}
      </span>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={handleCopy}
        data-testid="copy-share-link-btn"
        style={{ flexShrink: 0 }}
      >
        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  );
}
