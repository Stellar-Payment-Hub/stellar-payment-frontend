import React, { useState } from 'react';

export const SystemDiagnosticReport: React.FC = () => {
  const [reportCopied, setReportCopied] = useState(false);

  const report = JSON.stringify(
    {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'mock',
      sorobanRpc: 'https://soroban-testnet.stellar.org',
      protocolVersion: 22,
      online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3" data-testid="system-diagnostic-report">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">System Diagnostics & Environment</h3>
      <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto">
        {report}
      </pre>
      <button
        onClick={() => { setReportCopied(true); setTimeout(() => setReportCopied(false), 2000); }}
        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
      >
        {reportCopied ? 'Copied Diagnostic Report' : 'Copy Report for Support'}
      </button>
    </div>
  );
};
