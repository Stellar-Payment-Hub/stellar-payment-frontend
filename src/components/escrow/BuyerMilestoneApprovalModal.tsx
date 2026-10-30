import React from 'react';
import { MilestoneItem } from '../../types/escrow';

interface ApprovalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneItem | null;
  onConfirmRelease: (milestoneId: string) => void;
}

export const BuyerMilestoneApprovalModal: React.FC<ApprovalProps> = ({
  isOpen,
  onClose,
  milestone,
  onConfirmRelease,
}) => {
  if (!isOpen || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="buyer-milestone-approval-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Approve Milestone Release</h3>
        <p className="text-xs text-slate-500 mb-4">
          Authorizing this release will immediately transfer <strong className="text-emerald-500">${milestone.amount.toFixed(2)}</strong> to the seller.
        </p>
        <button
          onClick={() => { onConfirmRelease(milestone.id); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
        >
          Sign & Release Funds
        </button>
      </div>
    </div>
  );
};
