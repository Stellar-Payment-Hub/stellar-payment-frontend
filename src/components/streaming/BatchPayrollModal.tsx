import React, { useState } from 'react';

interface BatchPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBatch: (rows: { address: string; amount: number }[]) => void;
}

export const BatchPayrollModal: React.FC<BatchPayrollModalProps> = ({
  isOpen,
  onClose,
  onSubmitBatch,
}) => {
  const [csvText, setCsvText] = useState('GBALICE...777,500\nGBBOB...777,350');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="batch-payroll-modal">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Batch Streaming Payroll</h3>
        <p className="text-xs text-slate-500 mb-4">Paste CSV format (address, monthly_amount) to stream payroll simultaneously:</p>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={5}
          className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs mb-4 outline-none"
        />
        <button
          onClick={() => { onSubmitBatch([{ address: 'G1', amount: 500 }]); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          Deploy Batch Streaming Invocations
        </button>
      </div>
    </div>
  );
};
