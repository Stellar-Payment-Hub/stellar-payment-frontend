import React from 'react';
import { LiveStreamEntity } from '../../types/stream';
import { useLiveStreamAccrual } from '../../hooks/useLiveStreamAccrual';

interface StreamProgressBarProps {
  stream: LiveStreamEntity;
}

export const StreamProgressBar: React.FC<StreamProgressBarProps> = ({ stream }) => {
  const { percentage } = useLiveStreamAccrual(stream);

  return (
    <div className="space-y-1.5" data-testid="stream-progress-bar">
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Progress</span>
        <span className="font-mono font-bold text-slate-900 dark:text-white">{percentage.toFixed(2)}%</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
