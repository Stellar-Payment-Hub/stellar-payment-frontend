import React from 'react';
import { SupportedWalletProvider } from '../../types/wallet-hub';

interface MultiWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (provider: SupportedWalletProvider) => void;
}

export const MultiWalletModal: React.FC<MultiWalletModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const providers: { id: SupportedWalletProvider; name: string; tag: string }[] = [
    { id: 'freighter', name: 'Freighter Wallet', tag: 'Browser Extension' },
    { id: 'albedo', name: 'Albedo', tag: 'Web & Mobile' },
    { id: 'xbull', name: 'xBull Wallet', tag: 'Cross-Platform' },
    { id: 'ledger', name: 'Ledger Hardware', tag: 'Hardware Security' },
    { id: 'dev_key', name: 'Dev Account', tag: 'Testing Mode' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="multi-wallet-modal">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Connect Stellar Wallet</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold" aria-label="Close">✕</button>
        </div>
        <div className="space-y-3">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => { onSelect(p.id); onClose(); }}
              data-testid={`wallet-provider-${p.id}`}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all text-left"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{p.tag}</div>
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
