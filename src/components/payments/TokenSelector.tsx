import React from 'react';

export interface TokenOption {
  code: string;
  name: string;
  contractId?: string;
}

export const TOKENS: TokenOption[] = [
  { code: 'XLM', name: 'Native Lumens (XLM)' },
  { code: 'USDC', name: 'USD Coin (Soroban SAC)', contractId: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWUOT3ARSTAWZX6W2Y7' },
  { code: 'EURC', name: 'Euro Coin (Soroban SAC)', contractId: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUW27CW4FUSODWOC2PAA3N5' },
];

interface TokenSelectorProps {
  selectedToken: string;
  onSelectToken: (code: string) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelectToken,
}) => {
  return (
    <div className="flex flex-col gap-1.5 my-2">
      <label className="text-xs font-medium text-slate-300">Settlement Asset</label>
      <select
        data-testid="token-selector"
        value={selectedToken}
        onChange={(e) => onSelectToken(e.target.value)}
        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        {TOKENS.map((t) => (
          <option key={t.code} value={t.code}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
};
