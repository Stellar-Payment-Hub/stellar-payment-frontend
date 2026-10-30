import React from 'react';
import { PRESET_DEV_ACCOUNTS, DevAccount } from '../../lib/wallet/dev-wallet';
import { UserCheck, X } from 'lucide-react';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (acc: DevAccount) => void;
  currentAddress: string | null;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  currentAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div data-testid="account-switcher-modal" className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white">Switch Testnet Persona</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {PRESET_DEV_ACCOUNTS.map((acc) => {
            const isCurrent = acc.publicKey === currentAddress;
            return (
              <button
                key={acc.publicKey}
                data-testid={`persona-btn-${acc.name.split(' ')[0].toLowerCase()}`}
                onClick={() => {
                  onSelectAccount(acc);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                  isCurrent ? 'bg-indigo-500/10 border-indigo-500/40 text-white' : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-medium text-sm text-white">{acc.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {acc.publicKey.substring(0, 10)}...{acc.publicKey.substring(acc.publicKey.length - 6)}
                  </div>
                </div>
                {isCurrent && <UserCheck className="w-4 h-4 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
