# Stellar Payment Hub (Frontend) — Level 2: Yellow Belt

[![Frontend CI](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend/actions/workflows/ci.yml)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-38bdf8)](https://stellar.org)
[![Soroban Contract](https://img.shields.io/badge/Soroban-PaymentRegistry-a855f7)](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY)
[![Wallets](https://img.shields.io/badge/Wallets-Freighter%20%7C%20Albedo%20%7C%20xBull-818cf8)](https://freighter.app)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-000000?logo=vercel)](https://stellar-payment-frontend.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](LICENSE)

Stellar Payment Hub is a multi-wallet, programmable payment coordination and tracking platform built on the **Stellar Network** and **Soroban smart contracts**.

* **Live Demo URL**: [https://stellar-payment-frontend.vercel.app](https://stellar-payment-frontend.vercel.app)

---

## Level 2: Yellow Belt Capabilities

Level 2 advances the Level 1 foundation into a full smart-contract-powered payment ecosystem:

* [x] **Multi-Wallet Support**: Seamless connection layer supporting **Freighter**, **Albedo**, and **xBull** with comprehensive error handling (`Wallet Not Found`, `User Rejected`, `Network Mismatch`).
* [x] **Deployed Soroban Payment Contract**: Communicates directly with the deployed `PaymentRegistry` contract on Stellar Testnet:
  * **Contract Address**: [`CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY`](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY)
* [x] **Programmable Payment Creation**: Form to trigger on-chain `create_payment` invocations via Soroban, generating unique payment references (`PAY-001`, `PAY-002`) and on-chain record IDs.
* [x] **Real-Time Payment Tracker**:
  * Status filtering: `All`, `Pending`, `Processing`, `Completed`, `Failed`, `Cancelled`.
  * Search by payment ID, creator address, or recipient address.
  * Live Server-Sent Events (SSE) synchronization reflecting ledger events in real time without page reload.
  * Dedicated Payment Detail Modal with complete audit event timeline and Stellar Explorer links.
* [x] **Dual Dashboard Actions**:
  * Direct peer-to-peer XLM transfers (`Send XLM`).
  * Smart contract programmable settlement (`New Tracked Payment`).
* [x] **Comprehensive Testing & CI**: 32 unit and component tests passing with Vitest; automated GitHub Actions CI verifying linting, typechecking, tests, and production build.

---

## Polyrepo Architecture

```text
Stellar-Payment-Hub/
├── stellar-payment-frontend/   # (This repo) Multi-wallet dApp, Payment Tracker & Soroban client
├── stellar-payment-backend/    # Payment indexing API, idempotent event processor & SSE stream
└── stellar-payment-contracts/  # Soroban PaymentRegistry contract workspace
```

```text
                     FRONTEND
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Wallets       Payments       Tracker
          │              │              │
          └──────────────┼──────────────┘
                         │
                    Stellar SDK
                         │
             ┌───────────┴───────────┐
             │                       │
          Stellar                 Backend
          Testnet                   API
             │                       │
             │                 Event Processor
             │                       │
             └───────────┬───────────┘
                         │
                    Soroban Contract
                         │
                 PaymentRegistry
```

---

## Supported Wallets

| Wallet | Connection Type | Description |
| :--- | :--- | :--- |
| **Freighter** | Browser Extension | Secure hardware and local key signing |
| **Albedo** | Web / Popup | Universal browser wallet without extension |
| **xBull** | Browser Extension | Multi-platform Stellar wallet |

---

## Local Setup & Development

```bash
# Clone repository
git clone https://github.com/Stellar-Payment-Hub/stellar-payment-frontend.git
cd stellar-payment-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run development server
npm run dev

# Run automated tests (32 tests)
npm test

# Build production bundle
npm run build
```

---

## Roadmap

* **Level 1 (White Belt)**: Single-wallet XLM transfers, Horizon balance, input validation, transaction status.
* **Level 2 (Yellow Belt - Current)**: Multi-wallet integration, Soroban `PaymentRegistry` contract, real-time Payment Tracker with SSE, idempotent event processing.
* **Level 3 (Black Belt - Planned)**: Multi-address payment batches, split bills, tip jar requests, automated settlement contract, WebSocket live streams.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
