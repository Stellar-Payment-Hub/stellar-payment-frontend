import React, { useState } from 'react';

export const MerchantWebhookConfig: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://api.merchant.com/webhooks/stellar');
  const [copied, setCopied] = useState(false);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3" data-testid="merchant-webhook-config">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Developer Webhook Endpoint</h4>
      <p className="text-xs text-slate-500">Receive real-time Soroban subscription contract events (SubscriptionBilled, Terminated).</p>
      <div className="flex gap-2">
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none"
        />
        <button
          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
        >
          {copied ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
};
