import React from 'react';
import { MilestoneItem } from '../../types/escrow';

interface StepperProps {
  milestones: MilestoneItem[];
  onSelectMilestone?: (milestone: MilestoneItem) => void;
}

export const MilestoneProgressStepper: React.FC<StepperProps> = ({ milestones, onSelectMilestone }) => {
  return (
    <div className="space-y-3" data-testid="milestone-progress-stepper">
      {milestones.map((m, idx) => (
        <div
          key={m.id}
          onClick={() => onSelectMilestone && onSelectMilestone(m)}
          className={`p-3 rounded-xl border flex justify-between items-center text-xs transition-colors cursor-pointer ${
            m.completed
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              m.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {m.completed ? '✓' : idx + 1}
            </span>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{m.title}</div>
              {m.evidenceIpfsHash && (
                <div className="text-[10px] text-slate-400 font-mono">CID: {m.evidenceIpfsHash}</div>
              )}
            </div>
          </div>
          <div className="font-mono font-bold text-slate-800 dark:text-slate-200">${m.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};
