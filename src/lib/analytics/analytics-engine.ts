import { AssetDistribution, VolumeTimeseriesPoint } from '../../types/analytics';

export class AnalyticsEngine {
  static calculateTotalVolume(points: VolumeTimeseriesPoint[]): number {
    return points.reduce((sum, p) => sum + p.volumeUsd, 0);
  }

  static calculateAssetPercentages(
    assets: { assetCode: string; amount: number; priceUsd: number }[]
  ): AssetDistribution[] {
    const totalUsd = assets.reduce((sum, a) => sum + a.amount * a.priceUsd, 0);
    return assets.map((a) => {
      const valueUsd = a.amount * a.priceUsd;
      const percentage = totalUsd > 0 ? (valueUsd / totalUsd) * 100 : 0;
      return {
        assetCode: a.assetCode,
        amount: a.amount,
        valueUsd,
        percentage: Math.round(percentage * 10) / 10,
      };
    });
  }

  static calculateCumulativeStellarSavings(txCount: number, avgTraditionalFeeUsd = 2.5): number {
    const stellarCost = txCount * 0.00001;
    const traditionalCost = txCount * avgTraditionalFeeUsd;
    return Math.max(0, traditionalCost - stellarCost);
  }
}
