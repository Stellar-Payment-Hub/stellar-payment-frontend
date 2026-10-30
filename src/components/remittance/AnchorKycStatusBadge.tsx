import React from 'react';

export const AnchorKycStatusBadge: React.FC<{ status: 'approved' | 'pending' | 'action_required' }> = ({
  status,
}) => {
  const styles = {
    approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    action_required: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`} data-testid="anchor-kyc-status-badge">
      KYC {status.replace('_', ' ')}
    </span>
  );
};
