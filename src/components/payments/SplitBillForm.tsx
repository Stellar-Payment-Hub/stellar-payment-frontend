import { useState } from 'react';
import { Divide, Plus, Trash2, AlertCircle, CheckCircle2, Loader2, Percent } from 'lucide-react';
import { isValidAddress } from '../../lib/validation/payment';
import { paymentApiService } from '../../services/payments';
import { WalletType } from '../../types/wallet';

interface SplitRecipient {
  address: string;
  share: string;
  percentage?: string;
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
  const [mode, setMode] = useState<'equal' | 'custom' | 'percentage'>('equal');
  const [totalBill, setTotalBill] = useState('120');
  const [recipients, setRecipients] = useState<SplitRecipient[]>([
    { address: '', share: '60', percentage: '50' },
    { address: '', share: '60', percentage: '50' },
  ]);
  const [memo, setMemo] = useState('Dinner Bill Split');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const parsedTotal = parseFloat(totalBill) || 0;

  const recalculateFromPercentages = (newRecipients: SplitRecipient[], total: number) => {
    return newRecipients.map((r) => {
      const pct = parseFloat(r.percentage || '0') || 0;
      const share = total > 0 ? ((total * pct) / 100).toFixed(4) : '0';
      return { ...r, share };
    });
  };

  const handleTotalChange = (val: string) => {
    setTotalBill(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      if (mode === 'equal') {
        const perPerson = (num / recipients.length).toFixed(4);
        setRecipients(recipients.map((r) => ({ ...r, share: perPerson })));
      } else if (mode === 'percentage') {
        setRecipients(recalculateFromPercentages(recipients, num));
      }
    }
  };

  const handleModeChange = (newMode: 'equal' | 'custom' | 'percentage') => {
    setMode(newMode);
    if (newMode === 'equal' && parsedTotal > 0) {
      const perPerson = (parsedTotal / recipients.length).toFixed(4);
      const equalPct = (100 / recipients.length).toFixed(2);
      setRecipients(recipients.map((r) => ({ ...r, share: perPerson, percentage: equalPct })));
    } else if (newMode === 'percentage' && parsedTotal > 0) {
      const equalPct = (100 / recipients.length).toFixed(2);
      const updated = recipients.map((r) => ({ ...r, percentage: equalPct }));
      setRecipients(recalculateFromPercentages(updated, parsedTotal));
    }
  };

  const handleAddPerson = () => {
    if (recipients.length >= 10) return;
    const newCount = recipients.length + 1;
    if (mode === 'equal' && parsedTotal > 0) {
      const perPerson = (parsedTotal / newCount).toFixed(4);
      const equalPct = (100 / newCount).toFixed(2);
      setRecipients([
        ...recipients.map((r) => ({ ...r, share: perPerson, percentage: equalPct })),
        { address: '', share: perPerson, percentage: equalPct },
      ]);
    } else if (mode === 'percentage') {
      const equalPct = (100 / newCount).toFixed(2);
      const updated = [...recipients.map((r) => ({ ...r, percentage: equalPct })), { address: '', share: '0', percentage: equalPct }];
      setRecipients(recalculateFromPercentages(updated, parsedTotal));
    } else {
      setRecipients([...recipients, { address: '', share: '0', percentage: '0' }]);
    }
  };

  const handleRemovePerson = (index: number) => {
    if (recipients.length <= 2) return;
    const filtered = recipients.filter((_, i) => i !== index);
    if (mode === 'equal' && parsedTotal > 0) {
      const perPerson = (parsedTotal / filtered.length).toFixed(4);
      setRecipients(filtered.map((r) => ({ ...r, share: perPerson })));
    } else if (mode === 'percentage' && parsedTotal > 0) {
      const equalPct = (100 / filtered.length).toFixed(2);
      const updated = filtered.map((r) => ({ ...r, percentage: equalPct }));
      setRecipients(recalculateFromPercentages(updated, parsedTotal));
    } else {
      setRecipients(filtered);
    }
  };

