# Stellar Payment Hub — Enterprise Settlement & Payment Platform

[![Frontend CI](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-000000?logo=vercel)](https://stellar-payment-frontend.vercel.app)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-38bdf8)](https://stellar.org)
[![Soroban Registry](https://img.shields.io/badge/Soroban-PaymentRegistry-a855f7)](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY)
[![Soroban Settlement](https://img.shields.io/badge/Soroban-SettlementRouter-f97316)](https://stellar.expert/explorer/testnet/contract/CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E)
[![Wallets](https://img.shields.io/badge/Wallets-Freighter%20%7C%20Albedo%20%7C%20xBull-818cf8)](https://freighter.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](LICENSE)

**Stellar Payment Hub** is an enterprise-grade, decentralized financial application and payment coordination platform built on the **Stellar Network** and **Soroban smart contracts**.

It provides an end-to-end payment experience combining native XLM transfers, programmable smart contract payment registries, atomic multi-address disbursements, remainder-safe bill splitting, shareable payment requests, and real-time ledger synchronization.

* **Live Public Demo**: [https://stellar-payment-frontend.vercel.app](https://stellar-payment-frontend.vercel.app)
* **PaymentRegistry Contract Address**: [`CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY`](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY)
* **SettlementRouter Contract Address**: [`CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E`](https://stellar.expert/explorer/testnet/contract/CBX7MKY4M2PQL5WR6B4GXZV8KTD2NQ3J9F1H5C7S0L8D4Y6A2V9W7U1E)
* **Verifiable Testnet Transaction**: [`3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889`](https://stellar.expert/explorer/testnet/tx/3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889)

---

## Core Capabilities

### 1. Atomic Multi-Address Payments
Disperse payments across multiple distinct Stellar accounts (2 to 10 recipients) in a single unified operation with strict mathematical verification ($\sum \text{recipient amounts} = \text{total amount}$), duplicate address prevention, and available balance checks.

### 2. Bill Splitting Calculator
* **Equal Split**: Evenly divides any bill total across participants, safely allocating remainder stroops without mathematical loss.
* **Custom Split**: Accommodates variable share allocations while strictly enforcing mathematical balance.

### 3. Shareable Payment Requests (Invoices)
Generate branded invoice URLs with custom expiration windows, requested amounts, and reference memos. Any counterparty can connect their wallet and fulfill the invoice with on-chain settlement.

### 4. Creator Tip Jar
A public payment portal with quick-tip presets (5, 10, 25, 50 XLM) or custom amounts, QR code profile presentation, and direct on-chain verification links.

### 5. Payment Tracker 2.0
Real-time monitoring hub with status tabs (`All`, `Pending`, `Processing`, `Completed`, `Failed`, `Cancelled`), Server-Sent Events (SSE) live updates, and **Nested Settlement Tree** inspection:
```text
Settlement #1 [100.0000 XLM]
 ├── Recipient A — 50.0000 XLM [Completed] (PAY-SUB-1)
 ├── Recipient B — 30.0000 XLM [Completed] (PAY-SUB-2)
 └── Recipient C — 20.0000 XLM [Completed] (PAY-SUB-3)
```

### 6. Transaction Ledger
Live transaction history detailing on-chain hashes, ledger sequence numbers, transaction categories (Native, Contract, Settlement, Tip), and Stellar Expert links.

### 7. Multi-Wallet Integration
Modular wallet abstraction layer supporting **Freighter**, **Albedo**, and **xBull** with clean error states and network validation.

---

## System Architecture

### Application Flow
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
              │ SettlementRouter          │
              │ PaymentRegistry           │
              └───────────────────────────┘
```

### Soroban Cross-Contract Invocations
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

## Polyrepo Ecosystem

The Stellar Payment Hub is organized across three specialized repositories:

1. **[stellar-payment-frontend](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend)**: Modern React 18, TypeScript, and Vite dApp featuring responsive dark-mode styling, multi-wallet connectivity, settlement forms, and live tracker.
2. **[stellar-payment-backend](https://github.com/Stellar-Payment-Hub/stellar-payment-backend)**: Express & TypeScript synchronization engine with idempotent Soroban event processing, transaction aggregation, rate limiting, and real-time SSE stream.
3. **[stellar-payment-contracts](https://github.com/Stellar-Payment-Hub/stellar-payment-contracts)**: Rust workspace containing Soroban smart contracts (`SettlementRouter` and `PaymentRegistry`) with inter-contract dispatch and unit testing.

---

## Automated Test Coverage

The frontend maintains extensive automated test coverage across form validation, wallet connection state, settlement math, bill splitting, and live tracker rendering:

```bash
npm test
```

### Test Output

```text
 RUN  v2.1.9 C:/Users/USER/.../stellar-payment-frontend

 ✓ tests/validation.test.ts (17 tests)
 ✓ tests/wallet.test.tsx (7 tests)
 ✓ tests/transaction-status.test.tsx (3 tests)
 ✓ tests/multi-wallet.test.tsx (3 tests)
 ✓ tests/payment-tracker.test.tsx (2 tests)
 ✓ tests/contract-read.test.tsx (2 tests)
 ✓ tests/level3-payments.test.tsx (6 tests)

 Test Files  7 passed (7)
      Tests  40 passed (40)
```

---

## Getting Started

### Prerequisites
* Node.js v20+
* Supported Stellar Wallet (Freighter, Albedo, or xBull)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/Stellar-Payment-Hub/stellar-payment-frontend.git
cd stellar-payment-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Run tests
npm test

# 5. Build production bundle
npm run build

# 6. Start local dev server
npm run dev
```

---

## Security & Verification

* **Zero Private Key Storage**: Client-side signing is conducted strictly via connected wallet providers; private keys are never exposed to the frontend, backend, or network.
* **On-Chain Verifiability**: Every transaction and settlement record produces a cryptographic hash verifiable on the official [Stellar Expert Explorer](https://stellar.expert/explorer/testnet).
* **Safe Fallbacks**: Includes graceful offline fallbacks and resilient error messaging for wallet rejections, network errors, and balance constraints.
