import { useState } from 'react';
import { STELLAR_CONFIG } from '../../config/env';
import { ContractReader } from '../contracts/ContractReader';
import { Code2, Copy, Check, ExternalLink, Sparkles, Send } from 'lucide-react';

export function DeveloperTestnetView() {
  const [copiedContract, setCopiedContract] = useState(false);
  const [customFundAddress, setCustomFundAddress] = useState('');
  const [fundStatus, setFundStatus] = useState<string | null>(null);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(STELLAR_CONFIG.contractId);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleFundCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFundAddress.trim()) return;

    setFundStatus('Funding in progress via Friendbot...');
    try {
      const res = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(customFundAddress.trim())}`
      );
      if (res.ok) {
        setFundStatus('Successfully credited 10,000 Testnet XLM!');
      } else {
        setFundStatus('Friendbot responded with an error or account already funded.');
      }
    } catch {
      setFundStatus('Failed to connect to Friendbot.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} data-testid="developer-view">
      {/* Contract & RPC Configuration Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="icon-badge icon-badge-cyan">
              <Code2 size={18} />
            </div>
            <div>
              <h3 className="card-title">Developer & Testnet Hub</h3>
              <p className="card-subtitle">Soroban PaymentRegistry Contract Metadata</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Soroban Contract ID
            </span>
            <p className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', wordBreak: 'break-all', margin: '0.5rem 0' }}>
              {STELLAR_CONFIG.contractId}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopyContract}
                style={{ fontSize: '0.75rem' }}
              >
                {copiedContract ? <Check size={12} className="text-cyan-400" /> : <Copy size={12} />}
                <span style={{ marginLeft: '0.25rem' }}>{copiedContract ? 'Copied' : 'Copy ID'}</span>
              </button>
              <a
                href={`${STELLAR_CONFIG.explorerContractUrl}/${STELLAR_CONFIG.contractId}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Contract Explorer <ExternalLink size={12} style={{ marginLeft: '0.25rem' }} />
              </a>
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Testnet Network Specs
            </span>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>RPC: <span className="mono-text" style={{ color: 'var(--text-primary)' }}>{STELLAR_CONFIG.sorobanRpcUrl}</span></div>
              <div>Horizon: <span className="mono-text" style={{ color: 'var(--text-primary)' }}>{STELLAR_CONFIG.horizonUrl}</span></div>
              <div>Passphrase: <span className="mono-text" style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>Test SDF Network ; September 2015</span></div>
            </div>
          </div>
        </div>

        {/* Friendbot Utility */}
        <div style={{ marginTop: '1.25rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} className="text-cyan-400" />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Testnet Friendbot Airdrop</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Fund any public key with 10,000 Testnet XLM directly from the Stellar Friendbot service.
          </p>
          <form onSubmit={handleFundCustom} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Enter Stellar G... address"
              value={customFundAddress}
              onChange={(e) => setCustomFundAddress(e.target.value)}
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-secondary btn-sm" disabled={!customFundAddress.trim()}>
              <Send size={12} style={{ marginRight: '0.3rem' }} /> Fund 10k XLM
            </button>
          </form>
          {fundStatus && (
            <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', marginTop: '0.5rem' }}>
              {fundStatus}
            </div>
          )}
        </div>
      </div>

      {/* Contract Read Operations Tool */}
      <ContractReader />
    </div>
  );
}
