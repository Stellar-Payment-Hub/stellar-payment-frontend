import React from 'react';

interface FilterTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const StreamFilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onSelectTab }) => {
  const tabs = ['all', 'active', 'paused', 'completed', 'cancelled'];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2" data-testid="stream-filter-tabs">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onSelectTab(t)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
            activeTab === t ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};
