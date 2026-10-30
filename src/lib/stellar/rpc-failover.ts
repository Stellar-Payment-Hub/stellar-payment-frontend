import { RpcEndpointHealth } from '../../types/wallet-hub';

export class RpcFailoverManager {
  private endpoints: RpcEndpointHealth[];
  private activeIndex: number = 0;

  constructor(endpoints?: string[]) {
    const defaultEndpoints = endpoints || [
      'https://soroban-testnet.stellar.org',
      'https://rpc-testnet.stellar.expert',
    ];
    this.endpoints = defaultEndpoints.map((url, i) => ({
      url,
      isPrimary: i === 0,
      latencyMs: 45,
      lastChecked: Date.now(),
      healthy: true,
      latestLedger: 1250000,
    }));
  }

  getActiveEndpoint(): RpcEndpointHealth {
    return this.endpoints[this.activeIndex];
  }

  reportError(url: string): void {
    const idx = this.endpoints.findIndex((e) => e.url === url);
    if (idx !== -1) {
      this.endpoints[idx].healthy = false;
      // Failover to next healthy
      const nextHealthy = this.endpoints.findIndex((e) => e.healthy);
      if (nextHealthy !== -1) {
        this.activeIndex = nextHealthy;
      }
    }
  }

  getAllEndpoints(): RpcEndpointHealth[] {
    return [...this.endpoints];
  }
}
