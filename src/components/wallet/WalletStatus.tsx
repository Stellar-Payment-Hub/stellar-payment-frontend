import { WalletStatusState } from '../../types/wallet';

interface WalletStatusProps {
  status: WalletStatusState;
  network?: string;
  activeWallet?: string | null;
}

export const WalletStatus = ({
  status,
  network = 'testnet',
  activeWallet,
}: WalletStatusProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="badge badge-success" data-testid="status-connected">
            <span className="dot dot-success"></span>
            {activeWallet ? `${activeWallet.toUpperCase()}` : 'Connected'}
          </span>
        );
      case 'connecting':
        return (
          <span className="badge badge-warning" data-testid="status-connecting">
            <span className="dot dot-warning pulse"></span>
            Connecting...
          </span>
        );
      case 'not_found':
        return (
          <span className="badge badge-danger" data-testid="status-not-found">
            <span className="dot dot-danger"></span>
            Wallet Not Found
          </span>
        );
      case 'rejected':
        return (
          <span className="badge badge-warning" data-testid="status-rejected">
            <span className="dot dot-warning"></span>
            Rejected
          </span>
        );
      case 'network_mismatch':
        return (
          <span className="badge badge-danger" data-testid="status-mismatch">
            <span className="dot dot-danger"></span>
            Network Mismatch
          </span>
        );
      case 'error':
        return (
          <span className="badge badge-danger" data-testid="status-error">
            <span className="dot dot-danger"></span>
            Error
          </span>
        );
      case 'disconnected':
      default:
        return (
          <span className="badge badge-muted" data-testid="status-disconnected">
            <span className="dot dot-muted"></span>
            Disconnected
          </span>
        );
    }
  };

  return (
    <div className="wallet-status-bar">
      <div className="network-pill" data-testid="network-indicator">
        <span className="dot dot-network"></span>
        <span className="network-label">Stellar {network.toUpperCase()}</span>
      </div>
      {getStatusBadge()}
    </div>
  );
};
