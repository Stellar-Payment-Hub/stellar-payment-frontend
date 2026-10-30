import React from 'react';

export const VolumeBarChart: React.FC = () => {
  const bars = [
    { label: 'Mon', height: '60%', value: '$14k' },
    { label: 'Tue', height: '80%', value: '$22k' },
    { label: 'Wed', height: '45%', value: '$10k' },
    { label: 'Thu', height: '95%', value: '$31k' },
    { label: 'Fri', height: '70%', value: '$19k' },
    { label: 'Sat', height: '30%', value: '$8k' },
    { label: 'Sun', height: '40%', value: '$11k' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4" data-testid="volume-bar-chart">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Settlement Volume</h3>
        <span className="text-xs text-slate-400">Past 7 Days</span>
      </div>
      <div className="h-40 flex items-end justify-between gap-3 pt-6">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">{b.value}</span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden h-28 flex items-end">
              <div
                className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all rounded-t-lg"
                style={{ height: b.height }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
