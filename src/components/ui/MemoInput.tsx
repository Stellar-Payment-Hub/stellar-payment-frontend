import { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';

interface MemoInputProps {
  value: string;
  onChange: (value: string) => void;
  maxBytes?: number;
  placeholder?: string;
  disabled?: boolean;
}

export function MemoInput({
  value,
  onChange,
  maxBytes = 28,
  placeholder = 'Optional transaction memo...',
  disabled = false,
}: MemoInputProps) {
  const byteCount = useMemo(() => {
    return new TextEncoder().encode(value).length;
  }, [value]);

  const isExceeded = byteCount > maxBytes;
  const isNearLimit = byteCount >= maxBytes - 6 && !isExceeded;

  let counterColor = 'var(--text-muted)';
  if (isExceeded) counterColor = 'var(--danger)';
  else if (isNearLimit) counterColor = 'var(--warning)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Stellar Transaction Memo (MEMO_TEXT)
        </label>
        <span
          data-testid="memo-byte-counter"
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: counterColor,
          }}
        >
          {byteCount} / {maxBytes} bytes
        </span>
      </div>

      <input
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        data-testid="memo-input"
        style={{
          borderColor: isExceeded ? 'var(--danger)' : undefined,
        }}
      />

      {isExceeded && (
        <div
          data-testid="memo-error-alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--danger)',
            fontSize: '0.7rem',
            marginTop: '0.15rem',
          }}
        >
          <AlertCircle size={12} />
          <span>Memo exceeds Stellar 28-byte protocol limit ({byteCount} bytes used).</span>
        </div>
      )}
    </div>
  );
}
