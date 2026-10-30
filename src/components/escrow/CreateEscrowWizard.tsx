import React, { useState } from 'react';
import { EscrowEntity, MilestoneItem } from '../../types/escrow';

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEscrow: (escrow: Omit<EscrowEntity, 'id' | 'createdAt' | 'releasedAmount' | 'approvals'>) => void;
}

export const CreateEscrowWizard: React.FC<WizardProps> = ({
  isOpen,
  onClose,
  onCreateEscrow,
}) => {
  const [title, setTitle] = useState('');
  const [seller, setSeller] = useState('');
  const [arbitrator, setArbitrator] = useState('GBARBITRATOR777777777777777777777777777777777777777777');
  const [amount, setAmount] = useState('500');
  const [deadlineDays, setDeadlineDays] = useState('14');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount) || 0;
    const defaultMilestones: MilestoneItem[] = [
      { id: 'm1', title: 'Phase 1: Initial Specification', amount: parsedAmount * 0.4, completed: false },
      { id: 'm2', title: 'Phase 2: Final Verification & Handoff', amount: parsedAmount * 0.6, completed: false },
    ];
    onCreateEscrow({
      title,
      buyer: 'GBBUYER7777777777777777777777777777777777777777777777',
      seller,
      arbitrator,
      tokenSymbol: 'USDC',
      totalAmount: parsedAmount,
      deadlineTimestamp: Math.floor(Date.now() / 1000) + (parseInt(deadlineDays, 10) || 14) * 86400,
      status: 'funded',
      milestones: defaultMilestones,
      arbitratorFeeBps: 200, // 2%
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="create-escrow-wizard">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Multi-Sig Escrow</h3>
          <button type="button" onClick={onClose} className="text-slate-400 font-bold" aria-label="Close">✕</button>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contract Title / Milestone Objective</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Smart Contract Security Audit"
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Seller Public Key</label>
          <input
            type="text"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            placeholder="G..."
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Arbitrator Public Key</label>
          <input
            type="text"
            value={arbitrator}
            onChange={(e) => setArbitrator(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Locked Deposit (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Inspection Window (Days)</label>
            <input
              type="number"
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(e.target.value)}
              min="1"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-500/20"
        >
          Initialize Soroban Escrow Contract
        </button>
      </form>
    </div>
  );
};
