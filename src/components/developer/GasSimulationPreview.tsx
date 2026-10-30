import { Cpu, Database, Zap } from 'lucide-react';

interface GasSimulationPreviewProps {
  cpuInstructions?: number;
  memoryBytes?: number;
  estimatedFeeStroops?: number;
}

export function GasSimulationPreview({
  cpuInstructions = 2450120,
  memoryBytes = 1840320,
  estimatedFeeStroops = 2500,
}: GasSimulationPreviewProps) {
  const MAX_CPU = 100000000;
  const MAX_MEM = 41943040;

  const cpuPercent = Math.min(100, Math.round((cpuInstructions / MAX_CPU) * 100));
  const memPercent = Math.min(100, Math.round((memoryBytes / MAX_MEM) * 100));
  const feeXlm = (estimatedFeeStroops / 10000000).toFixed(7);

  return (
    <div
      className="card"
      data-testid="gas-simulation-preview"
      style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={16} className="text-cyan-400" />
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Soroban Pre-Flight Simulation</h4>
        </div>
        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Simulation Passed</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={12} /> CPU Instructions
            </span>
            <span className="font-mono" data-testid="sim-cpu-val">{cpuInstructions.toLocaleString()} / 100M</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)' }}>
            <div style={{ width: `${Math.max(2, cpuPercent)}%`, height: '100%', background: 'var(--accent-cyan)' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Database size={12} /> Memory Footprint
            </span>
            <span className="font-mono" data-testid="sim-mem-val">{(memoryBytes / 1024).toFixed(1)} KB / 40 MB</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)' }}>
            <div style={{ width: `${Math.max(2, memPercent)}%`, height: '100%', background: 'var(--accent-indigo)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Estimated Resource Fee</span>
          <span className="font-mono font-bold" data-testid="sim-fee-val">{estimatedFeeStroops} Stroops ({feeXlm} XLM)</span>
        </div>
      </div>
    </div>
  );
}
