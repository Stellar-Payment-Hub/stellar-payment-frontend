import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { STELLAR_CONFIG } from '../../config/env';

interface WalletAddressProps {
  address: string;
  truncateLength?: number;
  showExplorerLink?: boolean;
}

export const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  truncateLength = 4,
  showExplorerLink = true,
}) => {
  const [copied, setCopied] = useState(false);

  const truncated =
    address.length > truncateLength * 2 + 3
      ? `${address.slice(0, truncateLength + 4)}...${address.slice(-truncateLength)}`
      : address;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const explorerUrl = `${STELLAR_CONFIG.explorerUrl}/account/${address}`;

  return (
    <div className="wallet-address-chip" data-testid="wallet-address-chip">
      <span className="address-text" title={address} data-testid="wallet-address-text">
        {truncated}
      </span>

      <button
        type="button"
        className="icon-btn"
        onClick={handleCopy}
        title={copied ? 'Copied to clipboard!' : 'Copy full address'}
        aria-label="Copy wallet address"
        data-testid="copy-address-btn"
      >
        {copied ? (
          <Check size={14} className="icon-success text-emerald-400" />
        ) : (
          <Copy size={14} />
        )}
      </button>

      {showExplorerLink && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          title="View account on Stellar Explorer"
          aria-label="View account on Stellar Explorer"
          data-testid="explorer-account-link"
        >
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
};
