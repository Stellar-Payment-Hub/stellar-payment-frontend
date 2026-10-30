import React, { useState } from 'react';
import { MilestoneItem } from '../../types/escrow';

interface DeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneItem | null;
  onSubmitEvidence: (milestoneId: string, ipfsHash: string, notes: string) => void;
}

export const DeliverableSubmissionModal: React.FC<DeliverableModalProps> = ({
  isOpen,
  onClose,
  milestone,
  onSubmitEvidence,
}) => {
  const [ipfsCid, setIpfsCid] = useState('QmZtmD2qt8fQgdfDg9816d84928192837482');
  const [notes, setNotes] = useState('');

  if (!isOpen || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="deliverable-submission-modal">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Milestone Deliverable</h3>
        <p className="text-xs text-slate-500">Attach cryptographic deliverable proofs for: <strong>{milestone.title}</strong></p>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">IPFS CID / SHA-256 Digest</label>
          <input
            type="text"
            value={ipfsCid}
            onChange={(e) => setIpfsCid(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Delivery Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Describe completed work and verification instructions..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
          />
        </div>
        <button
          onClick={() => { onSubmitEvidence(milestone.id, ipfsCid, notes); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
        >
          Submit to Escrow Ledger
        </button>
      </div>
    </div>
  );
};
