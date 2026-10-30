import React from 'react';

interface CorridorSelectProps {
  onSelectCorridor: (from: string, to: string) => void;
}

export const CorridorQuickSelect: React.FC<CorridorSelectProps> = ({ onSelectCorridor }) => {
  const corridors = [
    { label: '🇺🇸 USA → 🇳🇬 Nigeria (USDC/NGN)', from: 'USDC', to: 'NGN' },
    { label: '🇪🇺 Europe → 🇵🇭 Philippines (EURC/PHP)', from: 'EURC', to: 'PHP' },
    { label: '🇺🇸 USA → 🇧🇷 Brazil (USDC/BRL)', from: 'USDC', to: 'BRL' },
  ];

  return (
    <div className="flex flex-wrap gap-2" data-testid="corridor-quick-select">
      {corridors.map((c) => (
        <button
          key={c.label}
          onClick={() => onSelectCorridor(c.from, c.to)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold hover:border-indigo-500 transition-colors"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
};
