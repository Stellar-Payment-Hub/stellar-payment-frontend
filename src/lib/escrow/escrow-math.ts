import { EscrowEntity } from '../../types/escrow';

export class EscrowMath {
  static calculateArbitratorSplit(
    totalLocked: number,
    buyerPct: number,
    arbitratorFeeBps: number
  ): { toBuyer: number; toSeller: number; arbitratorFee: number } {
    const feeRatio = arbitratorFeeBps / 10000;
    const arbitratorFee = totalLocked * feeRatio;
    const netDisbursable = totalLocked - arbitratorFee;
    const toBuyer = (netDisbursable * buyerPct) / 100;
    const toSeller = Math.max(0, netDisbursable - toBuyer);
    return { toBuyer, toSeller, arbitratorFee };
  }

  static calculateMilestoneProgress(escrow: EscrowEntity): number {
    if (!escrow.milestones.length) return 0;
    const completed = escrow.milestones.filter((m) => m.completed).length;
    return Math.round((completed / escrow.milestones.length) * 100);
  }

  static isOverdue(escrow: EscrowEntity, nowSec = Date.now() / 1000): boolean {
    return nowSec > escrow.deadlineTimestamp && escrow.status === 'funded';
  }
}
