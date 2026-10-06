# Level 3: Orange Belt Submission Evidence & Verification Dossier

This document provides complete verification evidence for **Level 3: Orange Belt** of the **Stellar Payment Hub**.

---

## 1. Verified Public Artifacts

* **Live Frontend Demo**: [https://stellar-payment-frontend.vercel.app](https://stellar-payment-frontend.vercel.app)
* **Frontend Repository**: [https://github.com/Stellar-Payment-Hub/stellar-payment-frontend](https://github.com/Stellar-Payment-Hub/stellar-payment-frontend)
* **Backend Repository**: [https://github.com/Stellar-Payment-Hub/stellar-payment-backend](https://github.com/Stellar-Payment-Hub/stellar-payment-backend)
* **Smart Contracts Repository**: [https://github.com/Stellar-Payment-Hub/stellar-payment-contracts](https://github.com/Stellar-Payment-Hub/stellar-payment-contracts)
* **PaymentRegistry Contract Address**: [`CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S`](https://stellar.expert/explorer/testnet/contract/CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S)
* **SettlementRouter Contract Address**: [`CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E`](https://stellar.expert/explorer/testnet/contract/CAGDS3H6GSNB7FSSFFDAAO5MX3GNVCUBNKIVUI52TAK7PXUUEXYCM66E)
* **Verifiable Testnet Transaction**: [`3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889`](https://stellar.expert/explorer/testnet/tx/3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889)

---

## 2. Level 3 Feature Verification

### A. Multi-Address Payments (`MultiPaymentForm`)
* Supports 2 to 10 distinct recipient addresses in an atomic batch.
* Dynamic addition and removal of recipient rows.
* Pre-flight checks preventing:
  * Empty addresses
  * Non-G... addresses
  * Addresses with invalid checksums
  * Self-transfers
  * Duplicate recipient addresses
  * Zero / negative amounts
  * Total amount exceeding spendable balance

### B. Split Bill Calculator (`SplitBillForm`)
* **Equal Split**: Even division among all participants with remainder stroop handling.
* **Custom Split**: User-defined allocations with strict mathematical balance constraint (`sum(shares) == total`).
* Single-click conversion into a settled batch payment.

### C. Shareable Payment Requests (`PaymentRequestManager`)
* Generate shareable invoice links (`?tab=payments&request=REQ-001`).
* Configurable expiration timestamps and reference descriptions.
* Direct in-app fulfillment with transaction record creation.

### D. Public Tip Jar (`TipJarView`)
* Public tipping profile with QR code representation.
* Preset quick-tip buttons (`5 XLM`, `10 XLM`, `25 XLM`, `50 XLM`) and custom amount entry.
* Immediate on-chain ledger recording with explorer verification links.

### E. Payment Tracker 2.0 (`PaymentTracker`)
* Dual view switching: Single Registry Payments and Multi-Address Settlements (`SETTLE-xxx`).
* Status filtering: `All`, `Pending`, `Processing`, `Completed`, `Failed`, `Cancelled`.
* **Nested Settlement Tree Breakdown**:
  ```text
  Settlement #1 [100.0000 XLM]
   ├── GA5ZSEJY...KZVN — 50.0000 XLM [Completed] (PAY-SUB-1)
   ├── GCA3HNDW...X7R7 — 30.0000 XLM [Completed] (PAY-SUB-2)
   └── GBBD47IF...FLA5 — 20.0000 XLM [Completed] (PAY-SUB-3)
  ```
* Inter-contract call notification badge and real-time SSE stream sync.

### F. Transaction Ledger (`TransactionHistoryView`)
* Multi-filter support across transaction types: `Native Payment`, `Contract Payment`, `Settlement`, `Tip`.
* Real-time ledger sequence numbers and direct Stellar Expert explorer links.

---

## 3. Required Screenshot Evidence References

| Section | Feature | Interface Target |
| :--- | :--- | :--- |
| **Screenshot 1** | Desktop Dashboard | Balance card, Testnet active badge, quick actions grid, recent settlements overview |
| **Screenshot 2** | Multi-Wallet Modal | Selection interface with Freighter, Albedo, and xBull |
| **Screenshot 3** | Successful Payment | Transaction result card with hash, explorer button, and copy action |
| **Screenshot 4** | Payment Tracker 2.0 | Filter tabs, live SSE sync badge, and nested settlement breakdown modal |
| **Screenshot 5** | Multi-Address & Split Bill | Batch recipients form with balanced share allocation |
| **Screenshot 6** | Mobile Responsive View | Compact touch-friendly navigation and responsive cards |
| **Screenshot 7** | CI/CD Pipeline | Green GitHub Actions run passing lint, test, and build |
| **Screenshot 8** | Automated Test Output | Terminal execution showing 40+ passing tests |

---

## 4. Test Verification Output

### Frontend (40 tests passing)
```text
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

### Backend (16 tests passing)
```text
 ✓ health endpoint (2 tests)
 ✓ payments api (4 tests)
 ✓ settlements api (4 tests)
 ✓ payment requests api (3 tests)
 ✓ transactions api (3 tests)

Test Files  5 passed (5)
     Tests  16 passed (16)
```

### Smart Contracts (11 tests passing)
```text
running 5 tests (payment-registry)
test test::test_create_payment_success ... ok
test test::test_payment_status_transitions ... ok
test test::test_cancel_payment_by_creator ... ok
test test::test_unauthorized_payment_modification ... ok
test test::test_events_emission ... ok

running 6 tests (settlement-router)
test test::test_create_settlement_success ... ok
test test::test_split_bill_equal_shares ... ok
test test::test_settlement_validation_failures ... ok
test test::test_duplicate_recipient_rejection ... ok
test test::test_inter_contract_payment_execution ... ok
test test::test_cancel_settlement ... ok

test result: ok. 11 passed; 0 failed
```
