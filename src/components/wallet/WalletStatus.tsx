import React from 'react';
import { WalletStatusState } from '../../types/wallet';

interface WalletStatusProps {
  status: WalletStatusState;
  network?: string;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({
  status,
  network = 'testnet',
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="badge badge-success" data-testid="status-connected">
            <span className="dot dot-success"></span>
            Connected
          </span>
        );
      case 'connecting':
        return (
          <span className="badge badge-warning" data-testid="status-connecting">
            <span className="dot dot-warning pulse"></span>
            Connecting...
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
