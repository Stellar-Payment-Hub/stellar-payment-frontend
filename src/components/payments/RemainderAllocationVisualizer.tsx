import { Coins, ShieldCheck, Info } from 'lucide-react';

interface RemainderAllocationVisualizerProps {
  totalAmount: string | number;
  recipientCount: number;
  asset?: string;
}

export function RemainderAllocationVisualizer({
  totalAmount,
  recipientCount,
  asset = 'XLM',
}: RemainderAllocationVisualizerProps) {
  const STROOPS_PER_XLM = 10_000_000;
  const numAmount = parseFloat(String(totalAmount)) || 0;
  const validRecipients = Math.max(1, recipientCount);

  const totalStroops = Math.round(numAmount * STROOPS_PER_XLM);
  const basePerRecipient = Math.floor(totalStroops / validRecipients);
  const remainderDust = totalStroops % validRecipients;
  const recipient1TotalStroops = basePerRecipient + remainderDust;

  return (
    <div
      className="card"
      data-testid="remainder-visualizer"
      style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Coins size={18} className="text-cyan-400" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Zero-Loss Stroop Remainder Visualizer
          </h4>
        </div>
        <span
          className="badge badge-success"
          style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ShieldCheck size={12} /> Soroban Protocol Rule
        </span>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
        Stellar Soroban contracts calculate payments in discrete integer Stroops (1 {asset} = 10,000,000 Stroops).
        Any fractional remainder dust is automatically assigned to Recipient #1 to ensure zero loss of funds.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total Stroops</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }} data-testid="total-stroops">
            {totalStroops.toLocaleString()}
          </span>
        </div>

        <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Base / Recipient</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }} data-testid="base-stroops">
            {basePerRecipient.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
            ({(basePerRecipient / STROOPS_PER_XLM).toFixed(7)} {asset})
          </span>
        </div>

        <div style={{ padding: '0.6rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'block' }}>Dust Remainder</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }} data-testid="dust-remainder">
            +{remainderDust} Stroop{remainderDust !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
            Assigned to Recipient #1
          </span>
        </div>

        <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--success)', display: 'block' }}>Recipient #1 Total</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--success)' }} data-testid="recipient-1-total">
            {recipient1TotalStroops.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
            ({(recipient1TotalStroops / STROOPS_PER_XLM).toFixed(7)} {asset})
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <Info size={13} />
        <span>
          Mathematical check: ({basePerRecipient} × {validRecipients}) + {remainderDust} = {totalStroops} Stroops (100.00% accounted for).
        </span>
      </div>
    </div>
  );
}
