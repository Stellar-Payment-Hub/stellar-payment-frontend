# Stellar Payment Hub - Architecture & Design

## System Architecture Overview

Stellar Payment Hub is structured across three polyrepos:
* **`stellar-payment-frontend`** (This repository): Non-custodial dApp client powering the core user loop, Freighter wallet authentication, balance inquiry, and Stellar payment dispatch.
* **`stellar-payment-backend`**: Foundation Node.js service establishing health checks, future transaction indexing, and real-time payment tracking.
* **`stellar-payment-contracts`**: Soroban smart contract workspace hosting the `payment-registry` scaffold for on-chain audit trails in Level 2.

```
+-------------------------------------------------------------+
|                  Stellar Payment Hub (Frontend)             |
|                                                             |
|  +---------------------+        +------------------------+  |
|  |   Freighter Wallet  |        |    Stellar SDK (V13)   |  |
|  |      Integration    |        |   Transaction Builder  |  |
|  +----------+----------+        +-----------+------------+  |
+-------------|-------------------------------|---------------+
              | Request Access / Sign         | Submit TX
              v                               v
+-----------------------------+   +---------------------------+
|      Freighter Extension    |   |  Stellar Testnet Horizon  |
|     (Ed25519 Keypair)       |   | (horizon-testnet.stellar) |
+-----------------------------+   +-------------+-------------+
                                                |
                                                v
                                  +---------------------------+
                                  |    Stellar Expert / RPC   |
                                  |     Ledger Verification   |
                                  +---------------------------+
```

## Level 1 Core Payment Loop

1. **Wallet Initialization**: Detects Freighter extension injection, checks connection status, and requests account public key.
2. **Account Hydration**: Queries Stellar Horizon `/accounts/{publicKey}` to retrieve native balances and subentry count, calculating spendable XLM after minimum reserve requirements.
3. **Form Validation**: Strict client-side checks for Ed25519 recipient formatting, positive non-zero balance limits, and 28-byte memo UTF-8 boundary.
4. **Transaction Construction**: Loads sequence number, applies base network fee (100 stroops), appends native payment or create-account operation, and generates unsigned transaction XDR.
5. **Freighter Signature**: Passes XDR to Freighter extension for user review and cryptographic signature.
6. **Horizon Ingestion & Feedback**: Submits signed XDR to Testnet Horizon, captures real transaction hash, and displays direct links to Stellar Expert Explorer.
