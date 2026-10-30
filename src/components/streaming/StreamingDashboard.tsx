import React, { useState } from 'react';
import { LiveStreamEntity } from '../../types/stream';
import { StreamFlowMeter } from './StreamFlowMeter';
import { StreamCard } from './StreamCard';
import { StreamFilterTabs } from './StreamFilterTabs';
import { StreamTelemetrySummary } from './StreamTelemetrySummary';
import { CreateStreamModal } from './CreateStreamModal';
import { WithdrawStreamModal } from './WithdrawStreamModal';
import { EmptyStreamState } from './EmptyStreamState';

export const StreamingDashboard: React.FC = () => {
  const [streams, setStreams] = useState<LiveStreamEntity[]>([
    {
      id: 'stream-1',
      sender: 'GBALICESENDER7777777777777777777777777777777777777777777',
      recipient: 'GBBOBRECIPIENT7777777777777777777777777777777777777777777',
      token: 'XLM',
      tokenSymbol: 'XLM',
      totalDeposit: 1000,
      withdrawnAmount: 250,
      startTime: Date.now() / 1000 - 3600,
      stopTime: Date.now() / 1000 + 7200,
      cliffTime: 0,
      ratePerSecond: 1000 / 10800,
      status: 'active',
    },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<LiveStreamEntity | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleCreate = (data: any) => {
    const newStream: LiveStreamEntity = {
      id: `stream-${streams.length + 1}`,
      sender: 'GBMYCONNECTEDWALLET7777777777777777777777777777777777777777',
      recipient: data.recipient,
      token: data.token,
      tokenSymbol: data.token,
      totalDeposit: data.amount,
      withdrawnAmount: 0,
      startTime: Date.now() / 1000,
      stopTime: Date.now() / 1000 + data.durationHours * 3600,
      cliffTime: 0,
      ratePerSecond: data.amount / (data.durationHours * 3600),
      status: 'active',
    };
    setStreams((prev) => [newStream, ...prev]);
  };

  const primaryStream = streams[0];

  return (
    <div className="space-y-6" data-testid="streaming-dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Real-Time Payment Streams</h2>
          <p className="text-xs text-slate-500">Continuous linear token flow on Stellar Soroban</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          data-testid="open-create-stream-btn"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-500/20"
        >
          + New Stream
        </button>
      </div>

      <StreamTelemetrySummary activeCount={streams.length} totalLockedXlm={1000} flowRatePerHr={333.3} />

      {primaryStream && <StreamFlowMeter stream={primaryStream} />}

      <StreamFilterTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {streams.length === 0 ? (
        <EmptyStreamState onCreateClick={() => setIsCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {streams.map((s) => (
            <StreamCard
              key={s.id}
              stream={s}
              onWithdraw={() => setWithdrawTarget(s)}
            />
          ))}
        </div>
      )}

      <CreateStreamModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} />
      <WithdrawStreamModal isOpen={!!withdrawTarget} onClose={() => setWithdrawTarget(null)} stream={withdrawTarget} onConfirm={() => {}} />
    </div>
  );
};
