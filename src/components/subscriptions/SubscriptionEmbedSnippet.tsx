import React, { useState } from 'react';

interface EmbedProps {
  planId: string;
}

export const SubscriptionEmbedSnippet: React.FC<EmbedProps> = ({ planId }) => {
  const [copied, setCopied] = useState(false);
  const snippet = `<iframe src="https://hub.stellar.org/subscribe/${planId}" width="380" height="420" frameborder="0"></iframe>`;

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800" data-testid="subscription-embed-snippet">
      <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">Embed Code Snippet</div>
      <pre className="p-2.5 rounded-lg bg-white dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto mb-3">
        {snippet}
      </pre>
      <button
        onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
      >
        {copied ? 'Copied to Clipboard' : 'Copy HTML Iframe'}
      </button>
    </div>
  );
};
