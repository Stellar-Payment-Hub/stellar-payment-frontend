export type WalletStatusState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface WalletState {
  status: WalletStatusState;
  address: string | null;
  error: string | null;
  network: string;
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  isInstalled: boolean;
  checkInstallation: () => Promise<boolean>;
}
