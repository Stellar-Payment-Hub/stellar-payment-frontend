import React from 'react';
import { ArrowRight, ShieldCheck, AlertCircle, Loader2, X } from 'lucide-react';
import { PaymentFormData, TransactionStatusState } from '../../types/payment';
import { STELLAR_CONFIG } from '../../config/env';

interface PaymentReviewProps {
  formData: PaymentFormData;
  senderAddress: string;
  status: TransactionStatusState;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PaymentReview: React.FC<PaymentReviewProps> = ({
  formData,
  senderAddress,
  status,
  onConfirm,
  onCancel,
}) => {
  const isProcessing =
    status === 'preparing' ||
    status === 'awaiting_signature' ||
    status === 'submitting';

  return (
    <div className="modal-backdrop" data-testid="payment-review-modal">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <ShieldCheck size={20} className="text-cyan-400" />
            <h3 className="modal-title">Review XLM Payment</h3>
          </div>
          {!isProcessing && (
            <button
              type="button"
              className="icon-btn"
              onClick={onCancel}
              aria-label="Close review modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="modal-body">
          <div className="review-amount-display">
            <span className="review-amount-number">{formData.amount}</span>
            <span className="review-amount-ticker">XLM</span>
          </div>

          <div className="review-meta-list">
            <div className="review-meta-item">
              <span className="meta-label">Network</span>
              <span className="meta-value badge badge-network">
                ● Stellar {STELLAR_CONFIG.network.toUpperCase()}
              </span>
            </div>

            <div className="review-meta-item">
              <span className="meta-label">From (You)</span>
              <span className="meta-value mono-text" title={senderAddress}>
                {senderAddress.slice(0, 8)}...{senderAddress.slice(-6)}
              </span>
            </div>

            <div className="review-meta-item">
              <span className="meta-label">To (Recipient)</span>
              <span className="meta-value mono-text" title={formData.recipient}>
                {formData.recipient.slice(0, 8)}...{formData.recipient.slice(-6)}
              </span>
            </div>

            {formData.memo && (
              <div className="review-meta-item">
                <span className="meta-label">Memo (TEXT)</span>
                <span className="meta-value font-medium">{formData.memo}</span>
              </div>
            )}

            <div className="review-meta-item">
              <span className="meta-label">Network Base Fee</span>
              <span className="meta-value text-muted">0.0000100 XLM (100 stroops)</span>
            </div>
          </div>

          {isProcessing && (
            <div className="transaction-progress-box">
              <Loader2 size={18} className="animate-spin text-cyan-400" />
              <div className="progress-text">
                {status === 'preparing' && 'Building transaction on Stellar Testnet...'}
                {status === 'awaiting_signature' && 'Please approve transaction in Freighter wallet...'}
                {status === 'submitting' && 'Submitting transaction to Stellar Testnet ledger...'}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isProcessing}
            data-testid="cancel-review-btn"
          >
            Back
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={isProcessing}
            data-testid="confirm-payment-btn"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Sign & Submit</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
