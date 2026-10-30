import { useState, useEffect } from 'react';
import { LiveStreamEntity } from '../types/stream';
import { StreamMath } from '../lib/streaming/stream-math';

export function useLiveStreamAccrual(stream: LiveStreamEntity | null) {
  const [accrued, setAccrued] = useState(0);
  const [withdrawable, setWithdrawable] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!stream) return;
    const tick = () => {
      const now = Date.now();
      setAccrued(StreamMath.calculateAccrued(stream, now));
      setWithdrawable(StreamMath.calculateWithdrawable(stream, now));
      setPercentage(StreamMath.calculatePercentage(stream, now));
    };
    tick();
    const interval = setInterval(tick, 100); // 10 FPS refresh
    return () => clearInterval(interval);
  }, [stream]);

  return { accrued, withdrawable, percentage };
}
