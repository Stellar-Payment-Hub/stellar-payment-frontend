import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface CurrencyConverterWidgetProps {
  amount: number | string;
  asset: string;
}

export const CurrencyConverterWidget: React.FC<CurrencyConverterWidgetProps> = ({
  amount,
  asset,
}) => {
  const parsed = parseFloat(amount.toString()) || 0;
  // Testnet conversion rates
  const rates: Record<string, number> = {
    XLM: 0.125,
    USDC: 1.0,
    EURC: 1.08,
  };

  const rate = rates[asset.toUpperCase()] || 1.0;
  const inUsd = (parsed * rate).toFixed(2);
  const inEur = (parsed * (rate / 1.08)).toFixed(2);

  return (
    <div
      data-testid="currency-converter-widget"
      className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-400 mt-2"
    >
      <div className="flex items-center gap-1.5">
        <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
        <span>Est. Value:</span>
      </div>
      <div className="flex items-center gap-3 font-mono font-medium text-slate-200">
        <span>${inUsd} USD</span>
        <span className="text-slate-600">|</span>
        <span>€{inEur} EUR</span>
      </div>
    </div>
  );
};
