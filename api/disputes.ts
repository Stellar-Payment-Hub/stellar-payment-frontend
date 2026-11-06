const memoryDisputes = [
  {
    id: 'DISP-001',
    paymentId: 'PAY-101',
    initiator: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    reason: 'Delayed milestone confirmation',
    evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'PENDING',
    createdAt: '2026-10-06T12:00:00Z'
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
    return res.status(200).json(memoryDisputes);
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const dispute = {
      id: `DISP-${String(memoryDisputes.length + 1).padStart(3, '0')}`,
      paymentId: body.paymentId,
      initiator: body.initiator || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      reason: body.reason || 'Contract dispute',
      evidenceHash: body.evidenceHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    memoryDisputes.push(dispute);
    return res.status(201).json(dispute);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

