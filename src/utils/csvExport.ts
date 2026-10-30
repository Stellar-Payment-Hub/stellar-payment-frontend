export function convertRecordsToCsv(records: Record<string, any>[]): string {
  if (!records || records.length === 0) return '';
  const headers = Object.keys(records[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.join(','));

  for (const row of records) {
    const values = headers.map((header) => {
      const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\r\n');
}

export function exportTransactionsToCsv(
  records: Record<string, any>[],
  filename = 'stellar-payment-history.csv'
): void {
  const csvContent = convertRecordsToCsv(records);
  if (!csvContent) return;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
