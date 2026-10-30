import { describe, it, expect } from 'vitest';
import { PRESET_DEV_ACCOUNTS, getDevAccount } from '../src/lib/wallet/dev-wallet';

describe('Dev Keypair Sandbox', () => {
  it('provides 3 preset testnet personas with valid public keys', () => {
    expect(PRESET_DEV_ACCOUNTS.length).toBe(3);
    expect(PRESET_DEV_ACCOUNTS[0].publicKey.startsWith('G')).toBe(true);
  });

  it('retrieves account details by public key', () => {
    const acc = getDevAccount('GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');
    expect(acc).toBeDefined();
    expect(acc?.name).toContain('Alice');
  });
});
