interface PaymentItem {
  id: string;
  on_chain_id: number;
  creator_address: string;
  recipient_address: string;
  amount: string;
  memo: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  contract_address: string;
  transaction_hash?: string;
  ledger?: number;
  created_at: string;
  updated_at: string;
}

const memoryPayments: PaymentItem[] = [
  {
    id: 'PAY-001',
    on_chain_id: 1,
    creator_address: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    recipient_address: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    amount: '25.0000000',
    memo: 'Invoice #1042',
    status: 'COMPLETED',
    contract_address: 'CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S',
    transaction_hash: '342eb1e83ad159e628bb047e741e95632717c45bb438eb7a87dbb401f0bc247f',
    ledger: 104250,
    created_at: '2026-10-06T11:30:00Z',
    updated_at: '2026-10-06T11:30:00Z'
  },
  {
    id: 'PAY-002',
    on_chain_id: 2,
    creator_address: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    recipient_address: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7',
    amount: '10.0000000',
    memo: 'Domain Renewal',
    status: 'COMPLETED',
    contract_address: 'CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S',
    transaction_hash: '9a7b6c5d4e3f210987654321fedcba0987654321fedcba0987654321fedcba09',
    ledger: 104100,
    created_at: '2026-10-06T11:00:00Z',
    updated_at: '2026-10-06T11:00:00Z'
  }
];

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { status } = req.query || {};
    const filtered = status
      ? memoryPayments.filter((p) => p.status === status)
      : memoryPayments;
    return res.status(200).json({
      status: 'ok',
      count: filtered.length,
      payments: filtered
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const newId = `PAY-${String(memoryPayments.length + 1).padStart(3, '0')}`;
    const payment: PaymentItem = {
      id: newId,
      on_chain_id: memoryPayments.length + 1,
      creator_address: body.creator_address || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      recipient_address: body.recipient_address || 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      amount: String(body.amount || '10.0000000'),
      memo: body.memo || '',
      status: 'PENDING',
      contract_address: 'CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S',
      transaction_hash: body.transaction_hash,
      ledger: body.ledger,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryPayments.unshift(payment);
    return res.status(201).json({ status: 'ok', payment });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
