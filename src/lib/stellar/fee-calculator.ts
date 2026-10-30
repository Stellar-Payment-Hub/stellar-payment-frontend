export type FeeTier = 'normal' | 'urgent' | 'custom';

export interface FeeOption {
  tier: FeeTier;
  stroops: number;
  xlm: string;
  estimatedTimeSec: number;
}

export class FeeCalculator {
  static getFeeOptions(baseStroops = 100): FeeOption[] {
    return [
      { tier: 'normal', stroops: baseStroops, xlm: (baseStroops / 10_000_000).toFixed(6), estimatedTimeSec: 5 },
      { tier: 'urgent', stroops: baseStroops * 5, xlm: ((baseStroops * 5) / 10_000_000).toFixed(6), estimatedTimeSec: 2 },
    ];
  }
}
