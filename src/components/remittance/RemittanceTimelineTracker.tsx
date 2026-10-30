import React from 'react';

export const RemittanceTimelineTracker: React.FC<{ status: 'initiated' | 'converted' | 'delivered' }> = ({
  status,
}) => {
  const steps = [
    { key: 'initiated', label: 'Payment Sent' },
    { key: 'converted', label: 'DEX Swapped' },
    { key: 'delivered', label: 'Bank Delivered' },
  ];
  const activeIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center" data-testid="remittance-timeline-tracker">
      {steps.map((s, idx) => (
        <div key={s.key} className="flex items-center gap-2 text-xs">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
            idx <= activeIdx ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'
          }`}>
            {idx < activeIdx ? '✓' : idx + 1}
          </span>
          <span className={idx <= activeIdx ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400'}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
};
