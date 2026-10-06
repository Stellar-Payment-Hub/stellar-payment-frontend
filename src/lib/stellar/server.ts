import { Horizon } from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../../config/env';

/**
 * Singleton instance of Horizon Server configured for Stellar Testnet.
 */
let horizonServerInstance: Horizon.Server | null = null;

export function getHorizonServer(): Horizon.Server {
  if (!horizonServerInstance) {
    horizonServerInstance = new Horizon.Server(STELLAR_CONFIG.horizonUrl, {
      allowHttp: false,
    });
  }
  return horizonServerInstance;
}

/**
 * Fetch the current base fee recommended by the Horizon Testnet server.
 * Falls back to 100 stroops (0.00001 XLM).
 */
export async function getBaseFee(): Promise<string> {
  try {
    const server = getHorizonServer();
    const feeStats = await server.feeStats();
    if (feeStats && feeStats.min_accepted_fee) {
      return feeStats.min_accepted_fee;
    }
  } catch (err) {
    console.warn('[Horizon] Falling back to default base fee:', err);
  }
  return STELLAR_CONFIG.baseFee;
}
