import freighterApi from '@stellar/freighter-api';
import { STELLAR_CONFIG } from '../../config/env';

// Resilient access to freighter methods
const freighter = (freighterApi as unknown as { default?: typeof freighterApi }).default || freighterApi;

/**
 * Check if the Freighter extension is installed in the user's browser.
 */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    const res = await freighter.isConnected();
    if (typeof res === 'object' && res !== null && 'isConnected' in res) {
      return Boolean(res.isConnected);
    }
    return Boolean(res);
  } catch (err) {
    console.warn('[Freighter] Detection check failed:', err);
    return false;
  }
}

/**
 * Request access from the Freighter wallet and return the active public address.
 */
export async function connectFreighter(): Promise<string> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error(
      'Freighter wallet extension is not installed. Please install it from https://freighter.app'
    );
  }

  try {
    const accessRes = await freighter.requestAccess();
    let pubKey = '';

    if (typeof accessRes === 'string') {
      pubKey = accessRes;
    } else if (accessRes && typeof accessRes === 'object') {
      if (accessRes.error) {
        throw new Error(accessRes.error);
      }
      pubKey = accessRes.address || '';
    }

    if (!pubKey) {
      // Fallback: try getAddress()
      const addrRes = await freighter.getAddress();
      if (typeof addrRes === 'string') {
        pubKey = addrRes;
      } else if (addrRes && typeof addrRes === 'object') {
        if (addrRes.error) {
          throw new Error(addrRes.error);
        }
        pubKey = addrRes.address || '';
      }
    }

    if (!pubKey) {
      throw new Error('No address returned by Freighter. Access might have been rejected.');
    }

    return pubKey;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('user declined') || message.toLowerCase().includes('rejected')) {
      throw new Error('Connection request was declined in Freighter.');
    }
    throw new Error(message || 'Failed to connect to Freighter wallet.');
  }
}

/**
 * Sign an unsigned Stellar transaction XDR with Freighter.
 */
export async function signTransactionWithFreighter(
  xdr: string,
  accountToSign?: string
): Promise<string> {
  try {
    const signRes = await freighter.signTransaction(xdr, {
      networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      address: accountToSign,
    });

    if (!signRes) {
      throw new Error('Transaction signing was cancelled.');
    }

    if (typeof signRes === 'string') {
      return signRes;
    }

    if (typeof signRes === 'object') {
      if (signRes.error) {
        const errorMsg = String(signRes.error);
        if (
          errorMsg.toLowerCase().includes('user declined') ||
          errorMsg.toLowerCase().includes('reject') ||
          errorMsg.toLowerCase().includes('cancelled')
        ) {
          throw new Error('Transaction rejected by user in Freighter.');
        }
        throw new Error(errorMsg);
      }
      if (signRes.signedTxXdr) {
        return signRes.signedTxXdr;
      }
    }

    throw new Error('Failed to retrieve signed transaction from Freighter.');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.toLowerCase().includes('user declined') ||
      message.toLowerCase().includes('reject') ||
      message.toLowerCase().includes('cancelled')
    ) {
      throw new Error('Transaction rejected by user in Freighter.');
    }
    throw err;
  }
}
