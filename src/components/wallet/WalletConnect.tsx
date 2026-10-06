import React from 'react';
import { Wallet, LogOut, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { WalletStatusState } from '../../types/wallet';
import { WalletAddress } from './WalletAddress';

interface WalletConnectProps {
  status: WalletStatusState;
  address: string | null;
  error: string | null;
  isInstalled: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  status,
  address,
  error,
  isInstalled,
  onConnect,
  onDisconnect,
}) => {
  if (status === 'connected' && address) {
    return (
      <div className="wallet-connected-container" data-testid="wallet-connected-container">
        <WalletAddress address={address} />
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onDisconnect}
          data-testid="disconnect-wallet-btn"
        >
          <LogOut size={14} />
          <span>Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect-wrapper">
      {!isInstalled && (
        <div className="extension-banner" data-testid="extension-missing-banner">
          <AlertCircle size={15} />
          <span>Freighter extension not detected.</span>
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-inline"
          >
            Install Freighter <ExternalLink size={12} />
          </a>
        </div>
      )}

      {error && (
        <div className="wallet-error-banner" data-testid="wallet-error-banner">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        onClick={onConnect}
        disabled={status === 'connecting'}
        data-testid="connect-wallet-btn"
      >
        {status === 'connecting' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Connecting Freighter...</span>
          </>
        ) : (
          <>
            <Wallet size={16} />
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    </div>
  );
};
