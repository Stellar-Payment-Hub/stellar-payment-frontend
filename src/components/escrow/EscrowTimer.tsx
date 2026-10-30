import { useState, useEffect } from 'react';
import { Clock, Lock, Unlock, ShieldCheck } from 'lucide-react';

interface EscrowTimerProps {
  unlockTimestamp: number;
  createdTimestamp?: number;
  onUnlocked?: () => void;
}

export function EscrowTimer({
  unlockTimestamp,
  createdTimestamp = Date.now() - 3600000,
  onUnlocked,
}: EscrowTimerProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= unlockTimestamp && onUnlocked) {
        onUnlocked();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [unlockTimestamp, onUnlocked]);

  const totalDuration = Math.max(1, unlockTimestamp - createdTimestamp);
  const elapsed = Math.max(0, now - createdTimestamp);
  const progressPercent = Math.min(100, Math.round((elapsed / totalDuration) * 100));
  const isUnlocked = now >= unlockTimestamp;

  const remainingMs = Math.max(0, unlockTimestamp - now);
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return (
    <div
      className="card"
      data-testid="escrow-timer"
      style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: `1px solid ${isUnlocked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isUnlocked ? <Unlock size={16} className="text-emerald-400" /> : <Lock size={16} className="text-amber-400" />}
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {isUnlocked ? 'Timelock Escrow Unlocked' : 'Timelock Escrow Active'}
          </span>
        </div>

        <span
          className={`badge ${isUnlocked ? 'badge-success' : 'badge-warning'}`}
          data-testid="escrow-status-badge"
          style={{ fontSize: '0.7rem' }}
        >
          {isUnlocked ? 'Claimable' : 'Locked'}
        </span>
      </div>

      {!isUnlocked ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Clock size={13} className="text-muted" />
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }} data-testid="escrow-countdown">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} remaining
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
            Unlocks automatically at {new Date(unlockTimestamp).toLocaleTimeString()}
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} />
          <span>Funds are unlocked and available for beneficiary withdrawal.</span>
        </div>
      )}
    </div>
  );
}
