import React from 'react';

export type StellarNetworkId = 'PUBLIC' | 'TESTNET' | 'FUTURENET' | 'STANDALONE';

interface NetworkSelectorProps {
  activeNetwork: StellarNetworkId;
  onSelectNetwork: (net: StellarNetworkId) => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ activeNetwork, onSelectNetwork }) => {
  const networks: { id: StellarNetworkId; label: string; color: string }[] = [
    { id: 'PUBLIC', label: 'Mainnet', color: 'bg-emerald-500' },
    { id: 'TESTNET', label: 'Testnet', color: 'bg-amber-500' },
    { id: 'FUTURENET', label: 'Futurenet', color: 'bg-purple-500' },
    { id: 'STANDALONE', label: 'Localhost', color: 'bg-sky-500' },
  ];

  return (
    <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700" data-testid="network-selector">
      {networks.map((net) => {
        const active = activeNetwork === net.id;
        return (
          <button
            key={net.id}
            onClick={() => onSelectNetwork(net.id)}
            data-testid={`network-btn-${net.id}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              active ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${net.color}`} />
            {net.label}
          </button>
        );
      })}
    </div>
  );
};
