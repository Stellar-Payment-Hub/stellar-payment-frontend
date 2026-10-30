import React from 'react';
import { CounterpartyRiskRecord } from '../../types/analytics';

export const CounterpartyRiskTable: React.FC = () => {
  const records: CounterpartyRiskRecord[] = [
    { address: 'GBALICE...777', label: 'Primary Liquidity Provider', totalVolumeUsd: 142000, txCount: 84, riskScore: 'low' },
    { address: 'GBBOB...777', label: 'Escrow Arbitrator Node', totalVolumeUsd: 65000, txCount: 22, riskScore: 'low' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3" data-testid="counterparty-risk-table">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Counterparty Risk Intelligence</h3>
      <div className="space-y-2">
        {records.map((r) => (
          <div key={r.address} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{r.label}</div>
              <div className="text-slate-400 font-mono text-[10px]">{r.address}</div>
            </div>
            <div className="text-right font-mono">
              <div className="font-bold text-slate-900 dark:text-white">${r.totalVolumeUsd.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-500 uppercase font-bold">{r.riskScore} risk</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
