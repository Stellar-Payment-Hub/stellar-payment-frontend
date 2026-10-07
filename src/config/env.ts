/**
 * Centralized Stellar Network Configuration.
 * Configured strictly for Stellar Testnet.
 */
export const STELLAR_CONFIG = {
  network: import.meta.env.VITE_STELLAR_NETWORK || 'testnet',
  horizonUrl:
    import.meta.env.VITE_STELLAR_HORIZON_URL ||
    'https://horizon-testnet.stellar.org',
  rpcUrl:
    import.meta.env.VITE_STELLAR_RPC_URL ||
    'https://soroban-testnet.stellar.org',
  sorobanRpcUrl:
    import.meta.env.VITE_STELLAR_RPC_URL ||
    'https://soroban-testnet.stellar.org',
  networkPassphrase:
    import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE ||
    'Test SDF Network ; September 2015',
  explorerUrl:
    import.meta.env.VITE_STELLAR_EXPLORER_URL ||
    'https://stellar.expert/explorer/testnet',
  explorerTxUrl: 'https://stellar.expert/explorer/testnet/tx',
  explorerAccountUrl: 'https://stellar.expert/explorer/testnet/account',
  explorerContractUrl: 'https://stellar.expert/explorer/testnet/contract',
  baseFee: '100', // Base fee in stroops (0.00001 XLM)
  baseReserve: '1.0', // Stellar minimum reserve per account in XLM
  contractId:
    import.meta.env.VITE_STELLAR_CONTRACT_ID ||
    'CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S',
  settlementContractId:
    import.meta.env.VITE_STELLAR_SETTLEMENT_CONTRACT_ID ||
    'CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E',
  backendUrl:
    import.meta.env.VITE_BACKEND_URL ||
    'http://localhost:4000',
} as const;

export type StellarConfig = typeof STELLAR_CONFIG;
