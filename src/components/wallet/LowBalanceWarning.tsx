import { AlertTriangle, Sparkles } from 'lucide-react';

interface LowBalanceWarningProps {
  balance: string | number | null;
  threshold?: number;
  onFund?: () => void;
}

export function LowBalanceWarning({
  balance,
  threshold = 2.0,
  onFund,
}: LowBalanceWarningProps) {
  const numBal = parseFloat(String(balance || '0')) || 0;
  if (numBal >= threshold) return null;

  return (
    <div
      className="alert alert-warning"
      data-testid="low-balance-warning"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block' }}>
            Low XLM Balance ({numBal.toFixed(2)} XLM)
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
            Stellar accounts require a minimum base reserve of 1.0 XLM + 0.5 XLM per trustline to submit transactions.
          </span>
        </div>
      </div>

      {onFund && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onFund}
          data-testid="fund-friendbot-btn"
          style={{ flexShrink: 0, marginLeft: '0.75rem' }}
        >
          <Sparkles size={13} /> Friendbot 10,000 XLM
        </button>
      )}
    </div>
  );
}
