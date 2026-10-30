import React from 'react';

interface AnchorInfo {
  name: string;
  domain: string;
  corridors: string[];
  latencyMs: number;
  uptimePct: number;
}

export const AnchorDirectory: React.FC = () => {
  const anchors: AnchorInfo[] = [
    { name: 'Cowrie Integrated', domain: 'cowrie.exchange', corridors: ['NGN', 'EURC'], latencyMs: 64, uptimePct: 99.98 },
    { name: 'ClickPesa', domain: 'clickpesa.com', corridors: ['TZS', 'KES'], latencyMs: 82, uptimePct: 99.95 },
    { name: 'Anclap', domain: 'anclap.com', corridors: ['ARS', 'BRL'], latencyMs: 71, uptimePct: 99.90 },
  ];

  return (
    <div className="space-y-3" data-testid="anchor-directory">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verified SEP Anchors</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {anchors.map((a) => (
          <div key={a.name} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">{a.name}</span>
              <span className="text-emerald-500 font-bold font-mono">{a.uptimePct}%</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">{a.domain}</div>
            <div className="flex gap-1">
              {a.corridors.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
