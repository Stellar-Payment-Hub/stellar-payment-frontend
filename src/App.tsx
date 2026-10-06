import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useBalance } from './hooks/useBalance';
import { usePayment } from './hooks/usePayment';
import { WalletConnect } from './components/wallet/WalletConnect';
import { WalletStatus } from './components/wallet/WalletStatus';
import { BalanceCard } from './components/balance/BalanceCard';
import { SendPaymentForm } from './components/payments/SendPaymentForm';
import { PaymentReview } from './components/payments/PaymentReview';
import { TransactionStatus } from './components/payments/TransactionStatus';
import { PaymentFormData } from './types/payment';
import { Zap, Shield, ArrowUpRight, Code2 } from 'lucide-react';

export function App() {
  const {
    status: walletStatus,
    address,
    error: walletError,
    network,
    isInstalled,
    connect,
    disconnect,
  } = useWallet();

  const balanceState = useBalance(address);

  const {
    status: txStatus,
    lastResult,
    sendPayment,
    resetPayment,
  } = usePayment(() => {
    // Refresh balance after successful transaction
    balanceState.refetch();
  });

  const [reviewData, setReviewData] = useState<PaymentFormData | null>(null);

  const handleStartReview = (data: PaymentFormData) => {
    setReviewData(data);
  };

  const handleConfirmPayment = async () => {
    if (!reviewData || !address) return;
    await sendPayment(reviewData, address);
    setReviewData(null);
  };

  const handleCancelReview = () => {
    setReviewData(null);
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo-wrap">
            <Zap size={22} className="text-cyan-400" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 className="brand-title">Stellar Payment Hub</h1>
              <span className="brand-badge">Level 1</span>
            </div>
            <p className="card-subtitle">Non-custodial Testnet Settlement Platform</p>
          </div>
        </div>

        <div className="header-actions">
          <WalletStatus status={walletStatus} network={network} />
          <WalletConnect
            status={walletStatus}
            address={address}
            error={walletError}
            isInstalled={isInstalled}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="dashboard-grid">
        {/* Left Column: Balance & Account Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <BalanceCard
            {...balanceState}
            onRefresh={balanceState.refetch}
            onFund={balanceState.fundWithFriendbot}
            address={address}
          />

          {/* Wallet Guidelines Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="icon-badge icon-badge-indigo">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="card-title">Stellar Testnet Guide</h3>
                  <p className="card-subtitle">Freighter wallet best practices</p>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '0.75rem' }}>
                Level 1 executes <strong>real peer-to-peer payments</strong> directly on the{' '}
                <span className="text-light">Stellar Testnet</span> using Freighter.
              </p>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Ensure your Freighter wallet network is set to <strong>TESTNET</strong>.</li>
                <li>New accounts require an initial 10,000 XLM grant from Friendbot.</li>
                <li>Every account reserves 1.0 XLM to remain active on the ledger.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Send Payment & Transaction Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <SendPaymentForm
            senderAddress={address}
            spendableBalance={balanceState.spendableBalance}
            onReview={handleStartReview}
            disabled={walletStatus !== 'connected'}
          />

          <TransactionStatus
            status={txStatus}
            result={lastResult}
            onReset={resetPayment}
          />
        </div>
      </main>

      {/* Review Payment Modal */}
      {reviewData && address && (
        <PaymentReview
          formData={reviewData}
          senderAddress={address}
          status={txStatus}
          onConfirm={handleConfirmPayment}
          onCancel={handleCancelReview}
        />
      )}

      {/* App Footer */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 0.5rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <span>Stellar Payment Hub &copy; {new Date().getFullYear()} &bull; Level 1 White Belt Foundation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://developers.stellar.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-subtle"
          >
            Stellar Docs <ArrowUpRight size={13} />
          </a>
          <a
            href="https://github.com/Stellar-Payment-Hub"
            target="_blank"
            rel="noopener noreferrer"
            className="link-subtle"
          >
            GitHub Org <Code2 size={13} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
