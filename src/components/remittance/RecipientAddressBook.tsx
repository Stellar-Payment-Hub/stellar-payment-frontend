import React from 'react';
import { RemittanceRecipient } from '../../types/remittance';

interface AddressBookProps {
  recipients: RemittanceRecipient[];
  onSelect: (recipient: RemittanceRecipient) => void;
}

export const RecipientAddressBook: React.FC<AddressBookProps> = ({ recipients, onSelect }) => {
  return (
    <div className="space-y-2" data-testid="recipient-address-book">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Saved Beneficiaries</div>
      {recipients.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(r)}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 cursor-pointer transition-colors flex justify-between items-center text-xs"
        >
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{r.name}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{r.destinationAddress}</div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            {r.corridorTag}
          </span>
        </div>
      ))}
    </div>
  );
};
