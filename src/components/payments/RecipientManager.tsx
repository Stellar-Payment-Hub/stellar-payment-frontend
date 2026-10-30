import { Plus, Trash2, Copy, Sparkles, AlertCircle } from 'lucide-react';
import { isValidAddress } from '../../lib/validation/payment';

export interface ManagedRecipient {
  id: string;
  address: string;
  amount: string;
  memo?: string;
}

interface RecipientManagerProps {
  recipients: ManagedRecipient[];
  onChange: (recipients: ManagedRecipient[]) => void;
  maxRecipients?: number;
}

const TESTNET_WALLETS = [
  'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
  'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
  'GCF3G23D7TY42E4P42UQLU7PGLZ2F4532B4YJDF5GBX24S34MMP54H2G',
];

export function RecipientManager({
  recipients,
  onChange,
  maxRecipients = 20,
}: RecipientManagerProps) {
  const addRecipient = () => {
    if (recipients.length >= maxRecipients) return;
    const newId = `recip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    onChange([...recipients, { id: newId, address: '', amount: '10' }]);
  };

  const removeRecipient = (index: number) => {
    onChange(recipients.filter((_, i) => i !== index));
  };

  const duplicateRecipient = (index: number) => {
    if (recipients.length >= maxRecipients) return;
    const target = recipients[index];
    const newId = `recip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const copy = { ...target, id: newId };
    const nextList = [...recipients];
    nextList.splice(index + 1, 0, copy);
    onChange(nextList);
  };

  const updateRecipient = (index: number, field: keyof ManagedRecipient, val: string) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const autofillTestnet = () => {
    const populated = TESTNET_WALLETS.map((addr, idx) => ({
      id: `recip-testnet-${idx}-${Date.now()}`,
      address: addr,
      amount: String((idx + 1) * 25),
      memo: `Disbursement #${idx + 1}`,
    }));
    onChange(populated);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="card" data-testid="recipient-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Recipient List ({recipients.length}/{maxRecipients})</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Manage disbursement endpoints</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={autofillTestnet}
            data-testid="autofill-testnet-btn"
          >
            <Sparkles size={13} className="text-cyan-400" /> Autofill Testnet
          </button>
          {recipients.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm text-danger"
              onClick={clearAll}
              data-testid="clear-all-recipients-btn"
            >
              Clear All
            </button>
          )}
          {recipients.length < maxRecipients && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={addRecipient}
              data-testid="add-recipient-row-btn"
            >
              <Plus size={13} /> Add Row
            </button>
          )}
        </div>
      </div>

      {recipients.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          No recipients added yet. Click "Add Row" or "Autofill Testnet" to begin.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recipients.map((r, i) => {
            const hasAddr = Boolean(r.address.trim());
            const isValid = hasAddr && isValidAddress(r.address.trim());

            return (
              <div
                key={r.id}
                data-testid={`recipient-row-${i}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 32px 32px',
                  gap: '0.5rem',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.015)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${hasAddr && !isValid ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)'}`,
                }}
              >
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Stellar Address (G...)"
                    value={r.address}
                    onChange={(e) => updateRecipient(i, 'address', e.target.value)}
                    data-testid={`recipient-addr-input-${i}`}
                    style={{ paddingRight: hasAddr && !isValid ? '2rem' : undefined }}
                  />
                  {hasAddr && !isValid && (
                    <span
                      title="Invalid 56-character Stellar G... address"
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}
                    >
                      <AlertCircle size={14} className="text-danger" />
                    </span>
                  )}
                </div>

                <input
                  type="number"
                  step="any"
                  className="input-field"
                  placeholder="Amount"
                  value={r.amount}
                  onChange={(e) => updateRecipient(i, 'amount', e.target.value)}
                  data-testid={`recipient-amount-input-${i}`}
                />

                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => duplicateRecipient(i)}
                  title="Duplicate row"
                  data-testid={`duplicate-recipient-${i}`}
                >
                  <Copy size={13} />
                </button>

                <button
                  type="button"
                  className="icon-btn text-danger"
                  onClick={() => removeRecipient(i)}
                  title="Delete row"
                  data-testid={`remove-recipient-${i}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
