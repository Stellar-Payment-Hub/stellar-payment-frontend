import { ShieldCheck, Plus, Check } from 'lucide-react';

interface TrustlineCheckerProps {
  balances?: Array<{ asset_code?: string; asset_issuer?: string }>;
  onEstablishTrustline?: (asset: string) => void;
}

const SUPPORTED_ASSETS = [
  { code: 'USDC', issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN' },
  { code: 'EURC', issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN' },
];

export function TrustlineChecker({
  balances = [],
  onEstablishTrustline,
}: TrustlineCheckerProps) {
  const hasTrustline = (code: string) => {
    return balances.some((b) => b.asset_code === code);
  };

  return (
    <div
      className="card"
      data-testid="trustline-checker"
      style={{
        padding: '0.85rem 1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <ShieldCheck size={16} className="text-cyan-400" />
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Asset Trustline Status</h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {SUPPORTED_ASSETS.map((asset) => {
          const established = hasTrustline(asset.code);
          return (
            <div
              key={asset.code}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.4rem 0.65rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
              }}
              data-testid={`trustline-row-${asset.code}`}
            >
              <div>
                <span style={{ fontWeight: 700 }}>{asset.code}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block' }}>
                  Issuer: {asset.issuer.substring(0, 6)}...
                </span>
              </div>

              {established ? (
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  <Check size={11} /> Active
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEstablishTrustline && onEstablishTrustline(asset.code)}
                  data-testid={`add-trustline-${asset.code}`}
                >
                  <Plus size={12} /> Add Trustline
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
