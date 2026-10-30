import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddressInput } from '../src/components/ui/AddressInput';
import { CopyButton } from '../src/components/ui/CopyButton';

describe('AddressInput & CopyButton Components', () => {
  it('detects valid Stellar ed25519 address', () => {
    const fn = vi.fn();
    render(<AddressInput value="GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5" onChange={fn} />);
    const input = screen.getByTestId('stellar-address-input');
    fireEvent.blur(input);
    expect(screen.getByText('Valid Public Key')).toBeDefined();
  });

  it('renders copy button and handles click', () => {
    render(<CopyButton text="TestCopyText" label="Copy" />);
    const btn = screen.getByTestId('copy-btn');
    expect(btn).toBeDefined();
    fireEvent.click(btn);
  });
});
