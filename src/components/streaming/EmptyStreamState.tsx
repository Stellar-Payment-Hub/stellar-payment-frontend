import React from 'react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyStreamState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800" data-testid="empty-stream-state">
      <div className="text-3xl mb-3">🌊</div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Active Payment Streams</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">Create a continuous token stream to pay salaries, subscriptions, or consulting fees by the second.</p>
      <button
        onClick={onCreateClick}
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
      >
        Create First Stream
      </button>
    </div>
  );
};
