import React, { useState } from 'react';

export const SubscriptionNotificationSettings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [retryAlerts, setRetryAlerts] = useState(true);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4" data-testid="subscription-notification-settings">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notification Preferences</h4>
      <div className="space-y-3">
        <label className="flex items-center justify-between text-xs cursor-pointer">
          <span className="text-slate-700 dark:text-slate-300">Email billing statements on charge</span>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
        </label>
        <label className="flex items-center justify-between text-xs cursor-pointer">
          <span className="text-slate-700 dark:text-slate-300">Alert on failed recurring charge</span>
          <input
            type="checkbox"
            checked={retryAlerts}
            onChange={(e) => setRetryAlerts(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
        </label>
      </div>
    </div>
  );
};
