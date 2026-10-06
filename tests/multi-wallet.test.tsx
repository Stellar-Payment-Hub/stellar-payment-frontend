import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletSelectModal } from '../src/components/wallet/WalletSelectModal';

describe('Multi-Wallet Select Modal', () => {
  it('renders all supported wallet options when open', () => {
    render(
      <WalletSelectModal
        isOpen={true}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        isConnecting={false}
      />
    );

    expect(screen.getByTestId('wallet-select-modal')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-option-freighter')).toHaveTextContent('Freighter');
    expect(screen.getByTestId('wallet-option-albedo')).toHaveTextContent('Albedo');
    expect(screen.getByTestId('wallet-option-xbull')).toHaveTextContent('xBull');
  });

  it('triggers onSelect with selected wallet id', () => {
    const handleSelect = vi.fn();
    render(
      <WalletSelectModal
        isOpen={true}
        onClose={vi.fn()}
        onSelect={handleSelect}
        isConnecting={false}
      />
    );

    const albedoBtn = screen.getByTestId('wallet-option-albedo').querySelector('button');
    if (albedoBtn) {
      fireEvent.click(albedoBtn);
      expect(handleSelect).toHaveBeenCalledWith('albedo');
    }
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <WalletSelectModal
        isOpen={false}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        isConnecting={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
