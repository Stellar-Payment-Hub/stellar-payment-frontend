export interface SorobanDiagnosticError {
  code: number;
  contract?: string;
  title: string;
  message: string;
  actionRecommendation: string;
}

export class SorobanDiagnosticsDecoder {
  private static codeMap: Record<number, { title: string; message: string; action: string }> = {
    1: { title: 'Already Initialized', message: 'The smart contract authority has already been set.', action: 'Use administrative methods.' },
    3: { title: 'Unauthorized', message: 'Caller address lacks required role or signature authority.', action: 'Verify connected wallet address.' },
    7: { title: 'Empty Recipients', message: 'At least one recipient share must be provided.', action: 'Add recipient address to split.' },
    13: { title: 'Contract Paused', message: 'Emergency circuit breaker is active.', action: 'Wait until administrators resume operations.' },
    24: { title: 'Insufficient Allowance', message: 'Token spend allowance is below requested amount.', action: 'Approve token allowance in wallet.' },
    25: { title: 'Insufficient Token Balance', message: 'Account balance cannot cover transfer volume.', action: 'Fund account before settling.' },
    26: { title: 'Token Not Whitelisted', message: 'Specified asset is not enabled in the router.', action: 'Select a whitelisted Soroban asset.' },
  };

  static decodeError(rawError: any): SorobanDiagnosticError {
    const errStr = String(rawError?.message || rawError || '');
    const match = errStr.match(/Error\(Contract,\s*#?(\d+)\)/);
    const code = match ? parseInt(match[1], 10) : 0;
    const mapped = this.codeMap[code];

    if (mapped) {
      return {
        code,
        title: mapped.title,
        message: mapped.message,
        actionRecommendation: mapped.action,
      };
    }
    return {
      code,
      title: 'Transaction Error',
      message: errStr || 'Contract execution reverted',
      actionRecommendation: 'Review transaction arguments and retry.',
    };
  }
}
