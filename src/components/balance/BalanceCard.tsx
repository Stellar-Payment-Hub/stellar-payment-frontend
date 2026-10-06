import React from 'react';
import { RefreshCw, Coins, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { AccountBalanceState } from '../../hooks/useBalance';

interface BalanceCardProps extends AccountBalanceState {
  onRefresh: () => void;
  onFund?: () => Promise<boolean>;
  address: string | null;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  spendableBalance,
  isLoading,
  isUnfunded,
  error,
  lastUpdated,
  onRefresh,
  onFund,
  address,
}) => {
  return (
    <div className="card balance-card" data-testid="balance-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-cyan">
            <Coins size={18} />
          </div>
          <div>
            <h3 className="card-title">Available Balance</h3>
            <p className="card-subtitle">Stellar Native Lumens (XLM)</p>
          </div>
        </div>

        <button
          type="button"
          className={`icon-btn ${isLoading ? 'spinning' : ''}`}
          onClick={onRefresh}
          disabled={isLoading || !address}
          title="Refresh XLM balance"
          aria-label="Refresh XLM balance"
          data-testid="refresh-balance-btn"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="balance-content">
        {isLoading && !balance ? (
          <div className="balance-loading" data-testid="balance-loading">
            <div className="skeleton skeleton-title"></div>
            <span className="text-muted text-sm">Loading balance from Testnet...</span>
          </div>
        ) : error ? (
          <div className="balance-error" data-testid="balance-error">
            <AlertCircle size={16} className="text-danger" />
            <div className="error-details">
              <span className="text-danger text-sm font-medium">{error}</span>
              <button
                type="button"
                className="btn btn-secondary btn-xs mt-2"
                onClick={onRefresh}
              >
                Retry
              </button>
            </div>
          </div>
        ) : isUnfunded ? (
          <div className="balance-unfunded" data-testid="balance-unfunded">
            <div className="balance-amount-row">
              <span className="balance-value text-muted">0.0000000</span>
              <span className="balance-currency">XLM</span>
            </div>
            <div className="unfunded-notice">
              <Sparkles size={14} className="text-amber-400" />
              <span>This account is not yet funded on Stellar Testnet.</span>
            </div>
            {onFund && (
              <button
                type="button"
                className="btn btn-accent btn-sm mt-3"
                onClick={onFund}
                disabled={isLoading}
                data-testid="fund-friendbot-btn"
              >
                {isLoading ? 'Requesting Testnet XLM...' : 'Fund with Friendbot (+10,000 XLM)'}
              </button>
            )}
          </div>
        ) : (
          <div className="balance-display" data-testid="balance-display">
            <div className="balance-amount-row">
              <span className="balance-value" data-testid="xlm-balance-value">
                {balance ? parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 7 }) : '0.0000'}
              </span>
              <span className="balance-currency">XLM</span>
            </div>

            {spendableBalance && (
              <div className="balance-meta">
                <span className="text-muted text-xs">
                  Spendable (after 1.0 XLM reserve):{' '}
                  <strong className="text-light">{parseFloat(spendableBalance).toFixed(4)} XLM</strong>
                </span>
                {lastUpdated && (
                  <span className="text-muted text-xs">
                    Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-footer">
        <a
          href="https://laboratory.stellar.org/#account-creator?network=testnet"
          target="_blank"
          rel="noopener noreferrer"
          className="link-subtle text-xs"
        >
          Need more Testnet XLM? Stellar Lab Faucet <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
};
