import React, { useState } from 'react';
import { Droplet, Loader2, Check } from 'lucide-react';

interface FriendbotFunderProps {
  address: string | null;
  onSuccess?: () => void;
}

export const FriendbotFunder: React.FC<FriendbotFunderProps> = ({ address, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFund = async () => {
    if (!address || loading) return;
    setLoading(true);
    setSuccess(false);

    try {
      const url = `https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`;
      await fetch(url);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.warn('Friendbot error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!address) return null;

  return (
    <button
      data-testid="friendbot-funder-btn"
      onClick={handleFund}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-medium transition-colors"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : success ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Droplet className="w-3.5 h-3.5" />
      )}
      <span>{loading ? 'Funding...' : success ? 'Funded +10k XLM!' : 'Testnet Faucet'}</span>
    </button>
  );
};
