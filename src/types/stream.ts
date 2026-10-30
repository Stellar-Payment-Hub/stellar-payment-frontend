export type StreamStatus = 'active' | 'paused' | 'cancelled' | 'completed';

export interface LiveStreamEntity {
  id: string;
  sender: string;
  recipient: string;
  token: string;
  tokenSymbol: string;
  totalDeposit: number;
  withdrawnAmount: number;
  startTime: number;
  stopTime: number;
  cliffTime: number;
  ratePerSecond: number;
  status: StreamStatus;
  memo?: string;
}
