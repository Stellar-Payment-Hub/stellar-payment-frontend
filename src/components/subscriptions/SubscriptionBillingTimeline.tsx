import React from 'react';
import { BillingInvoiceRecord } from '../../types/subscription';

interface TimelineProps {
  invoices: BillingInvoiceRecord[];
  onViewInvoice: (invoice: BillingInvoiceRecord) => void;
}

export const SubscriptionBillingTimeline: React.FC<TimelineProps> = ({ invoices, onViewInvoice }) => {
  return (
    <div className="space-y-2" data-testid="subscription-billing-timeline">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Billing History</div>
      {invoices.map((inv) => (
        <div
          key={inv.id}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center text-xs"
        >
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${inv.status === 'succeeded' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">{inv.amount} {inv.tokenSymbol}</div>
              <div className="text-slate-400">{new Date(inv.timestamp * 1000).toLocaleString()}</div>
            </div>
          </div>
          <button
            onClick={() => onViewInvoice(inv)}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Receipt
          </button>
        </div>
      ))}
    </div>
  );
};
