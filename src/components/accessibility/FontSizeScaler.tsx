import React, { useState } from 'react';

export const FontSizeScaler: React.FC = () => {
  const [scale, setScale] = useState<'normal' | 'large' | 'xl'>('normal');

  return (
    <div className="flex items-center gap-1 text-xs" data-testid="font-size-scaler">
      <span className="text-slate-400">Text Size:</span>
      {(['normal', 'large', 'xl'] as const).map((s) => (
        <button
          key={s}
          onClick={() => setScale(s)}
          className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold ${
            scale === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
};
