import React, { useState, useEffect } from 'react';
import { OfflineTxCache } from '../../lib/offline/offline-cache';

export const OfflineStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queue = OfflineTxCache.getQueue();

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

  if (isOnline && queue.length === 0) return null;

  return (
    <div className="p-3 rounded-xl bg-amber-500 text-white text-xs flex justify-between items-center" data-testid="offline-status-banner">
      <div className="font-semibold">
        {!isOnline ? 'Network Disconnected - Working in Offline Mode' : `${queue.length} Queued Transactions Ready to Sync`}
      </div>
      {queue.length > 0 && isOnline && (
        <button
          onClick={() => { OfflineTxCache.clearQueue(); window.location.reload(); }}
          className="px-3 py-1 rounded-lg bg-black/20 hover:bg-black/30 font-bold"
        >
          Sync Now
        </button>
      )}
    </div>
  );
};
