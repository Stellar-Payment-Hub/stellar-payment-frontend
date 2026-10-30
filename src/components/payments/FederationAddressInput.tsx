import React, { useState } from 'react';
import { FederationResolver } from '../../lib/wallet/federation-resolver';

interface FederationAddressInputProps {
  value: string;
  onChange: (val: string) => void;
  onResolvedAddress?: (accountId: string, memo?: string) => void;
}

export const FederationAddressInput: React.FC<FederationAddressInputProps> = ({
  value,
  onChange,
  onResolvedAddress,
}) => {
  const [resolved, setResolved] = useState<string | null>(null);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onChange(text);
    if (FederationResolver.isFederationAddress(text)) {
      const res = await FederationResolver.resolve(text);
      if (res) {
        setResolved(res.accountId);
        onResolvedAddress?.(res.accountId, res.memo);
      }
    } else {
      setResolved(null);
    }
  };

  return (
    <div className="space-y-1.5" data-testid="federation-address-input">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Recipient (Stellar Address or user*domain.com)</label>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        placeholder="G... or alice*stellar.org"
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      {resolved && (
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
          <span>✓ Resolved:</span>
          <span className="truncate max-w-xs">{resolved}</span>
        </div>
      )}
    </div>
  );
};
