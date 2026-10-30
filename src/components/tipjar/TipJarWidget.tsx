import { useState } from 'react';
import { Heart, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface TipJarWidgetProps {
  recipientAddress: string;
  onTipSubmitted?: (amount: string, memo: string) => Promise<void> | void;
}

const PRESETS = [
  { amount: '1', label: 'Coffee', emoji: '☕' },
  { amount: '5', label: 'Pizza', emoji: '🍕' },
  { amount: '20', label: 'Rocket', emoji: '🚀' },
  { amount: '50', label: 'Diamond', emoji: '💎' },
];

const EMOJIS = ['☕', '🍕', '🚀', '💎', '❤️', '🔥', '⚡'];

export function TipJarWidget({ recipientAddress, onTipSubmitted }: TipJarWidgetProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('5');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('☕');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const finalAmount = customAmount ? customAmount : selectedPreset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAddress || parseFloat(finalAmount) <= 0) return;

    setLoading(true);
    try {
      const fullMemo = `${selectedEmoji} ${message.trim() || 'Tip via Stellar Hub'}`.substring(0, 28);
      if (onTipSubmitted) {
        await onTipSubmitted(finalAmount, fullMemo);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
      setMessage('');
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" data-testid="tipjar-widget">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div className="icon-badge icon-badge-purple">
          <Heart size={18} />
        </div>
        <div>
          <h3 className="card-title" style={{ fontSize: '1rem', margin: 0 }}>Creator Tip Jar</h3>
          <p className="card-subtitle">Instant micro-tipping with zero platform fees</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Preset Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
          {PRESETS.map((p) => {
            const isSelected = !customAmount && selectedPreset === p.amount;
            return (
              <button
                key={p.amount}
                type="button"
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => {
                  setSelectedPreset(p.amount);
                  setCustomAmount('');
                  setSelectedEmoji(p.emoji);
                }}
                data-testid={`tip-preset-${p.amount}`}
                style={{ flexDirection: 'column', padding: '0.4rem 0.2rem', height: 'auto' }}
              >
                <span style={{ fontSize: '1.2rem' }}>{p.emoji}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{p.amount} XLM</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Amount */}
        <div>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
            Or Custom Amount (XLM)
          </label>
          <input
            type="number"
            step="any"
            className="input-field"
            placeholder="e.g. 15.5"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            data-testid="tip-custom-amount-input"
          />
        </div>

        {/* Emoji Selector */}
        <div>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
            Choose Emoji Reaction
          </label>
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                data-testid={`emoji-reaction-${emoji}`}
                style={{
                  background: selectedEmoji === emoji ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedEmoji === emoji ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
            Support Note (Optional)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Keep up the great work!"
            maxLength={24}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            data-testid="tip-message-input"
          />
        </div>

        {success && (
          <div className="alert alert-success" data-testid="tip-success-alert">
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>Thank you! Your tip of {finalAmount} XLM was submitted successfully.</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || parseFloat(finalAmount) <= 0}
          data-testid="submit-tip-btn"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Submitting Tip...
            </>
          ) : (
            <>
              <Send size={15} /> Send {finalAmount} XLM Tip
            </>
          )}
        </button>
      </form>
    </div>
  );
}
