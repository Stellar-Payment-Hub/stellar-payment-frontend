import { useState } from 'react';
import { readContractPayment, OnChainPaymentRecord } from '../../lib/contracts/paymentRegistry';
import { Search, Database, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { STELLAR_CONFIG } from '../../config/env';

export function ContractReader() {
  const [queryId, setQueryId] = useState('PAY-001');
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<OnChainPaymentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReadContract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await readContractPayment(queryId);
      if (!res) {
        setError(`No payment record found on-chain or indexed for query "${queryId}".`);
        setRecord(null);
      } else {
        setRecord(res);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read contract state.');
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-cyan">
            <Database size={18} />
          </div>
          <div>
            <h3 className="card-title">Contract Read Operations</h3>
            <p className="card-subtitle">Query On-Chain Soroban PaymentRegistry State</p>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Directly invoke <code>get_payment(id)</code> on the deployed Testnet Soroban contract (
        <span className="mono-text" style={{ fontSize: '0.75rem' }}>{STELLAR_CONFIG.contractId.substring(0, 10)}...</span>)
        to inspect verified blockchain payment state.
      </p>

      <form onSubmit={handleReadContract} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. PAY-001 or 1"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem' }}
            data-testid="contract-query-input"
          />
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !queryId.trim()}
          data-testid="contract-query-btn"
          style={{ whiteSpace: 'nowrap' }}
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="spin" style={{ marginRight: '0.35rem' }} />
              Reading...
            </>
          ) : (
            'Get Payment'
          )}
        </button>
      </form>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {record && (
        <div
          data-testid="contract-read-result"
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} className="text-cyan-400" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
                {`Payment #PAY-${String(record.id).padStart(3, '0')}`}
              </h4>
            </div>
            <span
              className={`status-badge status-${record.status.toLowerCase()}`}
              style={{ fontSize: '0.75rem' }}
            >
              <CheckCircle2 size={12} style={{ marginRight: '0.25rem' }} />
              {record.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Recipient:</span>
              <span className="mono-text" style={{ wordBreak: 'break-all' }}>
                {record.recipient}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Amount:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {`${record.amount} XLM`}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Status:</span>
              <span>{record.status}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Created:</span>
              <span>{record.createdAt}</span>
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>Verified Source: <strong style={{ color: 'var(--color-cyan)' }}>{record.source === 'soroban_rpc' ? 'Soroban RPC Simulation' : 'Synchronized Ledger Index'}</strong></span>
            <span className="mono-text">On-chain ID: {record.id}</span>
          </div>
        </div>
      )}
    </div>
  );
}
