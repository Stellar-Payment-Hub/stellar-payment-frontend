export interface CsvTransactionRow {
  txHash: string;
  timestamp: string;
  type: string;
  asset: string;
  amount: number;
  feeStroops: number;
}

export class CsvLedgerExporter {
  static formatCsv(rows: CsvTransactionRow[]): string {
    const headers = ['TxHash', 'Timestamp', 'Type', 'Asset', 'Amount', 'FeeStroops'];
    const body = rows.map((r) => [r.txHash, r.timestamp, r.type, r.asset, r.amount, r.feeStroops].join(','));
    return [headers.join(','), ...body].join('\n');
  }
}
