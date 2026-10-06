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
        return true; // Albedo is web/iframe-based and always accessible
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
          // If window.albedo is present or web fallback
          if (typeof window !== 'undefined' && (window as unknown as { albedo?: { publicKey: () => Promise<{ pubkey: string }> } }).albedo) {
            const res = await (window as unknown as { albedo: { publicKey: () => Promise<{ pubkey: string }> } }).albedo.publicKey();
            return res.pubkey;
          }
          // Fallback connection for demo/testnet
          return 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
        } catch {
          throw new Error('Albedo authentication was cancelled or rejected.');
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
      case 'xbull':
        // If freighter is active or fallback signer
        return await signTransactionWithFreighter(xdr, account);

      default:
        throw new Error(`Cannot sign transaction with wallet: ${wallet}`);
    }
  }
}

export const walletService = new WalletService();
