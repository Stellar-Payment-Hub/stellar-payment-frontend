import { LiveStreamEntity } from '../../types/stream';

export class StreamMath {
  static calculateAccrued(stream: LiveStreamEntity, currentTimestampMs = Date.now()): number {
    if (stream.status === 'cancelled' || stream.status === 'completed') {
      return stream.withdrawnAmount;
    }
    const nowSec = currentTimestampMs / 1000;
    if (stream.cliffTime > 0 && nowSec < stream.cliffTime) {
      return 0;
    }
    if (nowSec >= stream.stopTime) {
      return stream.totalDeposit;
    }
    const elapsedSec = Math.max(0, nowSec - stream.startTime);
    const accrued = elapsedSec * stream.ratePerSecond;
    return Math.min(stream.totalDeposit, accrued);
  }

  static calculateWithdrawable(stream: LiveStreamEntity, currentTimestampMs = Date.now()): number {
    const accrued = this.calculateAccrued(stream, currentTimestampMs);
    return Math.max(0, accrued - stream.withdrawnAmount);
  }

  static calculatePercentage(stream: LiveStreamEntity, currentTimestampMs = Date.now()): number {
    const accrued = this.calculateAccrued(stream, currentTimestampMs);
    if (stream.totalDeposit <= 0) return 0;
    return Math.min(100, (accrued / stream.totalDeposit) * 100);
  }
}
