import React from 'react';

interface SlippageProps {
  value: number;
  onChange: (val: number) => void;
}

export const SlippageToleranceSelector: React.FC<SlippageProps> = ({ value, onChange }) => {
  const options = [0.1, 0.5, 1.0];

  return (
    <div className="flex items-center gap-2 text-xs" data-testid="slippage-tolerance-selector">
      <span className="text-slate-400">Slippage Tolerance:</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition-colors ${
              value === opt ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {opt}%
          </button>
        ))}
      </div>
    </div>
  );
};
