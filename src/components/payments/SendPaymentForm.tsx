import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { PaymentFormData, PaymentFormErrors } from '../../types/payment';
import { validatePaymentForm } from '../../lib/validation/payment';

interface SendPaymentFormProps {
  senderAddress: string | null;
  spendableBalance: string | null;
  onReview: (data: PaymentFormData) => void;
  disabled?: boolean;
}

export const SendPaymentForm: React.FC<SendPaymentFormProps> = ({
  senderAddress,
  spendableBalance,
  onReview,
  disabled = false,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    recipient: '',
    amount: '',
    memo: '',
  });

  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [touched, setTouched] = useState<{ [K in keyof PaymentFormData]?: boolean }>({});

  const handleChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof PaymentFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: validationErrors } = validatePaymentForm(
      formData,
      spendableBalance,
      senderAddress
    );
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleMaxClick = () => {
    if (spendableBalance && parseFloat(spendableBalance) > 0) {
      handleChange('amount', spendableBalance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validatePaymentForm(
      formData,
      spendableBalance,
      senderAddress
    );

    if (!isValid) {
      setErrors(validationErrors);
      setTouched({ recipient: true, amount: true, memo: true });
      return;
    }

    onReview(formData);
  };

  const isFormDisabled = disabled || !senderAddress;

  return (
    <div className="card payment-form-card" data-testid="send-payment-form">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-indigo">
            <Send size={18} />
          </div>
          <div>
            <h3 className="card-title">Send XLM</h3>
            <p className="card-subtitle">Instant peer-to-peer Stellar payment</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Recipient Input */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="recipient-input" className="form-label">
              Recipient Stellar Address
            </label>
            <span className="text-muted text-xs">Public key (56 chars)</span>
          </div>

          <div className="input-wrapper">
            <input
              id="recipient-input"
              type="text"
              className={`input-field font-mono ${errors.recipient && touched.recipient ? 'input-error' : ''}`}
              placeholder="e.g. GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
              value={formData.recipient}
              onChange={(e) => handleChange('recipient', e.target.value)}
              onBlur={() => handleBlur('recipient')}
              disabled={isFormDisabled}
              autoComplete="off"
              spellCheck={false}
              data-testid="recipient-input"
            />
          </div>

          {errors.recipient && touched.recipient && (
            <div className="field-error" data-testid="recipient-error">
              <AlertCircle size={13} />
              <span>{errors.recipient}</span>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="amount-input" className="form-label">
              Amount (XLM)
            </label>
            {spendableBalance && (
              <button
                type="button"
                className="max-btn"
                onClick={handleMaxClick}
                disabled={isFormDisabled}
                data-testid="max-amount-btn"
              >
                Max: {parseFloat(spendableBalance).toFixed(4)} XLM
              </button>
            )}
          </div>

          <div className="input-wrapper">
            <input
              id="amount-input"
              type="number"
              step="any"
              min="0.0000001"
              className={`input-field font-mono ${errors.amount && touched.amount ? 'input-error' : ''}`}
              placeholder="0.0000"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              disabled={isFormDisabled}
              data-testid="amount-input"
            />
            <span className="input-suffix">XLM</span>
          </div>

          {errors.amount && touched.amount && (
            <div className="field-error" data-testid="amount-error">
              <AlertCircle size={13} />
              <span>{errors.amount}</span>
            </div>
          )}
        </div>

        {/* Memo Input */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="memo-input" className="form-label">
              Memo <span className="text-muted text-xs">(Optional)</span>
            </label>
            <span className="text-muted text-xs">
              {new TextEncoder().encode(formData.memo).length}/28 bytes
            </span>
          </div>

          <div className="input-wrapper">
            <input
              id="memo-input"
              type="text"
              maxLength={28}
              className={`input-field ${errors.memo && touched.memo ? 'input-error' : ''}`}
              placeholder="e.g. Invoice #1042 or Coffee"
              value={formData.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
              onBlur={() => handleBlur('memo')}
              disabled={isFormDisabled}
              data-testid="memo-input"
            />
          </div>

          {errors.memo && touched.memo && (
            <div className="field-error" data-testid="memo-error">
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
          data-testid="review-payment-btn"
        >
          <span>Review Payment</span>
        </button>

        {!senderAddress && (
          <p className="form-hint text-center mt-2 text-muted text-xs">
            Connect your Freighter wallet to send payments.
          </p>
        )}
      </form>
    </div>
  );
};
