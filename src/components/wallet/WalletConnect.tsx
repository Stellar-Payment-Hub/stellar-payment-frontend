import { Wallet, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { WalletStatusState } from '../../types/wallet';
import { WalletAddress } from './WalletAddress';

interface WalletConnectProps {
  status: WalletStatusState;
  address: string | null;
  error: string | null;
  onOpenSelect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect = ({
  status,
  address,
  error,
  onOpenSelect,
  onDisconnect,
}: WalletConnectProps) => {
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
      {error && (
        <div className="wallet-error-banner" data-testid="wallet-error-banner">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        onClick={onOpenSelect}
        disabled={status === 'connecting'}
        data-testid="connect-wallet-btn"
      >
        {status === 'connecting' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Connecting...</span>
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
