import React from 'react';

interface HardwareNoticeProps {
  visible: boolean;
}

export const HardwareWalletNotice: React.FC<HardwareNoticeProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300" data-testid="hardware-wallet-notice">
      <div className="font-bold flex items-center gap-1.5 mb-1">
        <span>🛡 Hardware Wallet Detected</span>
      </div>
      <div>Ensure Blind Signing is enabled in your Stellar app on Ledger or Trezor before submitting Soroban invocations.</div>
    </div>
  );
};
