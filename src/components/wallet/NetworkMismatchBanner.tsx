import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NetworkMismatchBannerProps {
  currentNetwork: string;
  expectedNetwork?: string;
}

export const NetworkMismatchBanner: React.FC<NetworkMismatchBannerProps> = ({
  currentNetwork,
  expectedNetwork = 'testnet',
}) => {
  if (currentNetwork.toLowerCase() === expectedNetwork.toLowerCase()) {
    return null;
  }

  return (
    <div
      data-testid="network-mismatch-banner"
      className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2.5 rounded-lg flex items-center justify-between text-sm mb-4"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Network Warning:</strong> Connected to <strong>{currentNetwork}</strong>, but Stellar Payment Hub runs on <strong>{expectedNetwork}</strong>.
        </span>
      </div>
      <span className="text-xs bg-amber-500/20 px-2 py-0.5 rounded font-mono">
        Switch in Wallet
      </span>
    </div>
  );
};
