import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiWalletModal } from '../src/components/wallet/MultiWalletModal';
import { NetworkSelector } from '../src/components/wallet/NetworkSelector';
import { FederationResolver } from '../src/lib/wallet/federation-resolver';
import { SorobanDiagnosticsDecoder } from '../src/lib/stellar/soroban-diagnostics';
import { TrustlineInspector } from '../src/lib/stellar/trustlines';

describe('Batch 7: Advanced Wallet Hub & RPC Diagnostics', () => {
  it('Item 124: MultiWalletModal renders provider choices and emits selection', () => {
    const onSelect = vi.fn();
    render(<MultiWalletModal isOpen={true} onClose={() => {}} onSelect={onSelect} />);
    expect(screen.getByTestId('multi-wallet-modal')).toBeDefined();
    fireEvent.click(screen.getByTestId('wallet-provider-freighter'));
    expect(onSelect).toHaveBeenCalledWith('freighter');
  });

  it('Item 125: NetworkSelector toggles active environment', () => {
    const onSelect = vi.fn();
    render(<NetworkSelector activeNetwork="TESTNET" onSelectNetwork={onSelect} />);
    fireEvent.click(screen.getByTestId('network-btn-PUBLIC'));
    expect(onSelect).toHaveBeenCalledWith('PUBLIC');
  });

  it('Item 129: TrustlineInspector parses balances correctly', () => {
    const parsed = TrustlineInspector.parseAccountBalances([
      { asset_type: 'native', balance: '100.5' },
      { asset_type: 'credit_alphanum4', asset_code: 'USDC', balance: '50.0' },
    ]);
    expect(parsed.length).toBe(2);
    expect(parsed[0].assetCode).toBe('XLM');
    expect(parsed[1].assetCode).toBe('USDC');
  });

  it('Item 131: SorobanDiagnosticsDecoder maps error codes to titles', () => {
    const decoded = SorobanDiagnosticsDecoder.decodeError('Transaction failed: Error(Contract, #24)');
    expect(decoded.code).toBe(24);
    expect(decoded.title).toBe('Insufficient Allowance');
  });

  it('Item 133: FederationResolver parses user*domain handles', async () => {
    expect(FederationResolver.isFederationAddress('alice*stellar.org')).toBe(true);
    expect(FederationResolver.isFederationAddress('invalidaddress')).toBe(false);
    const res = await FederationResolver.resolve('bob*centre.io');
    expect(res?.accountId.startsWith('G')).toBe(true);
  });
});
