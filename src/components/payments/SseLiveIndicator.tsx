import { RefreshCw } from 'lucide-react';

interface SseLiveIndicatorProps {
  isConnected: boolean;
  eventCount: number;
  lastEventAt?: number | null;
  onReconnect?: () => void;
}

export function SseLiveIndicator({
  isConnected,
  eventCount,
  lastEventAt,
  onReconnect,
}: SseLiveIndicatorProps) {
  const timeSinceLastEvent = lastEventAt
    ? Math.max(0, Math.floor((Date.now() - lastEventAt) / 1000))
    : null;

  return (
    <div
      data-testid="sse-live-indicator"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        fontSize: '0.75rem',
      }}
    >
      {/* Animated pulsing dot */}
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isConnected ? 'var(--success)' : 'var(--danger)',
          display: 'inline-block',
          boxShadow: isConnected ? '0 0 8px var(--success)' : 'none',
        }}
        data-testid="sse-status-dot"
      />

      <span style={{ fontWeight: 600, color: isConnected ? 'var(--success)' : 'var(--danger)' }}>
        {isConnected ? 'SSE Live' : 'Disconnected'}
      </span>

      <span style={{ color: 'var(--text-muted)' }}>•</span>

      <span style={{ color: 'var(--text-secondary)' }} data-testid="sse-event-count">
        {eventCount} event{eventCount !== 1 ? 's' : ''}
      </span>

      {timeSinceLastEvent !== null && (
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          ({timeSinceLastEvent}s ago)
        </span>
      )}

      {!isConnected && onReconnect && (
        <button
          type="button"
          className="icon-btn"
          style={{ width: '18px', height: '18px', marginLeft: '0.25rem' }}
          onClick={onReconnect}
          title="Reconnect to event stream"
          data-testid="sse-reconnect-btn"
        >
          <RefreshCw size={11} />
        </button>
      )}
    </div>
  );
}
