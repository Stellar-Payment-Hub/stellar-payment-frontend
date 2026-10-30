import React from 'react';

interface VoteProps {
  buyerApproved: boolean;
  sellerApproved: boolean;
  arbitratorApproved: boolean;
}

export const MultiSigVoteIndicator: React.FC<VoteProps> = ({
  buyerApproved,
  sellerApproved,
  arbitratorApproved,
}) => {
  const votes = [
    { label: 'Buyer', approved: buyerApproved },
    { label: 'Seller', approved: sellerApproved },
    { label: 'Arbitrator', approved: arbitratorApproved },
  ];
  const count = votes.filter((v) => v.approved).length;

  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2" data-testid="multi-sig-vote-indicator">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-700 dark:text-slate-300">2-of-3 Multi-Sig Quorum</span>
        <span className={count >= 2 ? 'text-emerald-500' : 'text-amber-500'}>{count}/3 Approvals</span>
      </div>
      <div className="flex gap-2">
        {votes.map((v) => (
          <span
            key={v.label}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold ${
              v.approved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
            }`}
          >
            {v.label}: {v.approved ? 'YES' : 'PENDING'}
          </span>
        ))}
      </div>
    </div>
  );
};
