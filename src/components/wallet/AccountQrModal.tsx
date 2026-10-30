import React, { useState } from 'react';

interface AccountQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export const AccountQrModal: React.FC<AccountQrModalProps> = ({ isOpen, onClose, address }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="account-qr-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account QR Code</h3>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl inline-block mb-4 border border-slate-200 dark:border-slate-700">
          <div className="w-44 h-44 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-mono text-slate-500">
            [QR: {address.slice(0, 6)}...{address.slice(-4)}]
          </div>
        </div>
        <div className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all mb-4 px-2">{address}</div>
        <button
          onClick={handleCopy}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          {copied ? '✓ Copied Address' : 'Copy Address'}
        </button>
      </div>
    </div>
  );
};
