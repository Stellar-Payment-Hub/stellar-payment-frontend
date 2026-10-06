export type WalletStatusState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'not_found'
  | 'rejected'
  | 'network_mismatch';

export type WalletType = 'freighter' | 'albedo' | 'xbull';

export interface WalletOption {
  id: WalletType;
  name: string;
  description: string;
  isAvailable: boolean;
  installUrl?: string;
}

export interface WalletState {
  status: WalletStatusState;
  address: string | null;
  error: string | null;
  network: string;
  activeWallet: WalletType | null;
}

export interface WalletContextType extends WalletState {
  connect: (walletType?: WalletType) => Promise<void>;
  disconnect: () => void;
  isInstalled: (walletType: WalletType) => Promise<boolean>;
  availableWallets: WalletOption[];
}
