import { useState } from 'react';
import { Server, Activity, Check, RefreshCw } from 'lucide-react';

interface RpcEndpointSwitcherProps {
  currentRpcUrl?: string;
  onEndpointChange?: (url: string) => void;
}

const PRESET_ENDPOINTS = [
  { name: 'Testnet (Default)', url: 'https://soroban-testnet.stellar.org' },
  { name: 'Futurenet', url: 'https://rpc-futurenet.stellar.org' },
  { name: 'Local Standalone', url: 'http://localhost:8000/soroban/rpc' },
  { name: 'Public Mainnet', url: 'https://mainnet.sorobanrpc.com' },
];

export function RpcEndpointSwitcher({
  currentRpcUrl = 'https://soroban-testnet.stellar.org',
  onEndpointChange,
}: RpcEndpointSwitcherProps) {
  const [selectedUrl, setSelectedUrl] = useState(currentRpcUrl);
  const [latency, setLatency] = useState<number | null>(null);
  const [pinging, setPinging] = useState(false);

  const handleSelect = (url: string) => {
    setSelectedUrl(url);
    if (onEndpointChange) onEndpointChange(url);
  };

  const pingEndpoint = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      // Simulate ping measurement
      await new Promise((resolve) => setTimeout(resolve, 80));
      const dur = Math.round(performance.now() - start);
      setLatency(dur);
    } catch {
      setLatency(-1);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="card" data-testid="rpc-endpoint-switcher">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={18} className="text-cyan-400" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Stellar Soroban RPC Network</h4>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={pingEndpoint}
          disabled={pinging}
          data-testid="ping-rpc-btn"
        >
          {pinging ? <RefreshCw size={12} className="animate-spin" /> : <Activity size={12} />}
          {latency !== null ? `${latency}ms` : 'Ping'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {PRESET_ENDPOINTS.map((ep) => {
          const isCurrent = selectedUrl === ep.url;
          return (
            <button
              key={ep.url}
              type="button"
              className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ justifyContent: 'space-between', width: '100%', textAlign: 'left' }}
              onClick={() => handleSelect(ep.url)}
              data-testid={`rpc-select-${ep.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>{ep.name}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>{ep.url}</span>
              </div>
              {isCurrent && <Check size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
