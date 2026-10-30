import { Sparkles, RotateCcw } from 'lucide-react';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: (enabled: boolean) => void;
  onReset?: () => void;
}

export function DemoModeToggle({ isDemoMode, onToggle, onReset }: DemoModeToggleProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.65rem',
        background: isDemoMode ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${isDemoMode ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
      }}
      data-testid="demo-mode-toggle"
    >
      <button
        type="button"
        onClick={() => onToggle(!isDemoMode)}
        data-testid="demo-toggle-btn"
        style={{
          background: 'none',
          border: 'none',
          color: isDemoMode ? 'var(--accent-purple)' : 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 600,
        }}
      >
        <Sparkles size={13} />
        {isDemoMode ? 'Demo Sandbox Active' : 'Enable Demo Mode'}
      </button>

      {isDemoMode && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="icon-btn"
          style={{ width: '18px', height: '18px' }}
          title="Reset Demo Environment"
          data-testid="reset-demo-btn"
        >
          <RotateCcw size={11} />
        </button>
      )}
    </div>
  );
}
