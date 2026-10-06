import { useState } from 'react';
import { WalletType, WalletStatusState } from '../../types/wallet';
import { STELLAR_CONFIG } from '../../config/env';
import { Wallet, Copy, Check, ExternalLink, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';

interface WalletDetailViewProps {
  status: WalletStatusState;
  address: string | null;
  activeWallet: WalletType | null;
  network: string;
  balance: string;
  onOpenSelectModal: () => void;
  onDisconnect: () => void;
  onRefreshBalance: () => void;
  onFundWithFriendbot: () => void;
  isFunding: boolean;
}

export function WalletDetailView({
  status,
  address,
  activeWallet,
  network,
  balance,
  onOpenSelectModal,
  onDisconnect,
  onRefreshBalance,
  onFundWithFriendbot,
  isFunding,
}: WalletDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const walletDisplayName = activeWallet
    ? activeWallet.charAt(0).toUpperCase() + activeWallet.slice(1)
    : 'None';

  return (
    <div className="card" data-testid="wallet-detail-view">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-cyan">
            <Wallet size={18} />
          </div>
          <div>
            <h3 className="card-title">Wallet & Account Hub</h3>
            <p className="card-subtitle">Multi-Wallet Adapter Configuration</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenSelectModal}
          >
            Switch Wallet
          </button>
          {status === 'connected' && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {/* Card 1: Connection & Provider */}
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Provider
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Cpu size={18} className="text-cyan-400" />
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>{walletDisplayName}</h4>
            <span className={`status-badge status-${status === 'connected' ? 'completed' : 'pending'}`} style={{ fontSize: '0.7rem' }}>
              {status}
            </span>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div>Network: <strong style={{ color: 'var(--text-primary)' }}>{network}</strong></div>
            <div>RPC Host: <span className="mono-text" style={{ fontSize: '0.75rem' }}>soroban-testnet.stellar.org</span></div>
          </div>
        </div>

        {/* Card 2: Account Balance & Funding */}
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Account Balance
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {address ? `${balance} XLM` : '—'}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onRefreshBalance}
              disabled={!address}
            >
              <RefreshCw size={12} style={{ marginRight: '0.3rem' }} /> Refresh
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onFundWithFriendbot}
              disabled={isFunding || !address}
            >
              {isFunding ? 'Funding...' : 'Friendbot +10k'}
            </button>
          </div>
        </div>
      </div>

      {/* Account Address Card */}
      {address && (
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stellar Public Key
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                {copied ? <Check size={12} className="text-cyan-400" /> : <Copy size={12} />}
                <span style={{ marginLeft: '0.25rem' }}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={`${STELLAR_CONFIG.explorerAccountUrl}/${address}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                Explorer <ExternalLink size={12} style={{ marginLeft: '0.25rem' }} />
              </a>
            </div>
          </div>
          <p className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', wordBreak: 'break-all', margin: 0 }}>
            {address}
          </p>
        </div>
      )}

      {/* Wallet Guidelines & Error Support */}
      <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
          <ShieldAlert size={14} className="text-cyan-400" /> Supported Multi-Wallet Architecture
        </div>
        <p style={{ margin: 0 }}>
          Stellar Payment Hub features a pluggable <strong>WalletProvider</strong> abstraction. All transactions and Soroban contract calls are signed client-side without private keys ever leaving your browser extension or hardware device.
        </p>
      </div>
    </div>
  );
}
