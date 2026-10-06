import { useState, useEffect } from 'react';
import { RefreshCw, Search, ArrowUpRight, Clock, Radio, Layers, GitMerge, Users } from 'lucide-react';
import { usePaymentStream } from '../../hooks/usePaymentStream';
import { TrackerPayment, TrackerPaymentStatus, TrackerSettlement, paymentApiService } from '../../services/payments';
import { PaymentDetailModal } from './PaymentDetailModal';
import { SettlementDetailModal } from './SettlementDetailModal';
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
  const [activeCategory, setActiveCategory] = useState<'payments' | 'settlements'>('payments');
  const [selectedStatus, setSelectedStatus] = useState<TrackerPaymentStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<TrackerPayment | null>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<TrackerSettlement | null>(null);

  const { payments, isLoading: isPaymentsLoading, isRealtimeConnected, refetch: refetchPayments } = usePaymentStream(selectedStatus);
  const [settlements, setSettlements] = useState<TrackerSettlement[]>([]);
  const [isSettlementsLoading, setIsSettlementsLoading] = useState(false);

  const fetchSettlements = async () => {
    setIsSettlementsLoading(true);
    try {
      const data = await paymentApiService.getSettlements();
      setSettlements(data);
    } finally {
      setIsSettlementsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleRefresh = () => {
    refetchPayments();
    fetchSettlements();
  };

  // Filter single payments
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

  // Filter settlements
  const filteredSettlements = settlements.filter((s) => {
    if (selectedStatus && s.status !== selectedStatus && !(selectedStatus === 'PENDING' && s.status === 'CREATED')) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.payer.toLowerCase().includes(q) ||
      (s.memo && s.memo.toLowerCase().includes(q)) ||
      s.recipients.some((r) => r.recipient.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success">✓ Completed</span>;
      case 'PROCESSING':
        return <span className="badge badge-network">● Processing</span>;
      case 'PENDING':
      case 'CREATED':
        return <span className="badge badge-warning">🟡 {status}</span>;
      case 'FAILED':
        return <span className="badge badge-danger">✕ Failed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  const isLoading = activeCategory === 'payments' ? isPaymentsLoading : isSettlementsLoading;

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
              <h3 className="card-title">Payment Tracker 2.0</h3>
              <div
                className={`realtime-indicator ${isRealtimeConnected ? 'live' : 'offline'}`}
                title={isRealtimeConnected ? 'Real-time SSE stream connected' : 'Local polling mode'}
                data-testid="realtime-stream-indicator"
              >
                <Radio size={12} className={isRealtimeConnected ? 'pulse' : ''} />
                <span>{isRealtimeConnected ? 'Live Sync' : 'Polling'}</span>
              </div>
            </div>
            <p className="card-subtitle">Soroban Lifecycle & Multi-Recipient Settlement Tracking</p>
          </div>
        </div>

        <button
          type="button"
          className={`icon-btn ${isLoading ? 'spinning' : ''}`}
          onClick={handleRefresh}
          title="Refresh tracker"
          aria-label="Refresh tracker"
          data-testid="refresh-tracker-btn"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Category Toggle: Registry Payments vs Multi-Address Settlements */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          className={`btn ${activeCategory === 'payments' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveCategory('payments')}
          data-testid="tracker-cat-payments"
        >
          <Layers size={13} style={{ marginRight: '0.35rem' }} /> Single Payments ({filteredPayments.length})
        </button>
        <button
          type="button"
          className={`btn ${activeCategory === 'settlements' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveCategory('settlements')}
          data-testid="tracker-cat-settlements"
        >
          <GitMerge size={13} style={{ marginRight: '0.35rem' }} /> Multi-Address Settlements ({filteredSettlements.length})
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
            placeholder={activeCategory === 'payments' ? "Filter by ID (PAY-001) or address..." : "Filter by SETTLE-ID or recipient..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List Body */}
      {activeCategory === 'payments' ? (
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
      ) : (
        <div className="tracker-list">
          {isLoading && settlements.length === 0 ? (
            <div className="empty-state">
              <RefreshCw size={24} className="animate-spin text-muted" />
              <span className="text-muted text-sm">Loading multi-address settlements...</span>
            </div>
          ) : filteredSettlements.length === 0 ? (
            <div className="empty-state">
              <Clock size={24} className="text-muted" />
              <span className="text-muted text-sm">No matching multi-address settlements found.</span>
            </div>
          ) : (
            filteredSettlements.map((s) => (
              <div
                key={s.id}
                className="tracker-row-item"
                onClick={() => setSelectedSettlement(s)}
                data-testid={`settlement-row-${s.id}`}
              >
                <div className="tracker-row-main">
                  <div className="tracker-id-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
                    <span className="tracker-id-text" style={{ color: 'var(--cyan-400)' }}>{s.id}</span>
                    <span className="tracker-chain-id">#{s.on_chain_id}</span>
                  </div>
                  <div className="tracker-row-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-network" style={{ fontSize: '0.65rem' }}>
                        <Users size={10} style={{ marginRight: '0.2rem' }} /> {s.recipient_count} recipients
                      </span>
                      {s.memo && <span className="tracker-row-memo">Memo: {s.memo}</span>}
                    </div>
                    <span className="tracker-row-to text-xs" style={{ color: 'var(--text-muted)' }}>
                      Payer: <strong className="mono-text">{truncateHash(s.payer, 5, 5)}</strong>
                    </span>
                  </div>
                </div>

                <div className="tracker-row-right">
                  <div className="tracker-amount-wrap">
                    <span className="tracker-amount-val">{s.total_amount}</span>
                    <span className="tracker-amount-sym">XLM</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {getStatusBadge(s.status)}
                    <ArrowUpRight size={14} className="text-muted" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Single Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          isOpen={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* Multi-Address Settlement Detail Modal */}
      {selectedSettlement && (
        <SettlementDetailModal
          settlement={selectedSettlement}
          isOpen={Boolean(selectedSettlement)}
          onClose={() => setSelectedSettlement(null)}
        />
      )}
    </div>
  );
};
