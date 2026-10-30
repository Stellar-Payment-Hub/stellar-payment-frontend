import React from 'react';

export const AuditVerificationBadge: React.FC = () => {
  return (
    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs" data-testid="audit-verification-badge">
      <span className="text-emerald-500 font-bold text-base">🛡</span>
      <div>
        <div className="font-bold text-slate-900 dark:text-white">Soroban Escrow Audited</div>
        <div className="text-[10px] text-slate-500 font-mono">Contract verified with 2-of-3 cryptographic multi-sig</div>
      </div>
    </div>
  );
};
