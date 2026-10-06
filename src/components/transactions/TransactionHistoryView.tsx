import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, Clock, XCircle, ArrowUpRight, RefreshCw, Filter } from 'lucide-react';
import { STELLAR_CONFIG } from '../../config/env';
import { TrackerTransaction, paymentApiService } from '../../services/payments';

export function TransactionHistoryView() {
  const [filter, setFilter] = useState<'All' | 'Contract Payment' | 'Native Payment' | 'Settlement' | 'Tip'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Pending' | 'Failed'>('All');
  const [txs, setTxs] = useState<TrackerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await paymentApiService.getTransactions();
      setTxs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = txs.filter((tx) => {
    if (filter !== 'All' && tx.type !== filter) return false;
    if (statusFilter !== 'All' && tx.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="card" data-testid="transactions-view">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="card-title-group">
          <div className="icon-badge icon-badge-purple">
            <ArrowUpRight size={18} />
          </div>
          <div>
            <h3 className="card-title">Transaction Ledger</h3>
            <p className="card-subtitle">Verifiable On-Chain Stellar Testnet Activity</p>
          </div>
        </div>

        <button
          type="button"
          className={`icon-btn ${isLoading ? 'spinning' : ''}`}
          onClick={loadTransactions}
          title="Refresh transaction ledger"
          aria-label="Refresh transactions"
          data-testid="refresh-txs-btn"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          margin: '0.75rem 0',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Filter size={12} /> Type:
          </span>
          {(['All', 'Contract Payment', 'Native Payment', 'Settlement', 'Tip'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`filter-tab-btn ${filter === t ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['All', 'Success', 'Pending', 'Failed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-tab-btn ${statusFilter === s ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        {isLoading && txs.length === 0 ? (
          <div className="empty-state">
            <RefreshCw size={24} className="animate-spin text-muted" />
            <span className="text-muted text-sm">Loading transactions...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Clock size={24} className="text-muted" />
            <span className="text-muted text-sm">No transactions match your criteria.</span>
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id || tx.hash}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
              data-testid={`tx-row-${tx.hash.substring(0, 8)}`}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.amount}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tx.type}
                  </span>
                  <span
                    className={`status-badge status-${tx.status.toLowerCase()}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {tx.status === 'Success' && <CheckCircle size={10} style={{ marginRight: '0.2rem' }} />}
                    {tx.status === 'Pending' && <Clock size={10} style={{ marginRight: '0.2rem' }} />}
                    {tx.status === 'Failed' && <XCircle size={10} style={{ marginRight: '0.2rem' }} />}
                    {tx.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  To: <span className="mono-text">{tx.destination.substring(0, 10)}...{tx.destination.slice(-6)}</span> • Ledger: {tx.ledger}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(tx.created_at).toLocaleString()}
                </span>
                <a
                  href={`${STELLAR_CONFIG.explorerTxUrl}/${tx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  Explorer <ExternalLink size={12} style={{ marginLeft: '0.25rem' }} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
