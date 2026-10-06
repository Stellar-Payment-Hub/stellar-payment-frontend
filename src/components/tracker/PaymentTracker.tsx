import { useState } from 'react';
import { RefreshCw, Search, ArrowUpRight, Clock, Radio, Layers } from 'lucide-react';
import { usePaymentStream } from '../../hooks/usePaymentStream';
import { TrackerPayment, TrackerPaymentStatus } from '../../services/payments';
import { PaymentDetailModal } from './PaymentDetailModal';
import { truncateHash } from '../../lib/stellar/explorer';

const FILTER_TABS: { label: string; value?: TrackerPaymentStatus }[] = [
  { label: 'All' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const PaymentTracker = () => {
  const [selectedStatus, setSelectedStatus] = useState<TrackerPaymentStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<TrackerPayment | null>(null);

  const { payments, isLoading, isRealtimeConnected, refetch } = usePaymentStream(selectedStatus);

  const filteredPayments = payments.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.creator_address.toLowerCase().includes(q) ||
      p.recipient_address.toLowerCase().includes(q) ||
      (p.memo && p.memo.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: TrackerPaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success">✓ Completed</span>;
      case 'PROCESSING':
        return <span className="badge badge-network">● Processing</span>;
      case 'PENDING':
        return <span className="badge badge-warning">🟡 Pending</span>;
      case 'FAILED':
        return <span className="badge badge-danger">✕ Failed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  return (
    <div className="card tracker-card" data-testid="payment-tracker">
      {/* Header */}
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-cyan">
            <Layers size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 className="card-title">Payment Tracker</h3>
              <div
                className={`realtime-indicator ${isRealtimeConnected ? 'live' : 'offline'}`}
                title={isRealtimeConnected ? 'Real-time SSE stream connected' : 'Local polling mode'}
                data-testid="realtime-stream-indicator"
              >
                <Radio size={12} className={isRealtimeConnected ? 'pulse' : ''} />
                <span>{isRealtimeConnected ? 'Live Sync' : 'Polling'}</span>
              </div>
            </div>
            <p className="card-subtitle">Real-time Soroban contract payment lifecycle</p>
          </div>
        </div>

        <button
          type="button"
          className={`icon-btn ${isLoading ? 'spinning' : ''}`}
          onClick={refetch}
          title="Refresh tracker"
          aria-label="Refresh tracker"
          data-testid="refresh-tracker-btn"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="tracker-controls">
        <div className="filter-tabs-scroll">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={`filter-tab-btn ${selectedStatus === tab.value ? 'active' : ''}`}
              onClick={() => setSelectedStatus(tab.value)}
              data-testid={`filter-tab-${tab.label.toLowerCase()}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tracker-search-wrap">
          <Search size={14} className="text-muted search-icon" />
          <input
            type="text"
            className="input-field input-field-sm font-mono"
            placeholder="Filter by ID (PAY-001) or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Payment List */}
      <div className="tracker-list">
        {isLoading && payments.length === 0 ? (
          <div className="empty-state">
            <RefreshCw size={24} className="animate-spin text-muted" />
            <span className="text-muted text-sm">Loading tracked payments...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="empty-state">
            <Clock size={24} className="text-muted" />
            <span className="text-muted text-sm">No matching tracked payments found.</span>
          </div>
        ) : (
          filteredPayments.map((p) => (
            <div
              key={p.id}
              className="tracker-row-item"
              onClick={() => setSelectedPayment(p)}
              data-testid={`payment-row-${p.id}`}
            >
              <div className="tracker-row-main">
                <div className="tracker-id-badge">
                  <span className="tracker-id-text">{p.id}</span>
                  <span className="tracker-chain-id">#{p.on_chain_id}</span>
                </div>
                <div className="tracker-row-details">
                  <span className="tracker-row-to">
                    To: <strong className="mono-text">{truncateHash(p.recipient_address, 5, 5)}</strong>
                  </span>
                  {p.memo && <span className="tracker-row-memo">Memo: {p.memo}</span>}
                </div>
              </div>

              <div className="tracker-row-right">
                <div className="tracker-amount-wrap">
                  <span className="tracker-amount-val">{p.amount}</span>
                  <span className="tracker-amount-sym">XLM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {getStatusBadge(p.status)}
                  <ArrowUpRight size={14} className="text-muted" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          isOpen={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};
