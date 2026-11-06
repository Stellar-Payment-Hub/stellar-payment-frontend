# Stellar Payment Hub - Frontend Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-stellar--payment--frontend.vercel.app-brightgreen.svg)](https://stellar-payment-frontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.4-purple.svg)](https://vitejs.dev)
[![Vitest](https://img.shields.io/badge/Tests-102%20Passing-success.svg)]()
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet%20Verified-blue.svg)](https://stellar.expert/explorer/testnet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploys: Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)](https://stellar-payment-frontend.vercel.app/)

The flagship decentralized web application for **Stellar Payment Hub**: featuring continuous real-time payment streaming, automated merchant direct debits, 2-of-3 multi-sig escrow arbitration, cross-border remittance via SEP-24 anchors, native Vercel serverless API handlers, and enterprise treasury analytics.

**Live Application**: [https://stellar-payment-frontend.vercel.app/](https://stellar-payment-frontend.vercel.app/)

---

## Key Subsystems & Features

```
+---------------------------------------------------------------------------------+
|                         STELLAR PAYMENT HUB DAPP                                |
+---------------------------------------------------------------------------------+
|  [ Multi-Wallet Hub ]      [ Streaming Meter ]       [ Merchant Subscriptions ] |
|  - Freighter, xBull, Hana  - Live 10Hz Accrual       - MRR KPI Telemetry        |
|  - RPC Node Failover       - Cliff Vesting           - Spend Cap Allowances     |
|  - Trustline Manager       - CSV Batch Payroll       - Embeddable Checkout      |
+----------------------------+-------------------------+--------------------------+
|  [ Escrow & Arbitration ]  [ Remittance & Anchors ]  [ Financial Analytics ]    |
|  - 2-of-3 Multi-Sig Quorum - Live FX Converter       - Daily Volume Bars        |
|  - Milestone IPFS Evidence - SEP-24 Fiat On/Off Ramp - Tax Invoice Generator    |
|  - Award Split Slider      - Multi-Hop DEX Paths     - Offline IndexedDB Cache  |
+---------------------------------------------------------------------------------+
```

### 1. Advanced Multi-Wallet Hub
- Seamless integration with **Freighter**, **xBull**, **Lobstr**, and **Hana** wallets.
- Dynamic RPC failover across multiple public and private Horizon/Soroban endpoints.
- In-app trustline inspector modal with one-click trustline creation transactions.
- Stellar federation address resolver (`user*domain.com`) with automated memo insertion.

### 2. Live Payment Streaming & Flow Meter
- Real-time animated balance flow meter ticking token balances down to stroop fractions at 10 Hz.
- Linear vesting cliff schedules, instant recipient claim withdrawals, and sender pause controls.
- Enterprise CSV upload parser for multi-employee simultaneous payroll streams.

### 3. Recurring Subscriptions & Direct Debit Portal
- Merchant plan authoring wizard supporting daily, weekly, monthly, and annual cadences.
- SEP-41 token allowance authorization with spend cap protection.
- Real-time Monthly Recurring Revenue (MRR), active subscriber counts, and churn analytics.

### 4. Escrow & 2-of-3 Multi-Sig Arbitration
- Multi-party escrow agreements connecting Buyer, Seller, and neutral Arbitrator.
- Milestone deliverable submissions anchored to IPFS cryptographic hashes.
- Interactive dispute split-award slider (0%–100%) with automated arbitration commission deductions.

### 5. Cross-Border Remittance & Anchor SEP Gateway
- Live multi-currency FX calculator (XLM, USDC, EURC, NGN, BRL, PHP, ARS).
- Transparent cost calculator highlighting savings ($0.00001 Stellar fee vs $45 bank wire fee).
- Interactive SEP-24 / SEP-31 anchor discovery directory with ping latency statistics.

### 6. Financial Analytics, Invoicing & Accessibility
- Enterprise treasury distribution charts and daily volume bar visualizations.
- Cryptographic tax invoice generator exporting verified PDF receipts.
- Offline-first transaction queue buffering actions during network dropouts.
- WCAG AAA high-contrast toggle, scalable font controls, and multilingual switcher (EN, ES, FR, PT, TL).

---

## Local Development & Testing

### Install Dependencies
```bash
npm install
```

### Run Vitest Test Suite (102 Tests Across 20 Suites)
```bash
npm test
```

### Run TypeScript Compilation Check
```bash
npx tsc -b
```

### Build Production Distribution
```bash
npm run build
```

---

## Native Serverless API & Routing Architecture

The frontend is deployed as a unified SPA + Edge API on **Vercel** (`vercel.json`), providing instant zero-dependency backend endpoints:

| Endpoint | Method | Scope |
|---|---|---|
| `/api/health` | `GET` | Service telemetry, Soroban RPC status, and contract addresses |
| `/api/payments` | `GET`, `POST` | Payment query, indexing, and registration |
| `/api/settlements` | `GET`, `POST` | Multi-recipient batch settlements |
| `/api/payment-requests` | `GET`, `POST` | Shareable invoices and payment requests |
| `/api/transactions` | `GET`, `POST` | Historical transaction ledger indexing |
| `/api/assets` | `GET` | Supported testnet assets (XLM, USDC, EURC) |
| `/api/analytics` | `GET` | Volume, count metrics, and system latency stats |
| `/api/disputes` | `GET`, `POST` | Escrow arbitration dispute records |

---

## Deployed Soroban Smart Contracts (Stellar Testnet)

The decentralized application connects to the verified, active smart contracts:

- **PaymentRegistry**: [`CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S`](https://stellar.expert/explorer/testnet/contract/CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S)
- **SettlementRouter**: [`CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E`](https://stellar.expert/explorer/testnet/contract/CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E)

---

## Production Deployment (Vercel)

The application deploys automatically on **Vercel**:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Routing Configuration**: `vercel.json` provides SPA fallback with `((?!api/).*)` alongside native `/api` serverless execution.

---

## Community & Security
- **License**: [MIT License](LICENSE) - Copyright (c) 2026 omolobamoyinoluwa-max
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Security Policy**: [SECURITY.md](SECURITY.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
