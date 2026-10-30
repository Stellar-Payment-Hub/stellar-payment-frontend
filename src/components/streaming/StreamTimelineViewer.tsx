import React from 'react';
import { LiveStreamEntity } from '../../types/stream';

interface TimelineProps {
  stream: LiveStreamEntity;
}

export const StreamTimelineViewer: React.FC<TimelineProps> = ({ stream }) => {
  return (
    <div className="flex justify-between items-center text-xs font-mono text-slate-500 py-2 border-t border-slate-100 dark:border-slate-800" data-testid="stream-timeline-viewer">
      <div>Start: {new Date(stream.startTime * 1000).toLocaleDateString()}</div>
      {stream.cliffTime > 0 && <div className="text-amber-500 font-semibold">Cliff Milestone</div>}
      <div>End: {new Date(stream.stopTime * 1000).toLocaleDateString()}</div>
    </div>
  );
};
