export interface TrustlineBalance {
  assetCode: string;
  issuer?: string;
  balance: string;
  limit: string;
  isNative: boolean;
}

export class TrustlineInspector {
  static parseAccountBalances(rawBalances: any[]): TrustlineBalance[] {
    if (!Array.isArray(rawBalances)) return [];
    return rawBalances.map((b) => ({
      assetCode: b.asset_type === 'native' ? 'XLM' : b.asset_code || 'UNKNOWN',
      issuer: b.asset_issuer,
      balance: b.balance || '0.0000000',
      limit: b.limit || 'unlimited',
      isNative: b.asset_type === 'native',
    }));
  }

  static hasTrustline(balances: TrustlineBalance[], assetCode: string, issuer?: string): boolean {
    return balances.some(
      (b) => b.assetCode === assetCode && (!issuer || b.issuer === issuer)
    );
  }
}
