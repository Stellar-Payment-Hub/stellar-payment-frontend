import React from 'react';
import { RemittanceRecord } from '../../types/remittance';

interface ReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  record: RemittanceRecord | null;
}

export const RemittanceReceiptModal: React.FC<ReceiptProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="remittance-receipt-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Remittance Confirmation</h3>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-400">Beneficiary:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{record.recipientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sent:</span>
            <span className="text-slate-800 dark:text-slate-200">{record.sourceAmount} {record.sourceCurrency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Delivered:</span>
            <span className="font-bold text-emerald-500">{record.destinationAmount} {record.destinationCurrency}</span>
          </div>
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
          Dismiss
        </button>
      </div>
    </div>
  );
};
