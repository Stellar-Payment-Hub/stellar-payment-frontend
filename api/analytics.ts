export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    metrics: {
      totalVolumeXlm: '135.0000000',
      totalPaymentsCount: 2,
      totalSettlementsCount: 1,
      totalActiveRequests: 1,
      settlementSuccessRate: '100.0%',
      medianLatencyMs: 142
    },
    contracts: {
      paymentRegistry: 'CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S',
      settlementRouter: 'CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E'
    },
    timestamp: new Date().toISOString()
  });
}
