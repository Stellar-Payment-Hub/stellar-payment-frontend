import React, { useState } from 'react';
import { CurrencyCode } from '../../types/remittance';
import { FxRateEngine } from '../../lib/remittance/fx-rates';

export const CurrencyConverter: React.FC = () => {
  const [sourceAmount, setSourceAmount] = useState('100');
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode>('USDC');
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>('NGN');

  const parsedAmount = parseFloat(sourceAmount) || 0;
  const rate = FxRateEngine.getRate(sourceCurrency, targetCurrency);
  const destAmount = FxRateEngine.calculateDestinationAmount(parsedAmount, rate);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4" data-testid="currency-converter">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Live FX Converter</h3>
        <span className="text-xs font-mono text-emerald-500 font-semibold">1 {sourceCurrency} = {rate.toFixed(2)} {targetCurrency}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">You Send</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={sourceAmount}
              onChange={(e) => setSourceAmount(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm outline-none"
            />
            <select
              value={sourceCurrency}
              onChange={(e) => setSourceCurrency(e.target.value as CurrencyCode)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
            >
              <option value="USDC">USDC</option>
              <option value="XLM">XLM</option>
              <option value="EURC">EURC</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Recipient Receives</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={destAmount.toFixed(2)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm font-bold"
            />
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
            >
              <option value="NGN">NGN</option>
              <option value="BRL">BRL</option>
              <option value="PHP">PHP</option>
              <option value="EURC">EURC</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
