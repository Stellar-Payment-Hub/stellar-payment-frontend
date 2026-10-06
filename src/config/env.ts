/**
 * Centralized Stellar Network Configuration.
 * Defaults strictly to Stellar Testnet for Level 1.
 */
export const STELLAR_CONFIG = {
  network: import.meta.env.VITE_STELLAR_NETWORK || 'testnet',
  horizonUrl:
    import.meta.env.VITE_STELLAR_HORIZON_URL ||
    'https://horizon-testnet.stellar.org',
  rpcUrl:
    import.meta.env.VITE_STELLAR_RPC_URL ||
    'https://soroban-testnet.stellar.org',
  networkPassphrase:
    import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE ||
    'Test SDF Network ; September 2015',
  explorerUrl:
    import.meta.env.VITE_STELLAR_EXPLORER_URL ||
    'https://stellar.expert/explorer/testnet',
  baseFee: '100', // Base fee in stroops (0.00001 XLM)
  baseReserve: '1.0', // Stellar minimum reserve per account in XLM
} as const;

export type StellarConfig = typeof STELLAR_CONFIG;
