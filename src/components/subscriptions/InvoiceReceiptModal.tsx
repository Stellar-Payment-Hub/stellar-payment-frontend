import React from 'react';
import { BillingInvoiceRecord } from '../../types/subscription';

interface ReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: BillingInvoiceRecord | null;
}

export const InvoiceReceiptModal: React.FC<ReceiptProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="invoice-receipt-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Cryptographic Receipt</h3>
          <button onClick={onClose} className="text-slate-400 font-bold" aria-label="Close">✕</button>
        </div>
        <div className="space-y-3 font-mono text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-5">
          <div className="flex justify-between">
            <span className="text-slate-400">Invoice ID</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Settled Amount</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{invoice.amount} {invoice.tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Ledger Hash</span>
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{invoice.transactionHash}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Date</span>
            <span className="text-slate-800 dark:text-slate-200">{new Date(invoice.timestamp * 1000).toLocaleDateString()}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
