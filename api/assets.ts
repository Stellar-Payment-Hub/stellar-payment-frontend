export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    count: 3,
    assets: [
      {
        code: 'XLM',
        issuer: 'native',
        type: 'native',
        decimals: 7,
        verified: true,
        displayName: 'Stellar Lumens'
      },
      {
        code: 'USDC',
        issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
        type: 'credit_alphanum4',
        decimals: 7,
        verified: true,
        displayName: 'USD Coin (Testnet)'
      },
      {
        code: 'EURC',
        issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
        type: 'credit_alphanum4',
        decimals: 7,
        verified: true,
        displayName: 'Euro Coin (Testnet)'
      }
    ]
  });
}

