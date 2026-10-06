import { useState } from 'react';
import { ExternalLink, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { STELLAR_CONFIG } from '../../config/env';

export interface TxItem {
  hash: string;
  type: 'Contract Call' | 'Native XLM';
  amount: string;
  destination: string;
  timestamp: string;
  status: 'Success' | 'Pending' | 'Failed';
  ledger: number;
}

const INITIAL_TXS: TxItem[] = [
  {
    hash: '3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889',
    type: 'Contract Call',
    amount: '25.0000 XLM',
    destination: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    timestamp: '2026-10-06 11:30:00 UTC',
    status: 'Success',
    ledger: 104250,
  },
  {
    hash: '9a7b6c5d4e3f210987654321fedcba0987654321fedcba0987654321fedcba09',
    type: 'Contract Call',
    amount: '10.0000 XLM',
    destination: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7',
    timestamp: '2026-10-06 11:00:00 UTC',
    status: 'Success',
    ledger: 104100,
  },
  {
    hash: '1234abcd5678ef901234abcd5678ef901234abcd5678ef901234abcd5678ef90',
    type: 'Native XLM',
    amount: '15.5000 XLM',
    destination: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    timestamp: '2026-10-06 11:15:00 UTC',
    status: 'Pending',
    ledger: 104190,
  },
];

export function TransactionHistoryView() {
  const [filter, setFilter] = useState<'All' | 'Success' | 'Pending' | 'Failed'>('All');
  const [txs] = useState<TxItem[]>(INITIAL_TXS);

  const filtered = txs.filter((tx) => {
    if (filter === 'All') return true;
    return tx.status === filter;
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

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {(['All', 'Success', 'Pending', 'Failed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-tab-btn ${filter === s ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        {filtered.map((tx) => (
          <div
            key={tx.hash}
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
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.amount}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.timestamp}</span>
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
        ))}
      </div>
    </div>
  );
}