  const handleUpdatePerson = (index: number, field: 'address' | 'share' | 'percentage', value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    if (field === 'percentage' && mode === 'percentage') {
      const pct = parseFloat(value) || 0;
      updated[index].share = parsedTotal > 0 ? ((parsedTotal * pct) / 100).toFixed(4) : '0';
    }
    setRecipients(updated);
  };

  const sumShares = recipients.reduce((sum, r) => sum + (parseFloat(r.share) || 0), 0);
  const sumPercentages = recipients.reduce((sum, r) => sum + (parseFloat(r.percentage || '0') || 0), 0);
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

    if (mode === 'percentage') {
      if (Math.abs(sumPercentages - 100) > 0.5) {
        return `Total percentage must equal 100% (currently ${sumPercentages.toFixed(1)}%).`;
      }
    }

    if (Math.abs(difference) > 0.01) {
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
            <p className="card-subtitle">Equal, Percentage & Custom Bill Distribution</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${mode === 'equal' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            data-testid="split-mode-equal"
            onClick={() => handleModeChange('equal')}
          >
            Equal
          </button>
          <button
            type="button"
            className={`btn ${mode === 'percentage' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            data-testid="split-mode-percentage"
            onClick={() => handleModeChange('percentage')}
          >
            <Percent size={13} style={{ marginRight: '2px' }} /> Percentage
          </button>
          <button
            type="button"
            className={`btn ${mode === 'custom' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            data-testid="split-mode-custom"
            onClick={() => handleModeChange('custom')}
          >
            Custom
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

        {/* Recipients list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Participants ({recipients.length}/10)
            </span>
            {recipients.length < 10 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-testid="add-split-person-btn"
                onClick={handleAddPerson}
              >
                <Plus size={14} /> Add Person
              </button>
            )}
          </div>

          {recipients.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: mode === 'percentage' ? '1fr 70px 100px 36px' : '1fr 110px 36px',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                className="input-field"
                placeholder={`Person #${i + 1} Address (G...)`}
                value={r.address}
                onChange={(e) => handleUpdatePerson(i, 'address', e.target.value)}
                data-testid={`split-address-${i}`}
              />

              {mode === 'percentage' && (
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    value={r.percentage || ''}
                    onChange={(e) => handleUpdatePerson(i, 'percentage', e.target.value)}
                    placeholder="%"
                    data-testid={`split-pct-${i}`}
                  />
                  <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>%</span>
                </div>
              )}

              <input
                type="number"
                step="any"
                className="input-field"
                value={r.share}
                onChange={(e) => handleUpdatePerson(i, 'share', e.target.value)}
                disabled={mode === 'equal' || mode === 'percentage'}
                data-testid={`split-share-${i}`}
              />

              {recipients.length > 2 && (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => handleRemovePerson(i)}
                  data-testid={`remove-split-person-${i}`}
                  aria-label="Remove person"
                >
                  <Trash2 size={15} className="text-danger" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Remainder / Match Info */}
        <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', color: Math.abs(difference) > 0.01 ? 'var(--warning)' : 'var(--success)' }}>
          <span>Allocated: {sumShares.toFixed(4)} / {parsedTotal.toFixed(4)} XLM</span>
          <span>Difference: {difference >= 0 ? `+${difference.toFixed(4)}` : difference.toFixed(4)} XLM</span>
        </div>

        {mode === 'percentage' && (
          <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', color: Math.abs(sumPercentages - 100) > 0.5 ? 'var(--danger)' : 'var(--success)' }}>
            <span>Total Percentage: {sumPercentages.toFixed(1)}%</span>
            <span>Target: 100%</span>
          </div>
        )}

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Settlement Memo
          </label>
          <input
            type="text"
            className="input-field"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="e.g. Dinner Bill Split"
            data-testid="split-memo-input"
          />
        </div>

        {error && (
          <div className="alert alert-danger" data-testid="split-error-alert">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" data-testid="split-success-alert">
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
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
              <Loader2 size={16} className="animate-spin" /> Settling Split Bill...
            </>
          ) : (
            'Settle Split Bill'
          )}
        </button>
      </form>
    </div>
  );
}
