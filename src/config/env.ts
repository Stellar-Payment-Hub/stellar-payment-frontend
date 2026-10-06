/**
 * Centralized Stellar Network Configuration.
 * Configured strictly for Stellar Testnet in Level 1 & Level 2.
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
  contractId:
    import.meta.env.VITE_STELLAR_CONTRACT_ID ||
    'CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY',
  backendUrl:
    import.meta.env.VITE_BACKEND_URL ||
    'http://localhost:4000',
} as const;

export type StellarConfig = typeof STELLAR_CONFIG;
