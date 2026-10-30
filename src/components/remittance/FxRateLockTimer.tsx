import React, { useState, useEffect } from 'react';

export const FxRateLockTimer: React.FC<{ secondsRemaining?: number; onRefresh: () => void }> = ({
  secondsRemaining = 60,
  onRefresh,
}) => {
  const [seconds, setSeconds] = useState(secondsRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          onRefresh();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onRefresh]);

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-slate-400" data-testid="fx-rate-lock-timer">
      <span>Rate guaranteed: <strong className="text-indigo-600 dark:text-indigo-400">{seconds}s</strong></span>
      <button onClick={onRefresh} className="text-indigo-500 font-bold hover:underline">
        Refresh
      </button>
    </div>
  );
};
