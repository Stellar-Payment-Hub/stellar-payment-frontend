const memoryRequests = [
  {
    id: 'REQ-001',
    requester: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    amount: '25.0000',
    memo: 'Design Consultation #204',
    status: 'ACTIVE',
    expires_at: '2026-10-09T12:00:00Z',
    created_at: '2026-10-06T12:00:00Z'
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
    return res.status(200).json({
      status: 'ok',
      count: memoryRequests.length,
      requests: memoryRequests
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const newId = `REQ-${String(memoryRequests.length + 1).padStart(3, '0')}`;
    const newReq = {
      id: newId,
      requester: body.requester || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      amount: String(body.amount || '10.0000'),
      memo: body.memo || '',
      status: 'ACTIVE',
      expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
    memoryRequests.unshift(newReq);
    return res.status(201).json({ status: 'ok', request: newReq });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
