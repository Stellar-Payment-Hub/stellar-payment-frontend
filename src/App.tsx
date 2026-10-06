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
import { TransactionHistoryView } from './components/transactions/TransactionHistoryView';
import { WalletDetailView } from './components/wallet/WalletDetailView';
import { DeveloperTestnetView } from './components/developer/DeveloperTestnetView';
import { PaymentFormData } from './types/payment';
import {
  Zap,
  Send,
  Sparkles,
  Layers,
  ArrowUpRight,
  Wallet,
  Code2,
  CheckCircle,
} from 'lucide-react';

export type TabView =
  | 'dashboard'
  | 'payments'
  | 'tracker'
  | 'transactions'
  | 'wallet'
  | 'developer';

export function App() {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [paymentsSubView, setPaymentsSubView] = useState<'native' | 'contract'>('contract');

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

      {/* Main Navigation Tabs - 6 Major Areas (Section 2) */}
      <nav className="filter-tabs-scroll" style={{ padding: '0 0.25rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`filter-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          data-testid="tab-dashboard"
        >
          <Zap size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          Dashboard
        </button>

        <button
          type="button"
          className={`filter-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
          data-testid="tab-payments"
        >
          <Send size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          Payments
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
          className={`filter-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
          data-testid="tab-transactions"
        >
          <ArrowUpRight size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          Transactions
        </button>

        <button
          type="button"
          className={`filter-tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
          data-testid="tab-wallet"
        >
          <Wallet size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          Wallet
        </button>

        <button
          type="button"
          className={`filter-tab-btn ${activeTab === 'developer' ? 'active' : ''}`}
          onClick={() => setActiveTab('developer')}
          data-testid="tab-developer"
        >
          <Code2 size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px' }} />
          Developer/Testnet
        </button>
      </nav>

      {/* View 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <main className="dashboard-grid">
          {/* Left Column: Balance & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BalanceCard
              {...balanceState}
              onRefresh={balanceState.refetch}
              onFund={balanceState.fundWithFriendbot}
              address={address}
            />

            {/* Quick Actions Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-title-group">
                  <div className="icon-badge icon-badge-cyan">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="card-title">Quick Actions</h3>
                    <p className="card-subtitle">Programmable Stellar Hub Operations</p>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Seamlessly transfer native XLM or register smart payment records on the Soroban <strong>PaymentRegistry</strong> contract.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setPaymentsSubView('native');
                    setActiveTab('payments');
                  }}
                >
                  <Send size={13} style={{ marginRight: '0.3rem' }} /> Direct Send XLM
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setPaymentsSubView('contract');
                    setActiveTab('payments');
                  }}
                >
                  <Sparkles size={13} style={{ marginRight: '0.3rem' }} /> New Tracked Payment
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('tracker')}
                >
                  <Layers size={13} style={{ marginRight: '0.3rem' }} /> View Payment Tracker
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title-group">
                  <div className="icon-badge icon-badge-purple">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="card-title">Payment Activity</h3>
                    <p className="card-subtitle">Recent Lifecycle Events</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('tracker')}
                >
                  Open Full Tracker
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>PAY-001</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Invoice #1042</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>25.0000 XLM</span>
                    <span className="status-badge status-pending" style={{ fontSize: '0.65rem' }}>Pending</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>PAY-002</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Domain Renewal</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>10.0000 XLM</span>
                    <span className="status-badge status-completed" style={{ fontSize: '0.65rem' }}>Completed</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>PAY-003</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Advance</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>15.5000 XLM</span>
                    <span className="status-badge status-processing" style={{ fontSize: '0.65rem' }}>Processing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Overview */}
            <div className="card" style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={16} className="text-cyan-400" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Level 2 Architecture Active</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Integrated with <strong>StellarWalletsKit</strong>, deployed <strong>Soroban PaymentRegistry</strong> (<code>CCBUEU...ETGY</code>), and backend real-time event pipeline with Server-Sent Events.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* View 2: Payments */}
      {activeTab === 'payments' && (
        <main className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title-group">
                  <div className="icon-badge icon-badge-cyan">
                    <Send size={18} />
                  </div>
                  <div>
                    <h3 className="card-title">Payment Hub</h3>
                    <p className="card-subtitle">Choose Direct Transfer or Soroban Tracked Payment</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  className={`btn ${paymentsSubView === 'contract' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setPaymentsSubView('contract')}
                >
                  <Sparkles size={13} style={{ marginRight: '0.3rem' }} /> Tracked Payment (Soroban)
                </button>
                <button
                  type="button"
                  className={`btn ${paymentsSubView === 'native' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setPaymentsSubView('native')}
                >
                  <Send size={13} style={{ marginRight: '0.3rem' }} /> Direct Send XLM (Native)
                </button>
              </div>

              {paymentsSubView === 'contract' ? (
                <CreateTrackedPaymentForm
                  senderAddress={address}
                  spendableBalance={balanceState.spendableBalance}
                  activeWallet={activeWallet}
                  onPaymentCreated={() => {
                    balanceState.refetch();
                    setActiveTab('tracker');
                  }}
                />
              ) : (
                <SendPaymentForm
                  senderAddress={address}
                  spendableBalance={balanceState.spendableBalance}
                  onReview={handleStartReview}
                  disabled={txStatus === 'submitting' || txStatus === 'awaiting_signature'}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BalanceCard
              {...balanceState}
              onRefresh={balanceState.refetch}
              onFund={balanceState.fundWithFriendbot}
              address={address}
            />
            {txStatus !== 'idle' && (
              <TransactionStatus
                status={txStatus}
                result={lastResult}
                onReset={resetPayment}
              />
            )}
          </div>
        </main>
      )}

      {/* View 3: Payment Tracker */}
      {activeTab === 'tracker' && (
        <main style={{ maxWidth: '100%' }}>
          <PaymentTracker />
        </main>
      )}

      {/* View 4: Transactions */}
      {activeTab === 'transactions' && (
        <main style={{ maxWidth: '100%' }}>
          <TransactionHistoryView />
        </main>
      )}

      {/* View 5: Wallet */}
      {activeTab === 'wallet' && (
        <main style={{ maxWidth: '100%' }}>
          <WalletDetailView
            status={walletStatus}
            address={address}
            activeWallet={activeWallet}
            network={network}
            balance={balanceState.balance || '0.0000'}
            onOpenSelectModal={openSelectModal}
            onDisconnect={disconnect}
            onRefreshBalance={balanceState.refetch}
            onFundWithFriendbot={balanceState.fundWithFriendbot}
            isFunding={balanceState.isLoading}
          />
        </main>
      )}

      {/* View 6: Developer/Testnet */}
      {activeTab === 'developer' && (
        <main style={{ maxWidth: '100%' }}>
          <DeveloperTestnetView />
        </main>
      )}

      {/* Review Modal */}
      {reviewData && (
        <PaymentReview
          formData={reviewData}
          senderAddress={address || ''}
          status={txStatus}
          onConfirm={handleConfirmPayment}
          onCancel={handleCancelReview}
        />
      )}

      {/* Multi-Wallet Selection Modal */}
      <WalletSelectModal
        isOpen={isSelectModalOpen}
        onSelect={connect}
        onClose={closeSelectModal}
        isConnecting={walletStatus === 'connecting'}
      />
    </div>
  );
}
export default App;
