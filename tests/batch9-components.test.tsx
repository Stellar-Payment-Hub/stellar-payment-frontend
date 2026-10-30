import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { EscrowTimer } from '../src/components/escrow/EscrowTimer';
import { EscrowManagementPanel } from '../src/components/escrow/EscrowManagementPanel';
import { DisputeModal } from '../src/components/disputes/DisputeModal';
import { DisputeDashboard } from '../src/components/disputes/DisputeDashboard';
import { ContractAdminPanel } from '../src/components/contracts/ContractAdminPanel';
import { FeeConfigModal } from '../src/components/contracts/FeeConfigModal';
import { GasSimulationPreview } from '../src/components/developer/GasSimulationPreview';
import { DemoModeToggle } from '../src/components/developer/DemoModeToggle';
import { ErrorBoundary } from '../src/components/ui/ErrorBoundary';
import { TrustlineChecker } from '../src/components/wallet/TrustlineChecker';
import { useDraftPersistence } from '../src/hooks/useDraftPersistence';

describe('Batch 9 Frontend Components & Utilities', () => {
  describe('Item 161: EscrowTimer', () => {
    it('renders active lock status and countdown', () => {
      render(<EscrowTimer unlockTimestamp={Date.now() + 3600000} />);
      expect(screen.getByTestId('escrow-timer')).toBeInTheDocument();
      expect(screen.getByTestId('escrow-status-badge')).toHaveTextContent('Locked');
    });

    it('renders claimable status when unlock time has passed', () => {
      render(<EscrowTimer unlockTimestamp={Date.now() - 5000} />);
      expect(screen.getByTestId('escrow-status-badge')).toHaveTextContent('Claimable');
    });
  });

  describe('Item 162: EscrowManagementPanel', () => {
    it('filters escrows and triggers claim action', () => {
      const handleClaim = vi.fn();
      render(<EscrowManagementPanel onClaim={handleClaim} />);

      expect(screen.getByTestId('escrow-management-panel')).toBeInTheDocument();
      const claimBtn = screen.getByTestId('claim-escrow-btn-ESC-102');
      fireEvent.click(claimBtn);
      expect(handleClaim).toHaveBeenCalledWith('ESC-102');
    });
  });

  describe('Item 163: DisputeModal', () => {
    it('submits dispute with selected reason and evidence', () => {
      const handleSubmit = vi.fn();
      render(
        <DisputeModal
          isOpen={true}
          onClose={vi.fn()}
          paymentId="PAY-777"
          onSubmitDispute={handleSubmit}
        />
      );

      const evidenceInput = screen.getByTestId('dispute-evidence-input');
      fireEvent.change(evidenceInput, { target: { value: 'ipfs://QmbWqxBEtngW...' } });

      const submitBtn = screen.getByTestId('submit-dispute-btn');
      fireEvent.click(submitBtn);

      expect(handleSubmit).toHaveBeenCalledWith('PAY-777', expect.any(String), 'ipfs://QmbWqxBEtngW...');
    });
  });

  describe('Item 164: DisputeDashboard', () => {
    it('triggers resolution actions for arbitrators', () => {
      const handleResolve = vi.fn();
      render(<DisputeDashboard onResolve={handleResolve} />);

      const refundBtn = screen.getByTestId('resolve-refund-btn-DSP-001');
      fireEvent.click(refundBtn);
      expect(handleResolve).toHaveBeenCalledWith('DSP-001', 'refund_buyer');
    });
  });

  describe('Item 165: ContractAdminPanel', () => {
    it('toggles pause status', () => {
      const handlePause = vi.fn();
      render(
        <ContractAdminPanel
          isPaused={false}
          onTogglePause={handlePause}
        />
      );

      const pauseBtn = screen.getByTestId('toggle-pause-btn');
      fireEvent.click(pauseBtn);
      expect(handlePause).toHaveBeenCalledWith(true);
    });

    it('triggers TTL extension', () => {
      const handleTtl = vi.fn();
      render(
        <ContractAdminPanel
          onExtendTtl={handleTtl}
        />
      );

      const ttlBtn = screen.getByTestId('extend-ttl-btn');
      fireEvent.click(ttlBtn);
      expect(handleTtl).toHaveBeenCalledWith(100000);
    });
  });

  describe('Item 166: FeeConfigModal', () => {
    it('calculates preview fees dynamically', () => {
      render(
        <FeeConfigModal
          isOpen={true}
          onClose={vi.fn()}
          currentBps={50}
        />
      );

      const bpsInput = screen.getByTestId('fee-bps-input');
      fireEvent.change(bpsInput, { target: { value: '50' } });

      expect(screen.getByTestId('preview-fee-100')).toHaveTextContent('0.5000 XLM');
      expect(screen.getByTestId('preview-fee-1000')).toHaveTextContent('5.0000 XLM');
    });
  });

  describe('Item 167: GasSimulationPreview', () => {
    it('renders CPU and memory usage statistics', () => {
      render(
        <GasSimulationPreview
          cpuInstructions={3500000}
          memoryBytes={2048000}
          estimatedFeeStroops={5000}
        />
      );

      expect(screen.getByTestId('sim-cpu-val')).toHaveTextContent('3,500,000');
      expect(screen.getByTestId('sim-fee-val')).toHaveTextContent('5000 Stroops');
    });
  });

  describe('Item 168: DemoModeToggle', () => {
    it('toggles demo state on click', () => {
      const handleToggle = vi.fn();
      render(<DemoModeToggle isDemoMode={false} onToggle={handleToggle} />);

      const toggleBtn = screen.getByTestId('demo-toggle-btn');
      fireEvent.click(toggleBtn);
      expect(handleToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('Item 171: ErrorBoundary', () => {
    it('renders fallback UI when child throws error', () => {
      const ThrowingComponent = () => {
        throw new Error('Test component crash');
      };

      // Suppress console.error in this test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(screen.getByText(/Test component crash/i)).toBeInTheDocument();
      spy.mockRestore();
    });
  });

  describe('Item 173: TrustlineChecker', () => {
    it('identifies missing trustlines and triggers setup', () => {
      const handleAdd = vi.fn();
      render(
        <TrustlineChecker
          balances={[{ asset_code: 'USDC' }]}
          onEstablishTrustline={handleAdd}
        />
      );

      // USDC is active
      expect(screen.getByTestId('trustline-row-USDC')).toHaveTextContent('Active');

      // EURC needs trustline
      const eurcBtn = screen.getByTestId('add-trustline-EURC');
      fireEvent.click(eurcBtn);
      expect(handleAdd).toHaveBeenCalledWith('EURC');
    });
  });

  describe('Item 177: useDraftPersistence', () => {
    it('persists and clears draft state from localStorage', () => {
      const store: Record<string, string> = {};
      vi.stubGlobal('localStorage', {
        getItem: vi.fn((k: string) => store[k] || null),
        setItem: vi.fn((k: string, v: string) => { store[k] = v; }),
        removeItem: vi.fn((k: string) => { delete store[k]; }),
        clear: vi.fn(() => {}),
      });

      const { result } = renderHook(() =>
        useDraftPersistence('test_form', { memo: 'draft note' })
      );

      expect(result.current[0].memo).toBe('draft note');

      act(() => {
        result.current[1]({ memo: 'updated note' });
      });

      expect(result.current[0].memo).toBe('updated note');

      act(() => {
        result.current[2](); // clear
      });

      expect(result.current[0].memo).toBe('draft note');
      vi.unstubAllGlobals();
    });
  });
});
