const memorySettlements = [
  {
    id: 'SETTLE-001',
    on_chain_id: 1,
    payer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    total_amount: '100.0000',
    recipient_count: 3,
    memo: 'Contractor Payouts - Sprint 12',
    status: 'COMPLETED',
    contract_address: 'CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E',
    transaction_hash: '7789a1b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef',
    ledger: 104300,
    sub_payment_ids: ['PAY-001', 'PAY-002'],
    recipients: [
      { id: 'REC-1', settlement_id: 'SETTLE-001', recipient: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', amount: '50.0000', status: 'COMPLETED' },
      { id: 'REC-2', settlement_id: 'SETTLE-001', recipient: 'GCA3HNDW4F4D3C57Q5P7LGL7HCKH6I2YFUKM2Y6W6X7XF5Q2VLL4X7R7', amount: '30.0000', status: 'COMPLETED' },
      { id: 'REC-3', settlement_id: 'SETTLE-001', recipient: 'GD6W7Z4DF57Q3B6U2L8K7X9V1N4P0M2Y6W6X7XF5Q2VLL4X7R7SD5XYZ', amount: '20.0000', status: 'COMPLETED' }
    ],
    created_at: '2026-10-06T11:40:00Z',
    updated_at: '2026-10-06T11:45:00Z'
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
      count: memorySettlements.length,
      settlements: memorySettlements
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const newId = `SETTLE-${String(memorySettlements.length + 1).padStart(3, '0')}`;
    const newSettlement = {
      id: newId,
      on_chain_id: memorySettlements.length + 1,
      payer: body.payer || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      total_amount: body.total_amount || '10.0000',
      recipient_count: Array.isArray(body.recipients) ? body.recipients.length : 1,
      memo: body.memo || '',
      status: 'CREATED',
      contract_address: 'CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E',
      sub_payment_ids: [],
      recipients: body.recipients || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memorySettlements.unshift(newSettlement);
    return res.status(201).json({ status: 'ok', settlement: newSettlement });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

