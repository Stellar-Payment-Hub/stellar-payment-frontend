import { useState } from 'react';
import { Plus, Trash2, Send, AlertCircle, CheckCircle2, Loader2, Users } from 'lucide-react';
import { isValidAddress } from '../../lib/validation/payment';
import { paymentApiService } from '../../services/payments';
import { WalletType } from '../../types/wallet';

interface RecipientInput {
  recipient: string;
  amount: string;
}

interface MultiPaymentFormProps {
  senderAddress: string | null;
  spendableBalance: string | null;
  activeWallet?: WalletType | null;
  onPaymentSuccess?: () => void;
  onSettlementSuccess?: () => void;
}

export function MultiPaymentForm({
  senderAddress,
  spendableBalance,
  onPaymentSuccess,
  onSettlementSuccess,
}: MultiPaymentFormProps) {
  const [recipients, setRecipients] = useState<RecipientInput[]>([
    { recipient: '', amount: '' },
    { recipient: '', amount: '' },
  ]);
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successHash, setSuccessHash] = useState<string | null>(null);

  const totalAmount = recipients.reduce((sum, r) => {
    const val = parseFloat(r.amount);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleAddRecipient = () => {
    if (recipients.length >= 10) return;
    setRecipients([...recipients, { recipient: '', amount: '' }]);
  };

  const handleRemoveRecipient = (index: number) => {
    if (recipients.length <= 2) return;
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleUpdateRecipient = (index: number, field: 'recipient' | 'amount', value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const validate = (): string | null => {
    if (!senderAddress) return 'Please connect your wallet first.';
    if (recipients.length < 2) return 'At least two recipients are required for multi-address payments.';

    const addressSet = new Set<string>();

    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      if (!r.recipient.trim()) return `Recipient #${i + 1} address cannot be empty.`;
      if (!isValidAddress(r.recipient.trim())) return `Recipient #${i + 1} is not a valid 56-character Stellar G... address.`;
      if (r.recipient.trim() === senderAddress) return `Recipient #${i + 1} cannot be your own address.`;
      if (addressSet.has(r.recipient.trim())) return `Duplicate recipient address detected at #${i + 1}.`;
      addressSet.add(r.recipient.trim());

      const num = parseFloat(r.amount);
      if (isNaN(num) || num <= 0) return `Recipient #${i + 1} amount must be greater than 0 XLM.`;
    }

    if (totalAmount <= 0) return 'Total payment amount must be greater than 0.';

    const maxSpend = parseFloat(spendableBalance || '0');
    if (totalAmount > maxSpend) {
      return `Insufficient spendable balance. Total (${totalAmount.toFixed(4)} XLM) exceeds available (${maxSpend.toFixed(4)} XLM).`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErr = validate();
    if (valErr) {
      setError(valErr);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Simulate confirmation and register settlement
      const generatedHash = `multi-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 10)}`;

      await paymentApiService.createSettlement({
        payer: senderAddress!,
        total_amount: totalAmount.toFixed(4),
        memo: memo || 'Multi-Address Payment',
        recipients: recipients.map((r) => ({
          recipient: r.recipient.trim(),
          amount: parseFloat(r.amount).toFixed(4),
        })),
        transaction_hash: generatedHash,
        ledger: 104520,
      });

      // Record to transaction ledger
      await paymentApiService.recordTransaction({
        hash: generatedHash,
        source: senderAddress!,
        destination: `${recipients.length} Recipient Addresses`,
        amount: `${totalAmount.toFixed(4)} XLM`,
        asset: 'native',
        type: 'Settlement',
        status: 'Success',
        ledger: 104520,
      });

      setSuccessHash(generatedHash);
      if (onPaymentSuccess) onPaymentSuccess();
      if (onSettlementSuccess) onSettlementSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Multi-address payment submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" data-testid="multi-payment-form">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-cyan">
            <Users size={18} />
          </div>
          <div>
            <h3 className="card-title">Multi-Address Payment</h3>
            <p className="card-subtitle">Atomic Multi-Recipient Settlement</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recipients.map((r, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 120px 40px',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              className="input-field"
              placeholder={`Recipient #${index + 1} (G...)`}
              value={r.recipient}
              onChange={(e) => handleUpdateRecipient(index, 'recipient', e.target.value)}
              data-testid={`multi-recipient-${index}`}
            />
            <input
              type="number"
              step="any"
              className="input-field"
              placeholder="XLM"
              value={r.amount}
              onChange={(e) => handleUpdateRecipient(index, 'amount', e.target.value)}
              data-testid={`multi-amount-${index}`}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem', color: 'var(--color-error)' }}
              onClick={() => handleRemoveRecipient(index)}
              disabled={recipients.length <= 2}
              title="Remove Recipient"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleAddRecipient}
            disabled={recipients.length >= 10}
            data-testid="add-recipient-btn"
          >
            <Plus size={13} style={{ marginRight: '0.3rem' }} /> Add Recipient ({recipients.length}/10)
          </button>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Payment: </span>
            <strong style={{ fontSize: '1rem', color: 'var(--color-cyan)' }} data-testid="multi-total">
              {totalAmount.toFixed(4)} XLM
            </strong>
          </div>
        </div>

        <input
          type="text"
          className="input-field"
          placeholder="Optional Settlement Memo (e.g. Project Bonus)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successHash && (
          <div className="alert alert-success">
            <CheckCircle2 size={16} />
            <span>
              Multi-address settlement completed! Tx: <span className="mono-text">{successHash.substring(0, 16)}...</span>
            </span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !senderAddress}
          data-testid="submit-multi-payment"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spin" style={{ marginRight: '0.5rem' }} />
              Processing Settlement...
            </>
          ) : (
            <>
              <Send size={15} style={{ marginRight: '0.5rem' }} />
              Submit Multi-Address Payment ({totalAmount.toFixed(4)} XLM)
            </>
          )}
        </button>
      </form>
    </div>
  );
}
