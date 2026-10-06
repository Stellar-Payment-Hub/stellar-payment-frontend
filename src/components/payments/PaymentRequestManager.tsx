import { useState, useEffect } from 'react';
import { FileText, Copy, Check, Send, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { paymentApiService, TrackerPaymentRequest } from '../../services/payments';
import { WalletType } from '../../types/wallet';

interface PaymentRequestManagerProps {
  senderAddress?: string | null;
  connectedAddress?: string | null;
  activeWallet?: WalletType | null;
  onPaymentSuccess?: () => void;
  onPaid?: () => void;
}

export function PaymentRequestManager({
  senderAddress,
  connectedAddress,
  onPaymentSuccess,
  onPaid,
}: PaymentRequestManagerProps) {
  const activeUser = senderAddress || connectedAddress || null;

  const [requests, setRequests] = useState<TrackerPaymentRequest[]>([]);
  const [amount, setAmount] = useState('25.0000');
  const [memo, setMemo] = useState('Design Services Invoice');
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    const list = await paymentApiService.getPaymentRequests();
    setRequests([...list]);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) {
      setError('Please connect your wallet first.');
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid requested amount.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await paymentApiService.createPaymentRequest({
        requester: activeUser,
        amount: num.toFixed(4),
        memo,
      });
      await fetchRequests();
      setAmount('');
      setMemo('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment request.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayRequest = async (req: TrackerPaymentRequest) => {
    if (!activeUser) {
      setError('Please connect your wallet to fulfill this payment request.');
      return;
    }

    setPayingId(req.id);
    setError(null);

    try {
      const txHash = `reqpay-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 8)}`;
      await paymentApiService.payPaymentRequest(req.id, activeUser, txHash);
      await paymentApiService.recordTransaction({
        hash: txHash,
        source: activeUser,
        destination: req.requester,
        amount: `${req.amount} XLM`,
        asset: 'native',
        type: 'Native Payment',
        status: 'Success',
        ledger: 104540,
      });

      await fetchRequests();
      if (onPaymentSuccess) onPaymentSuccess();
      if (onPaid) onPaid();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request payment.');
    } finally {
      setPayingId(null);
    }
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/?tab=payments&request=${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} data-testid="payment-request-manager">
      {/* Create Request Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="icon-badge icon-badge-cyan">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="card-title">Create Payment Request</h3>
              <p className="card-subtitle">Generate Shareable Invoices on Stellar Testnet</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreateRequest} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Requested Amount (XLM)
            </label>
            <input
              type="number"
              step="any"
              className="input-field"
              placeholder="e.g. 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="request-amount-input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Memo / Purpose
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Freelance Milestone #1"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              data-testid="request-memo-input"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !senderAddress || !amount}
            data-testid="submit-payment-request"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" style={{ marginRight: '0.4rem' }} />
                Generating Request...
              </>
            ) : (
              <>
                <Send size={15} style={{ marginRight: '0.4rem' }} />
                Generate Shareable Payment Request
              </>
            )}
          </button>
        </form>
      </div>

      {/* Requests Ledger */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">Active Payment Requests</h3>
            <p className="card-subtitle">Payable Invoices</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {requests.map((req) => (
            <div
              key={req.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{req.id}</strong>
                  <span style={{ fontWeight: 600, color: 'var(--color-cyan)' }}>{req.amount} XLM</span>
                  <span className={`status-badge status-${req.status.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                    {req.status === 'PAID' ? <CheckCircle2 size={10} style={{ marginRight: '0.2rem' }} /> : <Clock size={10} style={{ marginRight: '0.2rem' }} />}
                    {req.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {req.memo} • Requester: <span className="mono-text">{req.requester.substring(0, 10)}...</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopyLink(req.id)}
                  style={{ fontSize: '0.75rem' }}
                >
                  {copiedId === req.id ? <Check size={12} className="text-cyan-400" /> : <Copy size={12} />}
                  <span style={{ marginLeft: '0.25rem' }}>{copiedId === req.id ? 'Copied' : 'Share Link'}</span>
                </button>

                {req.status === 'ACTIVE' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={payingId === req.id}
                    onClick={() => handlePayRequest(req)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {payingId === req.id ? 'Paying...' : 'Pay Request'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
