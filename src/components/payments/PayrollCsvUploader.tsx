import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { isValidAddress } from '../../lib/validation/payment';

export interface ParsedCsvRecipient {
  address: string;
  amount: string;
  memo?: string;
  isValid: boolean;
  error?: string;
}

interface PayrollCsvUploaderProps {
  onLoaded: (recipients: ParsedCsvRecipient[]) => void;
  maxRows?: number;
}

export function PayrollCsvUploader({ onLoaded, maxRows = 100 }: PayrollCsvUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<{
    total: number;
    valid: number;
    invalid: number;
    totalAmount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processCsvText = (text: string) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Check if line 0 is a header (contains "address" or "recipient")
    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    if (firstLineLower.includes('address') || firstLineLower.includes('recipient')) {
      startIndex = 1;
    }

    const parsed: ParsedCsvRecipient[] = [];
    let validCount = 0;
    let sumAmount = 0;

    for (let i = startIndex; i < lines.length && parsed.length < maxRows; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 2) continue;

      const address = parts[0] || '';
      const amountStr = parts[1] || '0';
      const memo = parts[2] || undefined;

      const validAddr = isValidAddress(address);
      const parsedAmt = parseFloat(amountStr);
      const validAmt = !isNaN(parsedAmt) && parsedAmt > 0;

      let errorMsg: string | undefined;
      if (!validAddr) errorMsg = 'Invalid Stellar G... address';
      else if (!validAmt) errorMsg = 'Invalid amount';

      const isValid = validAddr && validAmt;
      if (isValid) {
        validCount++;
        sumAmount += parsedAmt;
      }

      parsed.push({
        address,
        amount: amountStr,
        memo,
        isValid,
        error: errorMsg,
      });
    }

    setResults({
      total: parsed.length,
      valid: validCount,
      invalid: parsed.length - validCount,
      totalAmount: sumAmount,
    });

    onLoaded(parsed);
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      alert('Please upload a valid .csv file');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) processCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const resetUpload = () => {
    setFileName(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onLoaded([]);
  };

  return (
    <div className="card" data-testid="payroll-csv-uploader">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} className="text-cyan-400" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Batch Payroll CSV Ingestion</h4>
        </div>
        {fileName && (
          <button type="button" className="icon-btn" onClick={resetUpload} aria-label="Clear CSV">
            <X size={15} />
          </button>
        )}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="drop-zone"
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.01)',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          data-testid="csv-file-input"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <UploadCloud size={32} className="text-cyan-400" style={{ margin: '0 auto 0.5rem auto' }} />
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {fileName ? fileName : 'Drag & drop your payroll CSV file, or click to browse'}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Expected CSV format: <code>address,amount,memo</code> (up to {maxRows} entries)
        </p>
      </div>

      {results && (
        <div
          data-testid="csv-results-summary"
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> {results.valid} Valid Rows
            </span>
            {results.invalid > 0 && (
              <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={13} /> {results.invalid} Invalid
              </span>
            )}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Total: {results.totalAmount.toFixed(4)} XLM
          </span>
        </div>
      )}
    </div>
  );
}
