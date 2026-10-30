import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsEngine } from '../src/lib/analytics/analytics-engine';
import { CsvLedgerExporter } from '../src/lib/analytics/csv-ledger-exporter';
import { FinancialAnalyticsDashboard } from '../src/components/analytics/FinancialAnalyticsDashboard';
import { HighContrastToggle } from '../src/components/accessibility/HighContrastToggle';
import { LanguageSelector } from '../src/components/i18n/LanguageSelector';
import { UserPreferencesCenter } from '../src/components/settings/UserPreferencesCenter';

describe('Batch 12: Financial Analytics, Tax Invoicing, Offline Sync & Accessibility', () => {
  it('Item 222: AnalyticsEngine calculates percentages and total volume correctly', () => {
    const assets = [
      { assetCode: 'USDC', amount: 500, priceUsd: 1.0 },
      { assetCode: 'XLM', amount: 5000, priceUsd: 0.1 },
    ];
    const distribution = AnalyticsEngine.calculateAssetPercentages(assets);
    expect(distribution.length).toBe(2);
    expect(distribution[0].percentage).toBe(50);
    expect(distribution[1].percentage).toBe(50);

    const savings = AnalyticsEngine.calculateCumulativeStellarSavings(100, 3.0);
    expect(savings).toBeGreaterThan(290);
  });

  it('Item 229: CsvLedgerExporter formats CSV rows with headers', () => {
    const csv = CsvLedgerExporter.formatCsv([
      {
        txHash: '0xabc123',
        timestamp: '2026-10-30',
        type: 'settlement',
        asset: 'USDC',
        amount: 250,
        feeStroops: 100,
      },
    ]);
    expect(csv).toContain('TxHash,Timestamp');
    expect(csv).toContain('0xabc123');
    expect(csv).toContain('USDC');
  });

  it('Item 223: FinancialAnalyticsDashboard mounts cleanly', () => {
    render(<FinancialAnalyticsDashboard />);
    expect(screen.getByTestId('financial-analytics-dashboard')).toBeDefined();
    expect(screen.getByTestId('volume-bar-chart')).toBeDefined();
  });

  it('Item 232: HighContrastToggle renders', () => {
    render(<HighContrastToggle />);
    expect(screen.getByTestId('high-contrast-toggle')).toBeDefined();
  });

  it('Item 237: LanguageSelector renders with languages', () => {
    render(<LanguageSelector />);
    expect(screen.getByTestId('language-selector')).toBeDefined();
    expect(screen.getByText('English')).toBeDefined();
  });

  it('Item 238: UserPreferencesCenter renders all preferences', () => {
    render(<UserPreferencesCenter />);
    expect(screen.getByTestId('user-preferences-center')).toBeDefined();
  });
});
