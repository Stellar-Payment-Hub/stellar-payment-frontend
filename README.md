# Stellar Payment Hub (Frontend) — Level 1: White Belt

[![Frontend CI](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-38bdf8)](https://stellar.org)
[![Wallet](https://img.shields.io/badge/Wallet-Freighter-818cf8)](https://freighter.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](LICENSE)

Stellar Payment Hub is a non-custodial, peer-to-peer payment platform built on the **Stellar Network**.

This repository contains the **Level 1 (White Belt) frontend dApp**, establishing the core payment loop on the **Stellar Testnet**: connecting a Freighter wallet, loading real-time XLM balances, validating recipient parameters, signing transactions non-custodially, submitting to the Testnet ledger, and verifying live transaction hashes on the Stellar Explorer.

---

## Live Demo & Deployment

* **Live dApp URL**: [https://stellar-payment-frontend.vercel.app](https://stellar-payment-frontend.vercel.app) *(or your deployed Vercel URL)*
* **Network**: **Stellar Testnet**
* **Stellar Explorer**: [https://stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet)

---

## Level 1 Features

* [x] **Freighter Wallet Authentication**: Seamless connect and disconnect state lifecycle (`Disconnected`, `Connecting`, `Connected`, `Error`).
* [x] **Live Stellar Testnet Balance**: Real-time account hydration from Horizon Testnet RPC; calculates spendable balance considering the Stellar 1.0 XLM reserve.
* [x] **Testnet Faucet Integration**: One-click Stellar Friendbot funding helper for new accounts (+10,000 Testnet XLM).
* [x] **Payment Form & Pre-flight Validation**:
  * Recipient address verification using `@stellar/stellar-sdk` Ed25519 public key checksums (`G...`).
  * Self-transfer prevention.
  * Positive amount validation with 7-decimal stroop precision limits.
  * Spendable balance checks.
  * UTF-8 byte boundary enforcement on optional text memos (28-byte limit).
* [x] **Non-Custodial Transaction Pipeline**:
  * Real Horizon sequence fetching.
  * Base fee calculation (100 stroops).
  * Dynamic operation selection (`payment` for funded destinations, `createAccount` for new accounts).
  * Cryptographic signing via Freighter browser extension.
* [x] **Live Transaction States & Status**: Detailed lifecycle communication (`Idle` &rarr; `Preparing` &rarr; `Awaiting Signature` &rarr; `Submitting` &rarr; `Success` / `Failed`).
* [x] **Verifiable Transaction Hash**: Real Stellar transaction hash display with single-click copy and direct link to Stellar Expert.
* [x] **Comprehensive Error Handling**: Human-readable explanations for wallet rejection, underfunded accounts, and network timeouts.

---

## Polyrepo Architecture

Stellar Payment Hub is structured across three repositories to separate concerns and support evolutionary scaling:

```text
Stellar-Payment-Hub/
├── stellar-payment-frontend/   # (This repo) Primary Level 1 functional dApp
├── stellar-payment-backend/    # Foundation Express service with GET /health
└── stellar-payment-contracts/  # Soroban workspace scaffold for Payment Registry
```

### Frontend Directory Structure
```text
stellar-payment-frontend/
├── src/
│   ├── components/
│   │   ├── balance/
│   │   │   └── BalanceCard.tsx          # Real-time XLM balance display & faucet
│   │   ├── payments/
│   │   │   ├── SendPaymentForm.tsx      # Recipient & amount form with validation
│   │   │   ├── PaymentReview.tsx        # Pre-flight confirmation modal
│   │   │   └── TransactionStatus.tsx    # Success/error card, hash & explorer
│   │   └── wallet/
│   │       ├── WalletAddress.tsx        # Truncated address chip with copy
│   │       ├── WalletConnect.tsx        # Connect / disconnect trigger
│   │       └── WalletStatus.tsx         # Testnet pill and status badge
│   ├── config/
│   │   └── env.ts                       # Centralized network parameters
│   ├── hooks/
│   │   ├── useBalance.ts                # Real Testnet balance fetching hook
│   │   ├── usePayment.ts                # Transaction submission lifecycle hook
│   │   └── useWallet.ts                 # Freighter wallet state manager
│   ├── lib/
│   │   ├── stellar/
│   │   │   ├── explorer.ts              # Stellar Expert link generators
│   │   │   ├── server.ts                # Horizon server singleton & fee stats
│   │   │   └── transactions.ts          # Payment transaction builder & submitter
│   │   ├── validation/
│   │   │   └── payment.ts               # Strict form validation rules
│   │   └── wallet/
│   │       └── freighter.ts             # Freighter API connector & signer
│   ├── styles/
│   │   └── index.css                    # Custom dark glassmorphism design system
│   ├── types/
│   │   ├── payment.ts                   # Transaction and form data types
│   │   └── wallet.ts                    # Wallet status interfaces
│   ├── App.tsx                          # Responsive dashboard assembly
│   └── main.tsx                         # Client bootstrap
├── tests/
│   ├── setup.ts                         # Vitest test setup
│   ├── transaction-status.test.tsx      # Result component test suite
│   ├── validation.test.ts               # Input validation test suite
│   └── wallet.test.tsx                  # Wallet state test suite
├── .github/
│   └── workflows/
│       └── ci.yml                       # Automated CI (lint, test, build)
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Technology Stack

* **Framework**: React 18 + Vite 6
* **Language**: TypeScript 5.7 (Strict type-checking)
* **Blockchain SDK**: `@stellar/stellar-sdk` v13
* **Wallet Connector**: `@stellar/freighter-api` v3
* **Styling**: Vanilla CSS Design System (Custom dark theme, glassmorphism, responsive grid)
* **Icons**: `lucide-react`
* **Testing**: Vitest + React Testing Library + JSDOM
* **CI/CD**: GitHub Actions

---

## Local Setup & Development

### Prerequisites
* **Node.js**: v18.0.0 or later (v20+ recommended)
* **npm**: v9.0.0 or later
* **Freighter Wallet Extension**: Install from [freighter.app](https://www.freighter.app/)

### 1. Clone Repository
```bash
git clone https://github.com/Stellar-Payment-Hub/stellar-payment-frontend.git
cd stellar-payment-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Default parameters in `.env`:
```ini
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Test Suite
```bash
npm test
```

### 6. Build Production Bundle
```bash
npm run build
```

---

## Freighter Setup & Testnet Funding

To test the end-to-end payment flow on Stellar Testnet:

1. **Install Freighter**: Add the extension from [freighter.app](https://www.freighter.app/).
2. **Create / Import a Wallet**: Set your password and securely save your seed phrase.
3. **Switch to Testnet**:
   * Open the Freighter popup.
   * Click the settings gear icon &rarr; **Network** &rarr; Select **Testnet**.
4. **Fund Your Wallet**:
   * Copy your public address (`G...`).
   * Option A: Use the in-app **"Fund with Friendbot"** button.
   * Option B: Visit [Stellar Laboratory Account Creator](https://laboratory.stellar.org/#account-creator?network=testnet) and paste your public key.
   * Friendbot will credit your account with **10,000 Testnet XLM**.
5. **Connect & Send**: Click **Connect Wallet** in Stellar Payment Hub and proceed to send payments.

---

## Step-by-Step Payment Walkthrough

```text
1. Connect Wallet
   Click "Connect Wallet" -> Approve permission in Freighter popup.
   
2. View Available Balance
   The dashboard retrieves your live balance from Horizon Testnet (e.g. 10,000.0000 XLM).
   
3. Enter Payment Details
   Recipient: Enter a valid 56-character Stellar public key (G...).
   Amount: Specify XLM amount (e.g. 15.50 XLM).
   Memo: Optional transaction text identifier (up to 28 bytes).
   
4. Review Payment
   Click "Review Payment" to open the confirmation modal displaying from, to, amount, and fee.
   
5. Sign in Freighter
   Click "Sign & Submit" -> Freighter extension opens for non-custodial authorization.
   
6. Testnet Confirmation
   Transaction is broadcast to Stellar Testnet Horizon.
   A success banner displays the ledger sequence, transaction hash, and direct link to Stellar Expert.
```

---

## User Experience States (Screenshots & Flow)

### 1. Disconnected State
Clean dashboard welcoming the user with Testnet indicators and a primary **Connect Wallet** action.
```text
┌────────────────────────────────────────────────────────┐
│  ⚡ Stellar Payment Hub  [Level 1]        ● TESTNET    │
│                                      [Connect Wallet]  │
├──────────────────────────┬─────────────────────────────┤
│  Available Balance       │  Send XLM                   │
│  -- XLM                  │  Recipient [ G... ]         │
│  (Connect wallet)        │  Amount    [ 0.00 XLM ]     │
│                          │  [ Review Payment ]         │
└──────────────────────────┴─────────────────────────────┘
```

### 2. Connected & Balance Active
Account loaded, spendable balance calculated, address chip with copy and explorer shortcuts.
```text
┌────────────────────────────────────────────────────────┐
│  ⚡ Stellar Payment Hub               ● TESTNET         │
│                        GBBD47IF...FLA5  [Disconnect]   │
├──────────────────────────┬─────────────────────────────┤
│  Available Balance       │  Send XLM                   │
│  10,000.0000 XLM         │  Recipient [ GD6W...3K21 ]  │
│  Spendable: 9,999.0000   │  Amount    [ 25.00 XLM ]    │
│  [Refresh]               │  Memo      [ Invoice #1042] │
│                          │  [ Review Payment ]         │
└──────────────────────────┴─────────────────────────────┘
```

### 3. Payment Confirmation Modal
Pre-flight verification displaying exact breakdown and gas fee before wallet dispatch.

### 4. Successful Payment & Explorer Verification
Real transaction hash rendered with copy button and clickable link to [Stellar Expert Testnet](https://stellar.expert/explorer/testnet):
```text
┌────────────────────────────────────────────────────────┐
│  ✓ Payment Successful                                  │
│  25.00 XLM sent to recipient on Stellar Testnet        │
│  Ledger Close: #104829                                 │
│  Hash: 3389e9f2f1a65f19736cacf544c2e825313e8447...    │
│  [View on Stellar Explorer ↗]   [Send Another Payment] │
└────────────────────────────────────────────────────────┘
```

---

## Multi-Level Platform Roadmap

* **Level 1: White Belt (Current Foundation)**:
  * Non-custodial Freighter connection & balance inquiry.
  * Direct Stellar Testnet native payments.
  * Input validation and transaction lifecycle tracker.
  * Polyrepo workspace scaffolding (Frontend, Backend, Contracts).
* **Level 2: Yellow Belt (Planned)**:
  * Multi-wallet support (Freighter, Albedo, xBull via StellarWalletsKit).
  * Deployed Soroban `PaymentRegistry` contract for on-chain audit trails.
  * Backend payment indexing and transaction event verification.
  * Historical payment audit log.
* **Level 3: Black Belt (Planned)**:
  * Multi-address payment batches and automated split bill settlement.
  * Payment request links and tipping pages.
  * Real-time WebSocket payment notifications.
  * Production infrastructure and Mainnet readiness.

---

## Security Best Practices

* **Zero Private Key Storage**: The application never touches or requests private keys or seed phrases. All signatures occur inside the secure Freighter extension.
* **Non-Custodial**: Funds remain entirely in control of user wallets.
* **Strict Input Sanitization**: Ed25519 public keys and amounts are validated prior to transaction formulation.
* **Stellar Testnet Boundary**: Enforced test network passphrases preventing accidental Mainnet execution.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
