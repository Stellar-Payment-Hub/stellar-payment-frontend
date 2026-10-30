import React, { useState } from 'react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  onRaiseDispute: (escrowId: string, category: string, rationale: string) => void;
}

export const RaiseDisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  escrowId,
  onRaiseDispute,
}) => {
  const [category, setCategory] = useState('non_delivery');
  const [rationale, setRationale] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="raise-dispute-modal">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-rose-600">Raise Arbitration Dispute</h3>
        <p className="text-xs text-slate-500">Escrow funds will be locked until the designated arbitrator resolves the claim.</p>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dispute Reason</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
          >
            <option value="non_delivery">Non-Delivery of Work</option>
            <option value="defective">Defective / Non-Compliant Deliverable</option>
            <option value="unresponsive">Unresponsive Counterparty</option>
            <option value="terms_violation">Breach of Agreed Specifications</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Explanation & Claim Details</label>
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            rows={4}
            required
            placeholder="Explain why arbitration is requested..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
          />
        </div>
        <button
          onClick={() => { onRaiseDispute(escrowId, category, rationale); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
        >
          Submit Dispute to Arbitrator
        </button>
      </div>
    </div>
  );
};
