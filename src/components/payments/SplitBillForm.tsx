import { useState } from 'react';
import { Divide, Plus, Trash2, AlertCircle, CheckCircle2, Loader2, Calculator } from 'lucide-react';
import { isValidAddress } from '../../lib/validation/payment';
import { paymentApiService } from '../../services/payments';
import { WalletType } from '../../types/wallet';

interface SplitRecipient {
  address: string;
  share: string;
}

interface SplitBillFormProps {
  senderAddress: string | null;
  spendableBalance: string | null;
  activeWallet?: WalletType | null;
  onSuccess?: () => void;
  onSplitSuccess?: () => void;
}

export function SplitBillForm({
  senderAddress,
  spendableBalance,
  onSuccess,
  onSplitSuccess,
}: SplitBillFormProps) {
  const [mode, setMode] = useState<'equal' | 'custom'>('equal');
  const [totalBill, setTotalBill] = useState('120');
  const [recipients, setRecipients] = useState<SplitRecipient[]>([
    { address: '', share: '60' },
    { address: '', share: '60' },
  ]);
  const [memo, setMemo] = useState('Dinner Bill Split');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const parsedTotal = parseFloat(totalBill) || 0;

  const handleTotalChange = (val: string) => {
    setTotalBill(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && mode === 'equal') {
      const perPerson = (num / recipients.length).toFixed(4);
      setRecipients(recipients.map((r) => ({ ...r, share: perPerson })));
    }
  };

  const handleAddPerson = () => {
    if (recipients.length >= 10) return;
    const newCount = recipients.length + 1;
    if (mode === 'equal' && parsedTotal > 0) {
      const perPerson = (parsedTotal / newCount).toFixed(4);
      setRecipients([...recipients.map((r) => ({ ...r, share: perPerson })), { address: '', share: perPerson }]);
    } else {
      setRecipients([...recipients, { address: '', share: '0' }]);
    }
  };

  const handleRemovePerson = (index: number) => {
    if (recipients.length <= 2) return;
    const filtered = recipients.filter((_, i) => i !== index);
    if (mode === 'equal' && parsedTotal > 0) {
      const perPerson = (parsedTotal / filtered.length).toFixed(4);
      setRecipients(filtered.map((r) => ({ ...r, share: perPerson })));
    } else {
      setRecipients(filtered);
    }
  };

  const handleUpdatePerson = (index: number, field: 'address' | 'share', value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const sumShares = recipients.reduce((sum, r) => sum + (parseFloat(r.share) || 0), 0);
  const difference = parsedTotal - sumShares;

  const validate = (): string | null => {
    if (!senderAddress) return 'Please connect your wallet first.';
    if (parsedTotal <= 0) return 'Total bill must be greater than 0 XLM.';

    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      if (!r.address.trim()) return `Person #${i + 1} address cannot be empty.`;
      if (!isValidAddress(r.address.trim())) return `Person #${i + 1} is not a valid 56-character Stellar G... address.`;
      const s = parseFloat(r.share);
      if (isNaN(s) || s <= 0) return `Person #${i + 1} share must be greater than 0 XLM.`;
    }

    if (Math.abs(difference) > 0.001) {
      return `Sum of shares (${sumShares.toFixed(4)} XLM) must equal the total bill (${parsedTotal.toFixed(4)} XLM).`;
    }

    const maxSpend = parseFloat(spendableBalance || '0');
    if (parsedTotal > maxSpend) {
      return `Insufficient spendable balance. Total bill exceeds available funds.`;
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
      const txHash = `split-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 8)}`;
      await paymentApiService.createSettlement({
        payer: senderAddress!,
        total_amount: parsedTotal.toFixed(4),
        memo: memo || 'Bill Split Settlement',
        recipients: recipients.map((r) => ({
          recipient: r.address.trim(),
          amount: parseFloat(r.share).toFixed(4),
        })),
        transaction_hash: txHash,
        ledger: 104530,
      });

      await paymentApiService.recordTransaction({
        hash: txHash,
        source: senderAddress!,
        destination: `${recipients.length} Participants`,
        amount: `${parsedTotal.toFixed(4)} XLM`,
        asset: 'native',
        type: 'Settlement',
        status: 'Success',
        ledger: 104530,
      });

      setSuccessMsg(`Split bill settled successfully among ${recipients.length} participants!`);
      if (onSuccess) onSuccess();
      if (onSplitSuccess) onSplitSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bill split settlement failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" data-testid="split-bill-form">
      <div className="card-header">
        <div className="card-title-group">
          <div className="icon-badge icon-badge-purple">
            <Divide size={18} />
          </div>
          <div>
            <h3 className="card-title">Split Bill Calculator</h3>
            <p className="card-subtitle">Equal & Custom Bill Distribution</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className={`btn ${mode === 'equal' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            data-testid="split-mode-equal"
            onClick={() => {
              setMode('equal');
              if (parsedTotal > 0) {
                const perPerson = (parsedTotal / recipients.length).toFixed(4);
                setRecipients(recipients.map((r) => ({ ...r, share: perPerson })));
              }
            }}
          >
            Equal Split
          </button>
          <button
            type="button"
            className={`btn ${mode === 'custom' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            data-testid="split-mode-custom"
            onClick={() => setMode('custom')}
          >
            Custom Split
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Total Bill Amount (XLM)
          </label>
          <input
            type="number"
            step="any"
            className="input-field"
            value={totalBill}
            onChange={(e) => handleTotalChange(e.target.value)}
            placeholder="e.g. 120"
            data-testid="split-total-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Participants ({recipients.length})
          </label>
          {recipients.map((r, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 110px 40px',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                className="input-field"
                placeholder={`Participant #${index + 1} (G...)`}
                value={r.address}
                onChange={(e) => handleUpdatePerson(index, 'address', e.target.value)}
                data-testid={`split-address-${index}`}
              />
              <input
                type="number"
                step="any"
                className="input-field"
                placeholder="Share"
                value={r.share}
                disabled={mode === 'equal'}
                onChange={(e) => handleUpdatePerson(index, 'share', e.target.value)}
                data-testid={`split-share-${index}`}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem', color: 'var(--color-error)' }}
                onClick={() => handleRemovePerson(index)}
                disabled={recipients.length <= 2}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleAddPerson}
            disabled={recipients.length >= 10}
            data-testid="add-person-btn"
          >
            <Plus size={13} style={{ marginRight: '0.3rem' }} /> Add Person
          </button>

          <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
            <div>Allocated: <strong style={{ color: 'var(--text-primary)' }}>{sumShares.toFixed(4)} XLM</strong></div>
            <div style={{ color: Math.abs(difference) < 0.001 ? 'var(--color-success)' : 'var(--color-error)' }}>
              {Math.abs(difference) < 0.001 ? '✓ Balanced' : `Difference: ${difference.toFixed(4)} XLM`}
            </div>
          </div>
        </div>

        <input
          type="text"
          className="input-field"
          placeholder="Memo / Description (e.g. Saturday Dinner)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !senderAddress || Math.abs(difference) > 0.001}
          data-testid="submit-split-bill"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spin" style={{ marginRight: '0.5rem' }} />
              Executing Split Settlement...
            </>
          ) : (
            <>
              <Calculator size={15} style={{ marginRight: '0.5rem' }} />
              Settle Split Bill ({parsedTotal.toFixed(4)} XLM)
            </>
          )}
        </button>
      </form>
    </div>
  );
}
