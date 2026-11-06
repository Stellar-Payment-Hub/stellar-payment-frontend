import { WalletType, WalletOption } from '../types/wallet';
import {
  connectFreighter,
  isFreighterInstalled,
  signTransactionWithFreighter,
} from '../lib/wallet/freighter';

export const SUPPORTED_WALLETS: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter',
    description: 'Stellar browser extension with hardware key support',
    isAvailable: true,
    installUrl: 'https://www.freighter.app/',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    description: 'Web-based Stellar wallet without extension required',
    isAvailable: true,
    installUrl: 'https://albedo.link/',
  },
  {
    id: 'xbull',
    name: 'xBull',
    description: 'Multi-platform Stellar wallet and vault',
    isAvailable: true,
    installUrl: 'https://xbull.app/',
  },
];

class WalletService {
  public async isAvailable(wallet: WalletType): Promise<boolean> {
    switch (wallet) {
      case 'freighter':
        return await isFreighterInstalled();
      case 'albedo':
        return typeof window !== 'undefined' && Boolean((window as unknown as { albedo?: unknown }).albedo);
      case 'xbull':
        return typeof window !== 'undefined' && Boolean((window as unknown as { xbull?: unknown }).xbull);
      default:
        return false;
    }
  }

  public async connect(wallet: WalletType): Promise<string> {
    switch (wallet) {
      case 'freighter':
        return await connectFreighter();

      case 'albedo':
        try {
          if (typeof window !== 'undefined' && (window as unknown as { albedo?: { publicKey: () => Promise<{ pubkey: string }> } }).albedo) {
            const res = await (window as unknown as { albedo: { publicKey: () => Promise<{ pubkey: string }> } }).albedo.publicKey();
            return res.pubkey;
          }
          throw new Error('Albedo wallet was not detected. Please install or visit https://albedo.link');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          throw new Error(msg || 'Albedo authentication was cancelled or rejected.');
        }

      case 'xbull':
        if (!(await this.isAvailable('xbull'))) {
          throw new Error('xBull wallet extension was not detected. Please install xBull.');
        }
        try {
          const xbull = (window as unknown as { xbull: { connect: () => Promise<string> } }).xbull;
          return await xbull.connect();
        } catch {
          throw new Error('xBull connection was declined by user.');
        }

      default:
        throw new Error(`Unsupported wallet type: ${wallet}`);
    }
  }

  public async signTransaction(
    xdr: string,
    wallet: WalletType,
    account?: string
  ): Promise<string> {
    switch (wallet) {
      case 'freighter':
        return await signTransactionWithFreighter(xdr, account);

      case 'albedo':
        if (typeof window !== 'undefined' && (window as unknown as { albedo?: { tx: (opts: { xdr: string; network?: string }) => Promise<{ signed_envelope_xdr: string }> } }).albedo) {
          const res = await (window as unknown as { albedo: { tx: (opts: { xdr: string; network?: string }) => Promise<{ signed_envelope_xdr: string }> } }).albedo.tx({
            xdr,
            network: 'testnet',
          });
          return res.signed_envelope_xdr;
        }
        throw new Error('Albedo wallet bridge is not available for transaction signing.');

      case 'xbull':
        if (typeof window !== 'undefined' && (window as unknown as { xbull?: { sign: (opts: { xdr: string; publicKey?: string }) => Promise<string> } }).xbull) {
          return await (window as unknown as { xbull: { sign: (opts: { xdr: string; publicKey?: string }) => Promise<string> } }).xbull.sign({
            xdr,
            publicKey: account,
          });
        }
        throw new Error('xBull wallet extension is not available for transaction signing.');

      default:
        throw new Error(`Cannot sign transaction with wallet: ${wallet}`);
    }
  }
}

export const walletService = new WalletService();
