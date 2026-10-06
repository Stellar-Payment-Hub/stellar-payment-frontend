import { useState } from 'react';
import { Sparkles, AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { validatePaymentForm } from '../../lib/validation/payment';
import { invokeCreateContractPayment } from '../../lib/contracts/paymentRegistry';
import { paymentApiService } from '../../services/payments';
import { WalletType } from '../../types/wallet';
import { PaymentFormData, PaymentFormErrors } from '../../types/payment';

interface CreateTrackedPaymentFormProps {
  senderAddress: string | null;
  spendableBalance: string | null;
  activeWallet: WalletType | null;
  onPaymentCreated?: () => void;
  disabled?: boolean;
}

export const CreateTrackedPaymentForm = ({
  senderAddress,
  spendableBalance,
  activeWallet,
  onPaymentCreated,
  disabled = false,
}: CreateTrackedPaymentFormProps) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    recipient: '',
    amount: '',
    memo: '',
  });

  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ id: string; txHash?: string } | null>(null);

  const handleChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderAddress) return;

    const { isValid, errors: valErrors } = validatePaymentForm(
      formData,
      spendableBalance,
      senderAddress
    );

    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccessInfo(null);

    try {
      // 1. Invoke Soroban PaymentRegistry contract
      const contractRes = await invokeCreateContractPayment({
        creator: senderAddress,
        recipient: formData.recipient.trim(),
        amount: formData.amount.trim(),
        memo: formData.memo.trim(),
        walletType: activeWallet || 'freighter',
      });

      // 2. Register with backend / tracker
      const registered = await paymentApiService.registerPayment({
        creator_address: senderAddress,
        recipient_address: formData.recipient.trim(),
        amount: formData.amount.trim(),
        memo: formData.memo.trim(),
        on_chain_id: contractRes.onChainId,
        transaction_hash: contractRes.txHash,
        ledger: contractRes.ledger,
      });

      setSuccessInfo({ id: registered.id, txHash: contractRes.txHash });
      setFormData({ recipient: '', amount: '', memo: '' });
      onPaymentCreated?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Contract payment creation failed.';
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = disabled || !senderAddress || isSubmitting;

  return (
    <div className="card payment-form-card" data-testid="create-tracked-payment-form">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-cyan">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="card-title">New Tracked Payment</h3>
            <p className="card-subtitle">Programmable Soroban contract settlement</p>
          </div>
        </div>
      </div>

      {successInfo && (
        <div className="success-callout mb-4" data-testid="tracked-payment-success">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <div>
            <span className="font-semibold text-sm">Payment #{successInfo.id} Registered</span>
            <p className="text-xs text-muted">Created in Soroban registry with PENDING status.</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="wallet-error-banner mb-3">
          <AlertCircle size={15} />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Recipient */}
        <div className="form-group">
          <label htmlFor="tracked-recipient" className="form-label">
            Recipient Stellar Address
          </label>
          <div className="input-wrapper">
            <input
              id="tracked-recipient"
              type="text"
              className={`input-field font-mono ${errors.recipient ? 'input-error' : ''}`}
              placeholder="e.g. GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
              value={formData.recipient}
              onChange={(e) => handleChange('recipient', e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
          {errors.recipient && (
            <div className="field-error">
              <AlertCircle size={13} />
              <span>{errors.recipient}</span>
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="tracked-amount" className="form-label">
            Amount (XLM)
          </label>
          <div className="input-wrapper">
            <input
              id="tracked-amount"
              type="number"
              step="any"
              min="0.0000001"
              className={`input-field font-mono ${errors.amount ? 'input-error' : ''}`}
              placeholder="0.0000"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              disabled={isFormDisabled}
            />
            <span className="input-suffix">XLM</span>
          </div>
          {errors.amount && (
            <div className="field-error">
              <AlertCircle size={13} />
              <span>{errors.amount}</span>
            </div>
          )}
        </div>

        {/* Memo */}
        <div className="form-group">
          <label htmlFor="tracked-memo" className="form-label">
            Memo / Reference Note
          </label>
          <div className="input-wrapper">
            <input
              id="tracked-memo"
              type="text"
              maxLength={28}
              className={`input-field ${errors.memo ? 'input-error' : ''}`}
              placeholder="e.g. Milestone 1 or Order #42"
              value={formData.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
          {errors.memo && (
            <div className="field-error">
              <AlertCircle size={13} />
              <span>{errors.memo}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-block mt-4"
          disabled={isFormDisabled}
          data-testid="submit-contract-payment-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Calling Soroban Contract...</span>
            </>
          ) : (
            <>
              <span>Create Tracked Payment</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
