import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      data-testid="offline-banner"
      className="bg-rose-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>Internet Connection Lost. Soroban transactions cannot be submitted.</span>
    </div>
  );
};
