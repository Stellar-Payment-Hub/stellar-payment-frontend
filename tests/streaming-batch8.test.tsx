import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { StreamMath } from '../src/lib/streaming/stream-math';
import { CsvPayrollParser } from '../src/lib/streaming/csv-payroll';
import { StreamingDashboard } from '../src/components/streaming/StreamingDashboard';
import { LiveStreamEntity } from '../src/types/stream';

describe('Batch 8: Live Payment Streaming & Flow Meter', () => {
  const mockStream: LiveStreamEntity = {
    id: 'stream-test',
    sender: 'GBALICE',
    recipient: 'GBBOB',
    token: 'XLM',
    tokenSymbol: 'XLM',
    totalDeposit: 100,
    withdrawnAmount: 20,
    startTime: 1000,
    stopTime: 2000,
    cliffTime: 0,
    ratePerSecond: 0.1,
    status: 'active',
  };

  it('Item 142: StreamMath calculates accrual linearly', () => {
    // Midpoint: 1500s -> 500s elapsed * 0.1 = 50 accrued
    const accrued = StreamMath.calculateAccrued(mockStream, 1500 * 1000);
    expect(accrued).toBe(50);

    // Withdrawable = 50 accrued - 20 claimed = 30
    const withdrawable = StreamMath.calculateWithdrawable(mockStream, 1500 * 1000);
    expect(withdrawable).toBe(30);

    // Percentage = 50%
    const percentage = StreamMath.calculatePercentage(mockStream, 1500 * 1000);
    expect(percentage).toBe(50);
  });

  it('Item 152: CsvPayrollParser parses CSV lines', () => {
    const parsed = CsvPayrollParser.parseCsv('GBALICE777777777777777777777777777777777777777777777777777,500');
    expect(parsed.length).toBe(1);
    expect(parsed[0].amount).toBe(500);
    expect(parsed[0].valid).toBe(true);
  });

  it('Item 159: StreamingDashboard renders flow meter and metrics', () => {
    render(<StreamingDashboard />);
    expect(screen.getByTestId('streaming-dashboard')).toBeDefined();
    expect(screen.getByTestId('stream-flow-meter')).toBeDefined();
    expect(screen.getByTestId('stream-telemetry-summary')).toBeDefined();
  });
});
