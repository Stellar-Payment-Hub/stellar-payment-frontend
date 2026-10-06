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
import { MultiPaymentForm } from './components/payments/MultiPaymentForm';
import { SplitBillForm } from './components/payments/SplitBillForm';
import { PaymentRequestManager } from './components/payments/PaymentRequestManager';
import { TipJarView } from './components/tipjar/TipJarView';
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
  Users,
  Split,
  FileText,
  Heart,
} from 'lucide-react';

export type TabView =
  | 'dashboard'
  | 'payments'
  | 'tracker'
  | 'transactions'
  | 'tipjar'
  | 'wallet'
  | 'developer';

export type PaymentsSubView =
  | 'single'
  | 'multi'
  | 'split'
  | 'requests';

export function App() {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [paymentsSubView, setPaymentsSubView] = useState<PaymentsSubView>('single');
  const [singlePaymentType, setSinglePaymentType] = useState<'contract' | 'native'>('contract');

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 className="brand-title">Stellar Payment Hub</h1>
              <span className="brand-badge" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff' }}>
                Enterprise Settlement Platform
              </span>
              <span className="badge badge-network" style={{ fontSize: '0.65rem' }}>
                Testnet Active
              </span>
            </div>
            <p className="card-subtitle">Programmable Settlement, Multi-Address Dispersal & Real-Time Sync</p>
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
          className={`filter-tab-btn ${activeTab === 'tipjar' ? 'active' : ''}`}
          onClick={() => setActiveTab('tipjar')}
          data-testid="tab-tipjar"
        >
          <Heart size={13} style={{ marginRight: '0.35rem', verticalAlign: '-1px', color: '#f43f5e' }} />
          Tip Jar
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
          Developer/Faucet
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
                    <p className="card-subtitle">Programmable Payment Operations</p>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Execute native transfers, multi-address batch settlements, bill splitting, and smart invoices powered by Soroban smart contracts.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setPaymentsSubView('single');
                    setActiveTab('payments');
                  }}
                >
                  <Send size={13} style={{ marginRight: '0.3rem' }} /> Single Send
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setPaymentsSubView('multi');
                    setActiveTab('payments');
                  }}
                >
                  <Users size={13} style={{ marginRight: '0.3rem' }} /> Multi-Address
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setPaymentsSubView('split');
                    setActiveTab('payments');
                  }}
                >
                  <Split size={13} style={{ marginRight: '0.3rem' }} /> Split Bill
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setPaymentsSubView('requests');
                    setActiveTab('payments');
                  }}
                >
                  <FileText size={13} style={{ marginRight: '0.3rem' }} /> Invoices
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('tipjar')}
                >
                  <Heart size={13} style={{ marginRight: '0.3rem', color: '#f43f5e' }} /> Tip Jar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('tracker')}
                >
                  <Layers size={13} style={{ marginRight: '0.3rem' }} /> Tracker 2.0
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
                    <h3 className="card-title">Settlement Activity</h3>
                    <p className="card-subtitle">Recent Lifecycle & Multi-Recipient Events</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('tracker')}
                >
                  Open Tracker
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
                    <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--cyan-400)' }}>SETTLE-001</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Core Contributor Bounty (3 Recipients)</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>100.0000 XLM</span>
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
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>PAY-001</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audit Fee #1042</span>
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
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Infrastructure Support</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>10.0000 XLM</span>
                    <span className="status-badge status-completed" style={{ fontSize: '0.65rem' }}>Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Overview */}
            <div className="card" style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={16} className="text-cyan-400" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Soroban Smart Engine Online</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Operating with dual Soroban smart contracts: <strong>SettlementRouter</strong> (<code>CBX7MK...7U1E</code>) and <strong>PaymentRegistry</strong> (<code>CCBUEU...ETGY</code>) with verified inter-contract invocation, real-time event streaming, and multi-address settlement.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* View 2: Payments Hub */}
      {activeTab === 'payments' && (
        <main className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              {/* Payments Sub-Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn ${paymentsSubView === 'single' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setPaymentsSubView('single')}
                  data-testid="subtab-single"
                >
                  <Send size={13} style={{ marginRight: '0.3rem' }} /> Single Send
                </button>
                <button
                  type="button"
                  className={`btn ${paymentsSubView === 'multi' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setPaymentsSubView('multi')}
                  data-testid="subtab-multi"
                >
                  <Users size={13} style={{ marginRight: '0.3rem' }} /> Multi-Address
                </button>
                <button
                  type="button"
                  className={`btn ${paymentsSubView === 'split' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setPaymentsSubView('split')}
                  data-testid="subtab-split"
                >
                  <Split size={13} style={{ marginRight: '0.3rem' }} /> Split Bill
                </button>
                <button
                  type="button"
                  className={`btn ${paymentsSubView === 'requests' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setPaymentsSubView('requests')}
                  data-testid="subtab-requests"
                >
                  <FileText size={13} style={{ marginRight: '0.3rem' }} /> Payment Requests
                </button>
              </div>

              {/* Sub-view: Single Payment */}
              {paymentsSubView === 'single' && (
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <button
                      type="button"
                      className={`btn ${singlePaymentType === 'contract' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => setSinglePaymentType('contract')}
                    >
                      <Sparkles size={13} style={{ marginRight: '0.3rem' }} /> Tracked Payment (Soroban)
                    </button>
                    <button
                      type="button"
                      className={`btn ${singlePaymentType === 'native' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => setSinglePaymentType('native')}
                    >
                      <Send size={13} style={{ marginRight: '0.3rem' }} /> Direct Send XLM (Native)
                    </button>
                  </div>

                  {singlePaymentType === 'contract' ? (
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
              )}

              {/* Sub-view: Multi-Address Payment */}
              {paymentsSubView === 'multi' && (
                <MultiPaymentForm
                  senderAddress={address}
                  spendableBalance={balanceState.spendableBalance}
                  activeWallet={activeWallet}
                  onSettlementSuccess={() => {
                    balanceState.refetch();
                    setActiveTab('tracker');
                  }}
                />
              )}

              {/* Sub-view: Split Bill */}
              {paymentsSubView === 'split' && (
                <SplitBillForm
                  senderAddress={address}
                  spendableBalance={balanceState.spendableBalance}
                  activeWallet={activeWallet}
                  onSplitSuccess={() => {
                    balanceState.refetch();
                    setActiveTab('tracker');
                  }}
                />
              )}

              {/* Sub-view: Payment Requests */}
              {paymentsSubView === 'requests' && (
                <PaymentRequestManager
                  connectedAddress={address}
                  activeWallet={activeWallet}
                  onPaid={() => {
                    balanceState.refetch();
                  }}
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

      {/* View 3: Payment Tracker 2.0 */}
      {activeTab === 'tracker' && (
        <main style={{ maxWidth: '100%' }}>
          <PaymentTracker />
        </main>
      )}

      {/* View 4: Transactions Ledger */}
      {activeTab === 'transactions' && (
        <main style={{ maxWidth: '100%' }}>
          <TransactionHistoryView />
        </main>
      )}

      {/* View 5: Tip Jar */}
      {activeTab === 'tipjar' && (
        <main style={{ maxWidth: '100%' }}>
          <TipJarView
            defaultRecipient={address || 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'}
            connectedAddress={address}
            activeWallet={activeWallet}
            onTipSuccess={() => {
              balanceState.refetch();
            }}
          />
        </main>
      )}

      {/* View 6: Wallet Management */}
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

      {/* View 7: Developer/Testnet View */}
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
