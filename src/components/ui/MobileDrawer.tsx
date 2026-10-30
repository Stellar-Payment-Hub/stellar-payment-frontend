import { X, Zap, Send, Split, History, Heart, Code2 } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  connectedAddress: string | null;
}

export function MobileDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  connectedAddress,
}: MobileDrawerProps) {
  if (!isOpen) return null;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'payments', label: 'Payments', icon: Send },
    { id: 'tracker', label: 'Settlement Tracker', icon: Split },
    { id: 'transactions', label: 'History', icon: History },
    { id: 'tipjar', label: 'Tip Jar', icon: Heart },
    { id: 'developer', label: 'Developer', icon: Code2 },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      data-testid="mobile-drawer"
      onClick={onClose}
    >
      <div
        style={{
          width: '280px',
          height: '100%',
          background: 'var(--bg-dark)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={20} className="text-cyan-400" />
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>Stellar Hub</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                data-testid={`drawer-tab-${item.id}`}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
        </div>

        {connectedAddress && (
          <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Connected</span>
            <span className="font-mono text-cyan-400">
              {connectedAddress.substring(0, 8)}...{connectedAddress.substring(connectedAddress.length - 4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
