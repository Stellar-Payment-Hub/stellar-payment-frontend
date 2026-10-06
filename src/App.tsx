import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useBalance } from './hooks/useBalance';
import { usePayment } from './hooks/usePayment';
import { WalletConnect } from './components/wallet/WalletConnect';
import { WalletStatus } from './components/wallet/WalletStatus';
import { WalletSelectModal } from './components/wallet/WalletSelectModal';
import { BalanceCard } from './components/balance/BalanceCard';
import { SendPaymentForm } from './components/payments/SendPaymentForm';
import { CreateTrackedPaymentForm } from './components/payments/CreateTrackedPaymentForm';
import { PaymentReview } from './components/payments/PaymentReview';
import { TransactionStatus } from './components/payments/TransactionStatus';
import { PaymentTracker } from './components/tracker/PaymentTracker';
import { PaymentFormData } from './types/payment';
import { Zap, Shield, ArrowUpRight, Code2, Send, Sparkles, Layers } from 'lucide-react';

type TabView = 'dashboard' | 'tracker' | 'contract_payment';

export function App() {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');

  const {
    status: walletStatus,
    address,
    activeWallet,
    error: walletError,
    network,
    isSelectModalOpen,
    openSelectModal,
    closeSelectModal,
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
              <span className="brand-badge">Level 2: Yellow Belt</span>
            </div>
            <p className="card-subtitle">Multi-Wallet Programmable Settlement Platform</p>
          </div>
        </div>

        <div className="header-actions">
          <WalletStatus
            status={walletStatus}
            network={network}
            activeWallet={activeWallet}
          />
          <WalletConnect
            status={walletStatus}
            address={address}
            error={walletError}
            onOpenSelect={openSelectModal}
            onDisconnect={disconnect}
          />
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="filter-tabs-scroll" style={{ padding: '0 0.25rem' }}>
        <button
          type="button"
          className={`filter-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          data-testid="tab-dashboard"
        >
          <Send size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          Dashboard
        </button>

        <button
          type="button"
          className={`filter-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
          data-testid="tab-tracker"
        >
          <Layers size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          Payment Tracker
        </button>

        <button
          type="button"
          className={`filter-tab-btn ${activeTab === 'contract_payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('contract_payment')}
          data-testid="tab-contract-payment"
        >
          <Sparkles size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          New Tracked Payment (Soroban)
        </button>
      </nav>

      {/* View 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <main className="dashboard-grid">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BalanceCard
              {...balanceState}
              onRefresh={balanceState.refetch}
              onFund={balanceState.fundWithFriendbot}
              address={address}
            />

            {/* Quick Action Navigation */}
            <div className="card">
              <div className="card-header">
                <div className="card-title-group">
                  <div className="icon-badge icon-badge-cyan">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="card-title">Programmable Payments</h3>
                    <p className="card-subtitle">Soroban Smart Contract Features</p>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Create smart payment records coordinated on-chain via the <strong>PaymentRegistry</strong> contract with real-time SSE lifecycle updates.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveTab('contract_payment')}
                >
                  <Sparkles size={14} />
                  <span>Create Tracked Payment</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('tracker')}
                >
                  <Layers size={14} />
                  <span>Open Payment Tracker</span>
                </button>
              </div>
            </div>

            {/* Level 2 Guide */}
            <div className="card">
              <div className="card-header">
                <div className="card-title-group">
                  <div className="icon-badge icon-badge-indigo">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="card-title">Level 2 Architecture</h3>
                    <p className="card-subtitle">Multi-wallet & Smart Contract Tracker</p>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li><strong>Multi-Wallet:</strong> Support for Freighter, Albedo, and xBull.</li>
                  <li><strong>Soroban Registry:</strong> Deployed on Testnet (`CCBUEU...ETGY`).</li>
                  <li><strong>Real-time Stream:</strong> Live SSE synchronization with backend indexer.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
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
      )}

      {/* View 2: Payment Tracker */}
      {activeTab === 'tracker' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PaymentTracker />
        </div>
      )}

      {/* View 3: Soroban Contract Payment Creation */}
      {activeTab === 'contract_payment' && (
        <div className="dashboard-grid">
          <div>
            <CreateTrackedPaymentForm
              senderAddress={address}
              spendableBalance={balanceState.spendableBalance}
              activeWallet={activeWallet}
              onPaymentCreated={() => setActiveTab('tracker')}
              disabled={walletStatus !== 'connected'}
            />
          </div>
          <div>
            <PaymentTracker />
          </div>
        </div>
      )}

      {/* Modals */}
      <WalletSelectModal
        isOpen={isSelectModalOpen}
        onClose={closeSelectModal}
        onSelect={(w) => connect(w)}
        isConnecting={walletStatus === 'connecting'}
      />

      {reviewData && address && (
        <PaymentReview
          formData={reviewData}
          senderAddress={address}
          status={txStatus}
          onConfirm={handleConfirmPayment}
          onCancel={handleCancelReview}
        />
      )}

      {/* Footer */}
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
          <span>Stellar Payment Hub &bull; Level 2 Yellow Belt &bull; Contract: <span className="mono-text text-cyan-400">CCBUEU...ETGY</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY"
            target="_blank"
            rel="noopener noreferrer"
            className="link-subtle"
          >
            Contract on Explorer <ArrowUpRight size={13} />
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
