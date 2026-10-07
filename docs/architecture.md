# Stellar Payment Hub — Frontend Architecture & Design

## System Architecture Overview

Stellar Payment Hub is structured across three cohesive repositories:
* **`stellar-payment-frontend`** (This repository): Production React 18 & TypeScript dApp client powering multi-wallet authentication, real-time balance hydration, atomic batch disbursements, bill splitting, and live push synchronization.
* **`stellar-payment-backend`**: High-performance Express API and event processor providing idempotent Soroban event indexing, transaction ledger aggregation, rate-limiting, and real-time SSE streams.
* **`stellar-payment-contracts`**: Soroban smart contract suite featuring `SettlementRouter` with inter-contract dispatch and `PaymentRegistry` persistent lifecycle store.

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

---

## Core Payment & Settlement Workflows

1. **Multi-Wallet Integration**: Supports Freighter, Albedo, and xBull extensions with automatic network validation preventing accidental Mainnet execution during Testnet operations.
2. **Account Hydration & Reserve Safeguards**: Queries Stellar Horizon `/accounts/{publicKey}` to retrieve native balances and subentry count, calculating spendable XLM after minimum reserve requirements (`2 * base_reserve + subentries * base_reserve`).
3. **Form & Arithmetic Validation**: Enforces StrKey Ed25519 checksum formatting, non-negative amounts, self-transfer rejection, and exact equality constraints for batch allocations (`sum(shares) == total`).
4. **Transaction Construction & Signing**: Loads sequence numbers, applies network base fee, and signs payloads with user-approved wallet credentials.
5. **Real-Time Push Synchronization**: Integrates persistent Server-Sent Events (SSE) via `/api/payments/stream` to update UI payment statuses immediately upon on-chain ledger confirmation without polling.
