const memoryTransactions = [
  {
    id: 'TX-1',
    hash: '342eb1e83ad159e628bb047e741e95632717c45bb438eb7a87dbb401f0bc247f',
    source: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    destination: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    amount: '25.0000 XLM',
    asset: 'native',
    type: 'Contract Payment',
    status: 'Success',
    ledger: 104250,
    created_at: '2026-10-06T11:30:00Z'
  },
  {
    id: 'TX-2',
    hash: '9a7b6c5d4e3f210987654321fedcba0987654321fedcba0987654321fedcba09',
    source: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    destination: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7',
    amount: '10.0000 XLM',
    asset: 'native',
    type: 'Native Payment',
    status: 'Success',
    ledger: 104100,
    created_at: '2026-10-06T11:00:00Z'
  }
];

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      count: memoryTransactions.length,
      transactions: memoryTransactions
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const tx = {
      id: `TX-${Date.now()}`,
      ...body,
      status: 'Success',
      created_at: new Date().toISOString()
    };
    memoryTransactions.unshift(tx);
    return res.status(201).json({ status: 'ok', transaction: tx });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
