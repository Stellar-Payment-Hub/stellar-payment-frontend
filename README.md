# Stellar Payment Hub (Frontend) — Level 3: Orange Belt

[![Frontend CI](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-38bdf8)](https://stellar.org)
[![Soroban Registry](https://img.shields.io/badge/Soroban-PaymentRegistry-a855f7)](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY)
[![Soroban Settlement](https://img.shields.io/badge/Soroban-SettlementRouter-f97316)](https://stellar.expert/explorer/testnet/contract/CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E)
[![Wallets](https://img.shields.io/badge/Wallets-Freighter%20%7C%20Albedo%20%7C%20xBull-818cf8)](https://freighter.app)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-000000?logo=vercel)](https://stellar-payment-frontend.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](LICENSE)

Stellar Payment Hub is a production-oriented, programmable payment platform built on the **Stellar Network** and **Soroban smart contracts**.

* **Live Public Demo**: [https://stellar-payment-frontend.vercel.app](https://stellar-payment-frontend.vercel.app)
* **PaymentRegistry Contract Address**: [`CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY`](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY)
* **SettlementRouter Contract Address**: [`CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E`](https://stellar.expert/explorer/testnet/contract/CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E)
* **Verifiable Testnet Transaction**: [`3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889`](https://stellar.expert/explorer/testnet/tx/3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889)

---

## Level 3: Orange Belt Features

Level 3 evolves the platform from simple single payments and tracker into a complete multi-address settlement architecture:

1. **Multi-Address Payments**: Batch transfer payments to multiple Stellar addresses simultaneously with real-time balance validation, duplicate address prevention, and atomic settlement execution.
2. **Split Bill Calculator**:
   * **Equal Split**: Automatically calculates equal shares for multiple participants, handling fractional stroops and remainder assignment.
   * **Custom Split**: Allows arbitrary share allocation, enforcing that $\sum \text{shares} = \text{total bill}$.
3. **Payment Requests (Invoices)**: Create shareable payment request URLs with expiry, amount, and reference memos. Connected payers can fulfill requests directly with on-chain settlement.
4. **Creator Tip Jar**: Public-facing tipping portal supporting preset amounts (5, 10, 25, 50 XLM) and custom amounts with QR profile representation and explorer verification.
5. **Payment Tracker 2.0**:
   * Dual tabs for Single Payments and Multi-Address Settlements (`SETTLE-xxx`).
   * Nested Settlement Recipient Tree breakdown:
     ```text
     Settlement #1 [100.0000 XLM]
      ├── Recipient A — 50.0000 XLM [Completed] (PAY-SUB-1)
      ├── Recipient B — 30.0000 XLM [Completed] (PAY-SUB-2)
      └── Recipient C — 20.0000 XLM [Completed] (PAY-SUB-3)
     ```
   * Full event audit timeline and live SSE stream sync (`Live Sync` indicator).
6. **Transaction History Ledger**: Indexed on-chain transaction stream with filtering by type (Native, Contract, Settlement, Tip), status, and ledger height.
7. **Soroban Inter-Contract Communication**: The `SettlementRouter` contract executes multi-recipient settlements by invoking `PaymentRegistry::create_payment` on-chain for each recipient entry.

---

## Required Architecture Diagrams

### 1. Application Architecture

```text
┌────────────────────────────────────────────────────────┐
│                        FRONTEND                        │
│                                                        │
│  Dashboard │ Payments │ Multi-Pay │ Split │ Tip Jar    │
│  Tracker 2.0 │ Transactions │ Faucet Developer         │
└───────────────────────────┬────────────────────────────┘
                            │
               Wallet / API / SSE Stream
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌──────────────┐                       ┌─────────────────┐
│ Stellar      │                       │ Backend API     │
│ Wallets      │                       │ (REST / SSE)    │
│ (Freighter,  │                       │ Event Processor │
│ Albedo,      │                       │ PostgreSQL      │
│ xBull)       │                       └────────┬────────┘
└───────┬──────┘                                │
        └───────────────────┬───────────────────┘
                            ▼
              ┌───────────────────────────┐
              │      Stellar Testnet      │
              │                           │
              │ Native XLM Transfers      │
              │ Soroban Contract Events   │
              └─────────────┬─────────────┘
                            ▼
              ┌───────────────────────────┐
              │     Soroban Contracts     │
              │                           │
              │ SettlementRouter (L3)     │
              │ PaymentRegistry (L2)      │
              └───────────────────────────┘
```

---

### 2. Contract Inter-Communication Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                      SettlementRouter Contract                  │
│             CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E │
│                                                                 │
│  execute_settlement(env, payer, total, recipients, memo)        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                 Inter-Contract Cross-Invocation
              PaymentRegistryClient::create_payment
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PaymentRegistry Contract                    │
│             CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY │
│                                                                 │
│  create_payment(env, creator, recipient, amount, memo)          │
│  Storage: Persistent Map [payment_id -> PaymentRecord]          │
│  Event: PaymentCreated(id, creator, recipient, amount)          │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. Event Streaming Architecture

```text
   Soroban Contract Event Emitted
                 │
                 ▼
     Backend Event Processor
      (Deduplication & Validation)
                 │
                 ▼
      PostgreSQL Persistence
    (Idempotent Event Log & State)
                 │
                 ▼
       Realtime SSE Stream
      (/api/payments/stream)
                 │
                 ▼
         Frontend Hook
      (usePaymentStream)
                 │
                 ▼
       Payment Tracker 2.0
      (Live Status Update UI)
```

---

### 4. Multi-Payment & Settlement Architecture

```text
                          Payer Wallet
                               │
                               ▼
               SettlementRouter Contract
               Total: 100.0000 XLM
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
  Recipient A             Recipient B             Recipient C
   50.00 XLM               30.00 XLM               20.00 XLM
[PAY-SUB-1]             [PAY-SUB-2]             [PAY-SUB-3]
```

---

## Automated Test Suites

Level 3 includes comprehensive automated unit and component testing:

```bash
npm test
```

### Test Output

```text
 RUN  v2.1.9 C:/Users/USER/.../stellar-payment-frontend

 ✓ tests/validation.test.ts (17 tests) 21ms
 ✓ tests/wallet.test.tsx (7 tests) 244ms
 ✓ tests/transaction-status.test.tsx (3 tests) 190ms
 ✓ tests/multi-wallet.test.tsx (3 tests) 160ms
 ✓ tests/payment-tracker.test.tsx (2 tests) 316ms
 ✓ tests/contract-read.test.tsx (2 tests) 216ms
 ✓ tests/level3-payments.test.tsx (6 tests) 415ms

 Test Files  7 passed (7)
      Tests  40 passed (40)
   Duration  5.02s
```

---

## Local Development

```bash
# Clone
git clone https://github.com/Stellar-Payment-Hub/stellar-payment-frontend.git
cd stellar-payment-frontend

# Install
npm install

# Test
npm test

# Build
npm run build

# Development Server
npm run dev
```

---

## Live Deployment Evidence

* **Hosted Deployment**: [https://stellar-payment-frontend.vercel.app](https://stellar-payment-frontend.vercel.app)
* **Framework**: React 18, TypeScript, Vite
* **Styling**: Vanilla CSS with curated responsive dark palette
* **Contract Explorer**: [PaymentRegistry](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY) | [SettlementRouter](https://stellar.expert/explorer/testnet/contract/CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E)
