import React from 'react';

interface EvidenceProps {
  evidenceHashes: { cid: string; uploader: string; timestamp: number }[];
}

export const EvidenceLocker: React.FC<EvidenceProps> = ({ evidenceHashes }) => {
  return (
    <div className="space-y-2" data-testid="evidence-locker">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Evidence Vault</div>
      {evidenceHashes.map((ev, i) => (
        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-mono">
          <div className="truncate max-w-[200px] text-indigo-600 dark:text-indigo-400">{ev.cid}</div>
          <div className="text-slate-400">{new Date(ev.timestamp * 1000).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
};
