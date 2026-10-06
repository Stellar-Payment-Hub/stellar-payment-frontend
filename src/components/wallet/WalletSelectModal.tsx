import { X, ExternalLink, ShieldCheck, Wallet } from 'lucide-react';
import { WalletType, WalletOption } from '../../types/wallet';
import { SUPPORTED_WALLETS } from '../../services/wallet';

interface WalletSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (wallet: WalletType) => void;
  isConnecting: boolean;
}

export const WalletSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  isConnecting,
}: WalletSelectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" data-testid="wallet-select-modal">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Wallet size={20} className="text-cyan-400" />
            <h3 className="modal-title">Connect Wallet</h3>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            disabled={isConnecting}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="card-subtitle mb-4">
            Select a Stellar wallet to connect to <strong>Stellar Testnet</strong>:
          </p>

          <div className="wallet-options-list">
            {SUPPORTED_WALLETS.map((wallet: WalletOption) => (
              <div
                key={wallet.id}
                className="wallet-option-item"
                data-testid={`wallet-option-${wallet.id}`}
              >
                <button
                  type="button"
                  className="wallet-option-btn"
                  onClick={() => onSelect(wallet.id)}
                  disabled={isConnecting}
                >
                  <div className="wallet-option-info">
                    <span className="wallet-option-name">{wallet.name}</span>
                    <span className="wallet-option-desc">{wallet.description}</span>
                  </div>
                  <ShieldCheck size={18} className="text-cyan-400" />
                </button>
              </div>
            ))}
          </div>

          <div className="wallet-modal-footer-note mt-4">
            <p className="text-muted text-xs">
              Make sure your selected wallet network is set to <strong>Testnet</strong> before confirming.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-subtle text-xs"
          >
            Don&apos;t have a wallet? Get Freighter <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
