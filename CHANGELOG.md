# Changelog - Frontend

All notable changes to the `stellar-payment-frontend` repository are documented in this file.

## [1.2.0] - 2026-10-30

### Added
- **Financial Analytics, Invoicing & Accessibility (Batch 12, Items 221–240)**:
  - Enterprise financial analytics dashboard with total volume and Soroban transaction counters.
  - Interactive daily settlement bar charts and multi-asset treasury donut allocation view.
  - Cryptographic tax invoice generator with printable receipts.
  - Automated CSV ledger exporter for external enterprise accounting.
  - Offline-first transaction queue manager with automated reconnection sync banner.
  - WCAG AAA high-contrast toggle, font size scalers, keyboard shortcut manager (`Ctrl+K`), and multilingual switcher (EN, ES, FR, PT, TL).

- **Cross-Border Remittance & Anchor SEP Gateway (Batch 11, Items 201–220)**:
  - Multi-currency live FX converter widget (XLM, USDC, EURC, NGN, BRL, PHP, ARS).
  - Microscopic Stellar network fee savings comparison vs traditional $45 bank wire fees.
  - Verified SEP-24 / SEP-31 anchor discovery directory with uptime statistics.
  - Interactive SEP-24 on-ramp deposit frame and direct-to-bank fiat off-ramp payout modals.
  - Multi-hop DEX path payment visualizer with guaranteed rate lock countdown timer.

- **Escrow & Multi-Sig Dispute Resolution Center (Batch 10, Items 181–200)**:
  - 2-of-3 multi-party escrow overview dashboard.
  - Multi-stage milestone progress stepper with IPFS deliverable CID attachments.
  - Buyer partial milestone release approvals and formalized dispute filing modal.
  - Arbitrator workbench console with interactive 0%–100% award split slider.
  - Automated legal agreement markdown exporter and pre-arbitration discussion messenger.

- **Recurring Subscriptions & Merchant Direct Debit Portal (Batch 9, Items 161–180)**:
  - Merchant plan authoring wizard supporting daily, weekly, monthly, and annual cadences.
  - SEP-41 token allowance pre-authorization modal with spend cap protection.
  - Spending limit warning guards, cancellation, and cycle pause controls.
  - Dynamic plan upgrade modal with mid-cycle proration differential charges.
  - Merchant Monthly Recurring Revenue (MRR) KPI telemetry cards and embeddable iframe checkout snippets.

- **Real-Time Payment Streaming & Flow-Meter UI (Batch 8, Items 141–160)**:
  - Animated live balance flow meter ticking accrued token balances at 10 Hz.
  - Linear vesting cliff schedules and instant claim withdrawal modals.
  - Batch organizational payroll streaming via validated CSV uploads.
  - Web Audio API harmonic chimes upon token withdrawal confirmation.

- **Advanced Multi-Wallet Hub & RPC Diagnostics (Batch 7, Items 121–140)**:
  - Multi-wallet session management supporting Freighter, xBull, Lobstr, and Hana.
  - Dynamic RPC failover manager and latency ping indicator.
  - Soroban CPU/memory diagnostic decoder translating simulation errors to plain English.
  - Trustline manager modal and Stellar federation address resolver (`user*domain.com`).

## [1.0.0] - 2026-10-29

### Added
- Initial core release of payment tracker, single payments, and split bill calculators.
