import { SubscriptionCadence } from '../../types/subscription';

export class CadenceCalculator {
  static getCadenceSeconds(cadence: SubscriptionCadence): number {
    switch (cadence) {
      case 'daily':
        return 86400;
      case 'weekly':
        return 604800;
      case 'monthly':
        return 2592000; // 30 days
      case 'annual':
        return 31536000; // 365 days
      default:
        return 2592000;
    }
  }

  static getNextChargeDate(fromTimestampMs: number, cadence: SubscriptionCadence): Date {
    const seconds = this.getCadenceSeconds(cadence);
    return new Date(fromTimestampMs + seconds * 1000);
  }

  static calculateProration(
    currentPlanAmount: number,
    newPlanAmount: number,
    elapsedSeconds: number,
    totalEpochSeconds: number
  ): number {
    if (totalEpochSeconds <= 0) return 0;
    const remainingRatio = Math.max(0, 1 - (elapsedSeconds / totalEpochSeconds));
    const credit = currentPlanAmount * remainingRatio;
    const charge = newPlanAmount * remainingRatio;
    return Math.max(0, charge - credit);
  }

  static isOverdue(nextChargeTimestamp: number, gracePeriodSeconds = 86400): boolean {
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= nextChargeTimestamp + gracePeriodSeconds;
  }
}
