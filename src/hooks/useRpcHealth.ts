import { useState, useEffect } from 'react';
import { RpcFailoverManager } from '../lib/stellar/rpc-failover';
import { RpcEndpointHealth } from '../types/wallet-hub';

const manager = new RpcFailoverManager();

export function useRpcHealth() {
  const [currentRpc, setCurrentRpc] = useState<RpcEndpointHealth>(() => manager.getActiveEndpoint());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRpc(manager.getActiveEndpoint());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    currentRpc,
    endpoints: manager.getAllEndpoints(),
    reportFailure: (url: string) => {
      manager.reportError(url);
      setCurrentRpc(manager.getActiveEndpoint());
    },
  };
}
