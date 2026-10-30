import { CurrencyCode, CurrencyQuote } from '../../types/remittance';

export const BASE_RATES: Record<string, number> = {
  'USDC-NGN': 1600.5,
  'USDC-EURC': 0.92,
  'USDC-BRL': 5.65,
  'USDC-PHP': 58.2,
  'USDC-ARS': 1250.0,
  'XLM-USDC': 0.12,
  'EURC-USDC': 1.087,
};

export class FxRateEngine {
  static getRate(from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return 1.0;
    const pair = `${from}-${to}`;
    if (BASE_RATES[pair]) return BASE_RATES[pair];
    const reversePair = `${to}-${from}`;
    if (BASE_RATES[reversePair]) return 1 / BASE_RATES[reversePair];
    return 1.0;
  }

  static generateQuote(from: CurrencyCode, to: CurrencyCode, _sourceAmount: number): CurrencyQuote {
    const rate = this.getRate(from, to);
    const stellarFeeUsd = 0.00001;
    const bankFeeUsd = 45.0; // Typical wire transfer cost
    const savingsUsd = bankFeeUsd - stellarFeeUsd;
    return {
      sourceCurrency: from,
      targetCurrency: to,
      exchangeRate: rate,
      stellarFeeUsd,
      bankFeeUsd,
      savingsUsd,
      expiresAt: Date.now() + 60000,
    };
  }

  static calculateDestinationAmount(sourceAmount: number, rate: number): number {
    return sourceAmount * rate;
  }
}
