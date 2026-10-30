import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EscrowMath } from '../src/lib/escrow/escrow-math';
import { EscrowAgreementExporter } from '../src/lib/escrow/agreement-exporter';
import { EscrowStatusBadge } from '../src/components/escrow/EscrowStatusBadge';
import { EscrowDashboard } from '../src/components/escrow/EscrowDashboard';
import { EscrowEntity } from '../src/types/escrow';

describe('Batch 10: Escrow & Multi-Sig Dispute Resolution Center', () => {
  const mockEscrow: EscrowEntity = {
    id: 'escrow-test-1',
    title: 'Code Audit Escrow',
    buyer: 'GBBUYER',
    seller: 'GBSELLER',
    arbitrator: 'GBARBITRATOR',
    tokenSymbol: 'USDC',
    totalAmount: 1000,
    releasedAmount: 0,
    deadlineTimestamp: 2000000000,
    status: 'funded',
    milestones: [
      { id: 'm1', title: 'Phase 1', amount: 500, completed: true },
      { id: 'm2', title: 'Phase 2', amount: 500, completed: false },
    ],
    approvals: ['GBBUYER'],
    arbitratorFeeBps: 200, // 2%
    createdAt: 1000,
  };

  it('Item 182: EscrowMath calculates split after arbitrator fee', () => {
    // 1000 USDC total, 2% fee = 20 USDC fee, 980 net
    // 70% to buyer -> 980 * 0.7 = 686 to buyer, 294 to seller
    const award = EscrowMath.calculateArbitratorSplit(1000, 70, 200);
    expect(award.arbitratorFee).toBe(20);
    expect(award.toBuyer).toBe(686);
    expect(award.toSeller).toBe(294);
  });

  it('Item 182: EscrowMath computes milestone percentage', () => {
    const pct = EscrowMath.calculateMilestoneProgress(mockEscrow);
    expect(pct).toBe(50);
  });

  it('Item 195: EscrowStatusBadge renders funded badge', () => {
    render(<EscrowStatusBadge status="funded" />);
    expect(screen.getByTestId('escrow-status-badge')).toBeDefined();
    expect(screen.getByText('funded')).toBeDefined();
  });

  it('Item 196: EscrowAgreementExporter generates legal agreement markdown', () => {
    const md = EscrowAgreementExporter.generateMarkdown(mockEscrow);
    expect(md).toContain('Stellar Escrow Agreement');
    expect(md).toContain('Phase 1');
  });

  it('Item 199: EscrowDashboard mounts cleanly', () => {
    render(<EscrowDashboard />);
    expect(screen.getByTestId('escrow-dashboard')).toBeDefined();
    expect(screen.getByTestId('create-escrow-btn')).toBeDefined();
  });
});
