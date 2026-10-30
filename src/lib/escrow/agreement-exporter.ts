import { EscrowEntity } from '../../types/escrow';

export class EscrowAgreementExporter {
  static generateMarkdown(escrow: EscrowEntity): string {
    return [
      `# Stellar Escrow Agreement #${escrow.id}`,
      `**Title**: ${escrow.title}`,
      `**Total Commitment**: ${escrow.totalAmount} ${escrow.tokenSymbol}`,
      `**Buyer**: ${escrow.buyer}`,
      `**Seller**: ${escrow.seller}`,
      `**Arbitrator**: ${escrow.arbitrator}`,
      `**Deadline**: ${new Date(escrow.deadlineTimestamp * 1000).toISOString()}`,
      `**Status**: ${escrow.status}`,
      '\n## Milestone Schedules',
      ...escrow.milestones.map((m) => `- [${m.completed ? 'x' : ' '}] ${m.title} (${m.amount} ${escrow.tokenSymbol})`),
    ].join('\n');
  }
}
