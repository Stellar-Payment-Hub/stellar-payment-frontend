import { ToggleLeft, ToggleRight, Server } from 'lucide-react';

interface SimulationOverrideToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function SimulationOverrideToggle({ enabled, onChange }: SimulationOverrideToggleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.75rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.75rem',
      }}
      data-testid="simulation-override-toggle"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Server size={14} className="text-cyan-400" />
        <div>
          <span style={{ fontWeight: 600, display: 'block' }}>Local Simulation Override</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
            {enabled ? 'Routing simulations to /api/stellar/simulate' : 'Direct Soroban RPC Simulation'}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: enabled ? 'var(--accent-cyan)' : 'var(--text-muted)' }}
        data-testid="simulation-toggle-btn"
      >
        {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
      </button>
    </div>
  );
}
