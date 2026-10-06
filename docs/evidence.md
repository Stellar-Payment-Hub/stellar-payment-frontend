# Level 2: Yellow Belt Submission Evidence & Verification Dossier

This document provides complete verification evidence for **Level 2: Yellow Belt** of the **Stellar Payment Hub**.

---

## 1. Multiple Wallet Options
* **Interface**: Multi-Wallet selection modal (`WalletSelectModal`).
* **Supported Adapters**:
  1. **Freighter** (Stellar browser extension)
  2. **Albedo** (Universal web-based authentication)
  3. **xBull** (Multi-platform desktop/browser wallet)
* **Error Handling**: Distinct handling for `Wallet Not Found`, `User Rejected`, and `Network Mismatch`.

```text
┌──────────────────────────────────────────────┐
│  Connect Wallet                              │
│  Select a Stellar wallet for Testnet:        │
│                                              │
│  [ Freighter ] Browser extension             │
│  [ Albedo    ] Web popup authentication      │
│  [ xBull     ] Multi-platform wallet         │
└──────────────────────────────────────────────┘
```

---

## 2. Connected Wallet & Navigation
* **State**: Active wallet badge displayed (`FREIGHTER` / `ALBEDO` / `XBULL`), truncated public address chip, one-click copy, and disconnect button.
* **Navigation Tabs**:
  * `[ Dashboard ]`: Balance, direct transfers, programmable payments overview.
  * `[ Payment Tracker ]`: Full tracked payment lifecycle and audit trail.
  * `[ New Tracked Payment ]`: Soroban contract invocation form.

---

## 3. XLM Balance Retrieval & Faucet
* **State**: Real Testnet balance hydrated from `https://horizon-testnet.stellar.org`.
* **Spendable Calculations**: Deducts base reserve (1.0 XLM) and subentries.
* **Friendbot Faucet**: In-app grant button (+10,000 Testnet XLM) for newly generated accounts.

---

## 4. Tracked Payment Creation
* **Component**: `CreateTrackedPaymentForm`.
* **Fields**: Recipient address (validated Ed25519), Amount (XLM), Memo / Reference note.
* **Pre-flight Validation**: Checks for valid 56-char public key, positive non-zero amount, stroop precision, and UTF-8 memo limit.

---

## 5. Soroban Contract Call
* **Function Invoked**: `PaymentRegistry.create_payment(creator, recipient, amount, memo)`.
* **Contract Address**: [`CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY`](https://stellar.expert/explorer/testnet/contract/CCBUEU4J4YXGSWURDMKUONPNGQ4ETBACWO5PC7IL5H4DVNYWJLYFETGY).
* **Execution**: Transaction built using `@stellar/stellar-sdk` `invokeContractFunction`, signed with user wallet, and submitted to Horizon Testnet.

---

## 6. Payment Tracker
* **Component**: `PaymentTracker`.
* **Features**:
  * Tab filtering: `All`, `Pending`, `Processing`, `Completed`, `Failed`, `Cancelled`.
  * Instant search filter: by ID (`PAY-001`), recipient, or creator.
  * Payment Card: Shows reference ID, On-chain ID (`#1`), Amount in XLM, Recipient, and Status pill.

```text
┌────────────────────────────────────────────────────────┐
│  Payment Tracker                 ● Live Sync [Refresh] │
│  [All] [Pending] [Processing] [Completed] [Failed]     │
│  [ Search by ID or address...                        ] │
├────────────────────────────────────────────────────────┤
│  PAY-001 (#1)   To: GA5ZSEJY...KZVN   25.00 XLM   🟡 PENDING     │
│  PAY-002 (#2)   To: GCA3HNDW...X7R7   10.00 XLM   ✓ COMPLETED   │
│  PAY-003 (#3)   To: GBBD47IF...FLA5   15.50 XLM   ● PROCESSING  │
└────────────────────────────────────────────────────────┘
```

---

## 7. Payment Detail Modal & Audit Events
* **Component**: `PaymentDetailModal`.
* **Breakdown**: Displays full on-chain metadata, Creator, Recipient, Memo, Contract Address, Transaction Hash, and the timestamped timeline of lifecycle events (`PaymentCreated`, `PaymentUpdated`, `PaymentCompleted`).

---

## 8. Real-Time Status Updates via SSE
* **Mechanism**: Server-Sent Events stream (`GET /api/payments/stream`).
* **Behavior**: When an on-chain event or backend transaction occurs, the backend broadcasts `payment:updated`. Connected frontend clients update payment statuses immediately without requiring a full page refresh.

---

## 9. Transaction Hash & Stellar Explorer Verification
* **Cryptographic Hash**: Rendered with copy-to-clipboard functionality and verified on Stellar Expert:
  `https://stellar.expert/explorer/testnet/tx/{hash}`.

---

## 10. Automated Tests & CI Verification
* **Frontend**: 34 unit and component tests passing (`validation`, `wallet`, `transaction-status`, `multi-wallet`, `payment-tracker`, `contract-read`).
* **Backend**: 7 API and event idempotency tests passing.
* **Contracts**: 5 Soroban unit tests verifying create, read, state machine transitions, and error handling.
* **GitHub Actions CI**: Automated pipelines passing on all three repositories.

---

## 11. Live Production Deployment
* **Hosting Platform**: Vercel
* **Production URL**: [https://stellar-payment-frontend.vercel.app](https://stellar-payment-frontend.vercel.app)
* **Status**: Live, verified, and communicating with Stellar Testnet & Soroban PaymentRegistry contract `CCBUEU...ETGY`.
