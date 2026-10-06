import { STELLAR_CONFIG } from '../../config/env';

/**
 * Generate a Stellar Explorer URL for a transaction hash.
 */
export function getExplorerTxUrl(hash: string): string {
  return `${STELLAR_CONFIG.explorerUrl}/tx/${hash}`;
}

/**
 * Generate a Stellar Explorer URL for an account public key.
 */
export function getExplorerAccountUrl(publicKey: string): string {
  return `${STELLAR_CONFIG.explorerUrl}/account/${publicKey}`;
}

/**
 * Truncate a transaction hash or public key for clean display.
 */
export function truncateHash(hash: string, lead = 8, trail = 8): string {
  if (!hash || hash.length <= lead + trail) return hash;
  return `${hash.slice(0, lead)}...${hash.slice(-trail)}`;
}
