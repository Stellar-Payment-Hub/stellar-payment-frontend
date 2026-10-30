import React, { useState, useEffect } from 'react';

export const EscrowCountdownTimer: React.FC<{ deadlineTimestamp: number }> = ({ deadlineTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = deadlineTimestamp - now;
      if (diff <= 0) {
        setTimeLeft('Expired (Auto-Release Eligible)');
        return;
      }
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m remaining`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [deadlineTimestamp]);

  return (
    <div className="font-mono text-xs text-amber-500 font-semibold" data-testid="escrow-countdown-timer">
      ⏱ {timeLeft}
    </div>
  );
};
