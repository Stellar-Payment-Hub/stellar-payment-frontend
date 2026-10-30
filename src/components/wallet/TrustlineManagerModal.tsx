import React from 'react';
import { TrustlineBalance } from '../../lib/stellar/trustlines';

interface TrustlineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trustlines: TrustlineBalance[];
  onAddTrustline: (assetCode: string, issuer: string) => void;
}

export const TrustlineManagerModal: React.FC<TrustlineManagerModalProps> = ({
  isOpen,
  onClose,
  trustlines,
  onAddTrustline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="trustline-modal">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Trustlines</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold" aria-label="Close">✕</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto mb-4">
          {trustlines.map((t, idx) => (
            <div key={idx} className="py-2.5 flex justify-between items-center" data-testid={`trustline-row-${t.assetCode}`}>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{t.assetCode}</div>
                {t.issuer && <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">{t.issuer}</div>}
              </div>
              <div className="text-right font-mono font-medium text-slate-900 dark:text-white">{t.balance}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onAddTrustline('USDC', 'GBBD47IF6LWK7P7MDEVTESTUSDCISSUER77777777777777777777777777')}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          + Add USDC Trustline
        </button>
      </div>
    </div>
  );
};
