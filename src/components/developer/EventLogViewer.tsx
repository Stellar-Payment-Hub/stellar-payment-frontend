import { useState } from 'react';
import { Terminal, Copy, Check, Trash2 } from 'lucide-react';

export interface SorobanContractEvent {
  id: string;
  contractId: string;
  topic: string;
  data: any;
  timestamp: number;
}

interface EventLogViewerProps {
  events?: SorobanContractEvent[];
  onClear?: () => void;
}

const DEFAULT_EVENTS: SorobanContractEvent[] = [
  {
    id: 'evt-1',
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    topic: 'PaymentCreated',
    data: { id: 'PAY-001', amount: '1000000000', payer: 'GA5ZSE...' },
    timestamp: Date.now() - 45000,
  },
  {
    id: 'evt-2',
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    topic: 'DisputeRaised',
    data: { id: 'PAY-001', reason: 'goods_not_received' },
    timestamp: Date.now() - 15000,
  },
];

export function EventLogViewer({ events = DEFAULT_EVENTS, onClear }: EventLogViewerProps) {
  const [filterTopic, setFilterTopic] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = events.filter((e) => filterTopic === 'all' || e.topic === filterTopic);

  const copyEvent = async (evt: SorobanContractEvent) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(evt, null, 2));
      setCopiedId(evt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      //
    }
  };

  return (
    <div className="card" data-testid="event-log-viewer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Terminal size={18} className="text-cyan-400" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Soroban Contract Event Stream</h4>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <select
            className="input-field"
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', width: 'auto' }}
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            data-testid="event-topic-filter"
          >
            <option value="all">All Topics</option>
            <option value="PaymentCreated">PaymentCreated</option>
            <option value="PaymentCompleted">PaymentCompleted</option>
            <option value="DisputeRaised">DisputeRaised</option>
          </select>
          {onClear && (
            <button type="button" className="icon-btn" onClick={onClear} title="Clear Logs">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
        {filtered.map((evt) => (
          <div
            key={evt.id}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
            }}
            data-testid={`event-row-${evt.id}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span className="badge badge-network" style={{ fontSize: '0.65rem' }}>{evt.topic}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                <button type="button" className="icon-btn" style={{ width: '18px', height: '18px' }} onClick={() => copyEvent(evt)}>
                  {copiedId === evt.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
            <pre style={{ margin: 0, color: 'var(--text-secondary)', overflowX: 'auto' }}>
              {JSON.stringify(evt.data)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
