export interface DevAccount {
  name: string;
  publicKey: string;
  secretKey: string;
}

export const PRESET_DEV_ACCOUNTS: DevAccount[] = [
  {
    name: 'Alice (Merchant Admin)',
    publicKey: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    secretKey: 'SDEXAMPLEALICESECRETKEYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    name: 'Bob (Recipient Provider)',
    publicKey: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    secretKey: 'SDEXAMPLEBOBSECRETKEYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    name: 'Charlie (Arbitrator Escrow)',
    publicKey: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7',
    secretKey: 'SDEXAMPLECHARLIESECRETKEYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
];

export function isDevWalletEnabled(): boolean {
  // Restrict preset dev accounts strictly to non-production environments
  return typeof process !== 'undefined' && process.env?.NODE_ENV === 'production' ? false : true;
}

export function getDevAccount(publicKey: string): DevAccount | undefined {
  if (!isDevWalletEnabled()) {
    return undefined;
  }
  return PRESET_DEV_ACCOUNTS.find((a) => a.publicKey === publicKey);
}

