import { useState, useMemo } from 'react';
import { History, Search, Download, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

export interface TxHistoryItem {
  id: string;
  hash: string;
  source: string;
  destination: string;
  amount: string;
  asset: string;
  status: 'Success' | 'Pending' | 'Failed';
  timestamp: number;
}

interface TransactionHistoryProps {
  transactions?: TxHistoryItem[];
  onExportCsv?: () => void;
}

export function TransactionHistory({ transactions = [], onExportCsv }: TransactionHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'Success' | 'Pending' | 'Failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tx.hash.toLowerCase().includes(q) ||
          tx.source.toLowerCase().includes(q) ||
          tx.destination.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, filterStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 size={13} className="text-emerald-400" />;
      case 'Pending':
        return <Clock size={13} className="text-amber-400" />;
      default:
        return <XCircle size={13} className="text-danger" />;
    }
  };

  return (
    <div className="card" data-testid="transaction-history">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} className="text-cyan-400" />
          <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Transaction History</h3>
        </div>

        {onExportCsv && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onExportCsv}
            data-testid="export-csv-btn"
          >
            <Download size={13} /> Export CSV
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by address or hash..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            data-testid="history-search-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>

        <select
          className="input-field"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as any);
            setPage(1);
          }}
          data-testid="history-status-filter"
          style={{ width: '130px' }}
        >
          <option value="all">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          No transactions match your filter criteria.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem' }}>Amount</th>
                <th style={{ padding: '0.5rem' }}>Destination</th>
                <th style={{ padding: '0.5rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} data-testid={`history-row-${tx.id}`}>
                  <td style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getStatusIcon(tx.status)} {tx.status}
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {tx.amount} {tx.asset}
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                    {tx.destination.length > 12 ? `${tx.destination.substring(0, 6)}...${tx.destination.substring(tx.destination.length - 4)}` : tx.destination}
                  </td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Page {page} of {totalPages} ({filtered.length} total)</span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                data-testid="pagination-prev"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                data-testid="pagination-next"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
