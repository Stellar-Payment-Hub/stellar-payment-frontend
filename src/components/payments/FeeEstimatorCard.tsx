import React from 'react';
import { Fuel } from 'lucide-react';

interface FeeEstimatorCardProps {
  estimatedStroops?: number;
  operationCount?: number;
}

export const FeeEstimatorCard: React.FC<FeeEstimatorCardProps> = ({
  estimatedStroops = 100,
  operationCount = 1,
}) => {
  const totalStroops = estimatedStroops * operationCount;
  const inXlm = (totalStroops / 10000000).toFixed(7);

  return (
    <div
      data-testid="fee-estimator-card"
      className="bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs my-2 text-slate-400"
    >
      <div className="flex items-center gap-1.5">
        <Fuel className="w-3.5 h-3.5 text-amber-400" />
        <span>Estimated Network Fee:</span>
      </div>
      <div className="font-mono text-slate-200">
        <strong>{inXlm} XLM</strong> <span className="text-slate-500">({totalStroops} Stroops)</span>
      </div>
    </div>
  );
};
