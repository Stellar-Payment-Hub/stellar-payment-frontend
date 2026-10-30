import React, { useState } from 'react';
import { EscrowEntity } from '../../types/escrow';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { MilestoneProgressStepper } from './MilestoneProgressStepper';
import { CreateEscrowWizard } from './CreateEscrowWizard';
import { ArbitrationSplitSlider } from './ArbitrationSplitSlider';
import { EscrowCountdownTimer } from './EscrowCountdownTimer';
import { AuditVerificationBadge } from './AuditVerificationBadge';

export const EscrowDashboard: React.FC = () => {
  const [escrows, setEscrows] = useState<EscrowEntity[]>([
    {
      id: 'escrow-42',
      title: 'Soroban DEX Liquidity Router Development',
      buyer: 'GBBUYER7777777777777777777777777777777777777777777777',
      seller: 'GBSELLER77777777777777777777777777777777777777777777',
      arbitrator: 'GBARBITRATOR7777777777777777777777777777777777777777',
      tokenSymbol: 'USDC',
      totalAmount: 1200,
      releasedAmount: 480,
      deadlineTimestamp: Date.now() / 1000 + 86400 * 7,
      status: 'funded',
      milestones: [
        { id: 'm1', title: 'Phase 1: Architecture Spec', amount: 480, completed: true, evidenceIpfsHash: 'QmPhase1Done' },
        { id: 'm2', title: 'Phase 2: Contract Implementation', amount: 720, completed: false },
      ],
      approvals: ['GBBUYER7777777777777777777777777777777777777777777777'],
      arbitratorFeeBps: 200,
      createdAt: Date.now() / 1000 - 86400 * 3,
    },
  ]);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [splitTarget, setSplitTarget] = useState<EscrowEntity | null>(null);

  return (
    <div className="space-y-6" data-testid="escrow-dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Escrow & Arbitration Hub</h2>
          <p className="text-xs text-slate-500">2-of-3 Multi-Sig protection for milestone settlements</p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          data-testid="create-escrow-btn"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
        >
          + Create Escrow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AuditVerificationBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {escrows.map((e) => (
          <div key={e.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-mono">Escrow #{e.id}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{e.title}</h3>
              </div>
              <EscrowStatusBadge status={e.status} />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg font-mono">
                {e.totalAmount} {e.tokenSymbol}
              </span>
              <EscrowCountdownTimer deadlineTimestamp={e.deadlineTimestamp} />
            </div>

            <MilestoneProgressStepper milestones={e.milestones} />

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSplitTarget(e)}
                className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Arbitration Judgment
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateEscrowWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCreateEscrow={(e) => setEscrows((prev) => [...prev, { ...e, id: `escrow-${Date.now()}`, createdAt: Date.now() / 1000, releasedAmount: 0, approvals: [] }])}
      />

      <ArbitrationSplitSlider
        isOpen={!!splitTarget}
        onClose={() => setSplitTarget(null)}
        totalAmount={splitTarget?.totalAmount || 0}
        arbitratorFeeBps={splitTarget?.arbitratorFeeBps || 200}
        tokenSymbol={splitTarget?.tokenSymbol || 'USDC'}
        onConfirmAward={() => {}}
      />
    </div>
  );
};
