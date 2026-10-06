import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentSubmissionResult, TransactionStatusState } from '../../types/payment';
import { getExplorerTxUrl, truncateHash } from '../../lib/stellar/explorer';

interface TransactionStatusProps {
  status: TransactionStatusState;
  result: PaymentSubmissionResult | null;
  onReset: () => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  result,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on success
  useEffect(() => {
    if (status === 'success' && result?.hash) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6'],
        });
      } catch {
        // Safe fallback if canvas not available
      }
    }
  }, [status, result?.hash]);

  const handleCopyHash = async () => {
    if (!result?.hash) return;
    try {
      await navigator.clipboard.writeText(result.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  // Idle state
  if (status === 'idle' && !result) {
    return (
      <div className="card result-card result-idle" data-testid="transaction-result-idle">
        <div className="card-header">
          <h4 className="card-title text-sm">Recent Activity</h4>
        </div>
        <div className="empty-state">
          <Clock size={20} className="text-muted" />
          <p className="text-muted text-sm">No transactions yet in this session.</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success' && result) {
    const explorerUrl = result.hash ? getExplorerTxUrl(result.hash) : '#';

    return (
      <div className="card result-card result-success" data-testid="transaction-result-success">
        <div className="result-header">
          <div className="icon-circle icon-circle-success">
            <CheckCircle2 size={24} className="text-emerald-400" />
          </div>
          <div className="result-title-group">
            <h3 className="result-heading">Payment Successful</h3>
            <p className="result-subheading">
              {result.amount} XLM sent to recipient on Stellar Testnet
            </p>
          </div>
        </div>

        <div className="result-details">
          <div className="detail-row">
            <span className="detail-label">Recipient</span>
            <span className="detail-value mono-text" title={result.recipient}>
              {truncateHash(result.recipient, 6, 6)}
            </span>
          </div>

          {result.memo && (
            <div className="detail-row">
              <span className="detail-label">Memo</span>
              <span className="detail-value">{result.memo}</span>
            </div>
          )}

          {result.ledger && (
            <div className="detail-row">
              <span className="detail-label">Ledger Close</span>
              <span className="detail-value">#{result.ledger}</span>
            </div>
          )}

          {result.hash && (
            <div className="hash-box" data-testid="transaction-hash-box">
              <span className="hash-label">Transaction Hash</span>
              <div className="hash-content-row">
                <span className="hash-text" title={result.hash} data-testid="tx-hash-value">
                  {truncateHash(result.hash, 10, 10)}
                </span>
                <div className="hash-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={handleCopyHash}
                    title={copied ? 'Copied!' : 'Copy Transaction Hash'}
                    data-testid="copy-hash-btn"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    title="View on Stellar Explorer"
                    data-testid="explorer-tx-link"
                  >
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="result-footer">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <span>View on Stellar Explorer</span>
            <ExternalLink size={13} />
          </a>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onReset}
            data-testid="send-another-btn"
          >
            <span>Send Another Payment</span>
          </button>
        </div>
      </div>
    );
  }

  // Failed state
  if (status === 'failed' || (result && result.status === 'failed')) {
    const errorMsg = result?.error || 'The transaction could not be completed on Stellar Testnet.';
    const isRejection =
      errorMsg.toLowerCase().includes('reject') ||
      errorMsg.toLowerCase().includes('decline') ||
      errorMsg.toLowerCase().includes('cancel');

    return (
      <div className="card result-card result-failed" data-testid="transaction-result-failed">
        <div className="result-header">
          <div className="icon-circle icon-circle-danger">
            <XCircle size={24} className="text-rose-400" />
          </div>
          <div className="result-title-group">
            <h3 className="result-heading">
              {isRejection ? 'Transaction Cancelled' : 'Payment Failed'}
            </h3>
            <p className="result-subheading">
              {isRejection
                ? 'You declined or rejected the transaction in your Freighter wallet.'
                : 'The transaction could not be completed.'}
            </p>
          </div>
        </div>

        <div className="error-callout">
          <span className="error-callout-text">{errorMsg}</span>
        </div>

        <div className="result-footer">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onReset}
            data-testid="try-again-btn"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
