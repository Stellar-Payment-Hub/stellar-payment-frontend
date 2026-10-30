export type SupportedWalletProvider = 'freighter' | 'albedo' | 'xbull' | 'ledger' | 'dev_key';

export interface WalletSessionState {
  address: string;
  provider: SupportedWalletProvider;
  network: 'PUBLIC' | 'TESTNET' | 'FUTURENET' | 'STANDALONE';
  connectedAt: number;
  expiresAt: number;
  isHardware: boolean;
}

export interface RpcEndpointHealth {
  url: string;
  isPrimary: boolean;
  latencyMs: number;
  lastChecked: number;
  healthy: boolean;
  latestLedger: number;
}
