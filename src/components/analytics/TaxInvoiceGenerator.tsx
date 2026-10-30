import React, { useState } from 'react';

export const TaxInvoiceGenerator: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [clientName, setClientName] = useState('Acme Corp');
  const [amount, setAmount] = useState('1500');

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4" data-testid="tax-invoice-generator">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">Cryptographic Tax Invoice Generator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Invoice #</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Total Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
          />
        </div>
      </div>
      <button
        onClick={() => window.print()}
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
      >
        Export PDF Receipt
      </button>
    </div>
  );
};
