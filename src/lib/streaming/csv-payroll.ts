export interface ParsedPayrollRow {
  address: string;
  amount: number;
  valid: boolean;
}

export class CsvPayrollParser {
  static parseCsv(content: string): ParsedPayrollRow[] {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [address, amtStr] = line.split(',');
        const amount = parseFloat(amtStr) || 0;
        const valid = !!address && address.startsWith('G') && amount > 0;
        return { address, amount, valid };
      });
  }
}
