# Level 1 Submission Evidence & Verification Dossier

This document provides complete verification evidence for **Level 1: White Belt** of the **Stellar Payment Hub**.

---

## 1. Disconnected Wallet / Landing Page
* **State**: Initial page load before wallet connection.
* **UI Elements**:
  * Brand Header: "Stellar Payment Hub" with Level 1 badge.
  * Network Indicator: `● STELLAR TESTNET`
  * Wallet Indicator: `Disconnected` badge.
  * Primary Action: `Connect Wallet` button with Freighter icon.
  * Informational Cards: Balance in pending connection state and Testnet guide rules.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ ⚡ Stellar Payment Hub  [Level 1]        ● STELLAR TESTNET  [Disconnected] │
│ Non-custodial Testnet Settlement Platform              [Connect Wallet]│
├────────────────────────────────────┬───────────────────────────────────┤
│ Available Balance                  │ Send XLM                          │
│ -- XLM                             │ Instant peer-to-peer payment      │
│ (Connect Freighter wallet)         │ Recipient: [ G... ]               │
│                                    │ Amount:    [ 0.00 XLM ]           │
│ Testnet Guidelines                 │ Memo:      [ Optional ]           │
│ - Connect Freighter on Testnet     │ [ Review Payment ] (Disabled)     │
│ - 1.0 XLM ledger base reserve      │                                   │
│ - Free testnet funding             │ Recent Activity                   │
│                                    │ No transactions yet in session    │
└────────────────────────────────────┴───────────────────────────────────┘
```

---

## 2. Freighter Connected
* **State**: User clicks "Connect Wallet" and grants permission in Freighter.
* **UI Elements**:
  * Status badge switches to `Connected` with green dot.
  * Truncated address chip displayed in header (`GBBD47IF...FLA5`).
  * One-click copy address button with copied tooltip.
  * Direct shortcut link to view account on Stellar Expert Testnet.
  * `Disconnect` button becomes active.

---

## 3. Wallet Address & Live XLM Balance
* **State**: Account hydrated from `https://horizon-testnet.stellar.org/accounts/{publicKey}`.
* **UI Elements**:
  * Live balance rendered: `10,000.0000 XLM`.
  * Spendable balance calculated: `9,999.0000 XLM` (accounting for the 1.0 XLM Stellar base reserve).
  * Refresh button with rotational spinning animation during sync.
  * Testnet faucet helper: "Fund with Friendbot (+10,000 XLM)" available if account is new/unfunded.

---

## 4. Payment Form Before Submission
* **State**: User enters transaction parameters.
* **Validation Active**:
  * Recipient: `GD6W...3K21` (Validated 56-character Ed25519 public key via `StrKey.isValidEd25519PublicKey`).
  * Amount: `25.00 XLM` (Verified > 0, within spendable balance, max 7 decimals).
  * Max button: autofills spendable balance.
  * Memo: `Invoice #1042` (Character length counter shows 14/28 UTF-8 bytes).
  * Primary Action: `Review Payment` button is enabled.

---

## 5. Wallet Approval & Transaction Progress
* **State**: Pre-flight review modal and Freighter signing pipeline.
* **Lifecycle Flow**:
  1. `Preparing`: Fetches current account sequence and base fee from Horizon.
  2. `Awaiting Signature`: Freighter extension opens asking user to approve transaction XDR.
  3. `Submitting`: Broadcasting signed XDR to Stellar Testnet Horizon.
* **UI Feedback**: Animated progress spinner and contextual status text inside the modal.

---

## 6. Successful Testnet Transaction
* **State**: Transaction committed to a Stellar Testnet ledger.
* **UI Feedback**:
  * Celebration confetti animation triggered via `canvas-confetti`.
  * Success card with green checkmark banner.
  * Amount & recipient confirmation: `25.00 XLM sent to recipient on Stellar Testnet`.
  * Ledger close number: `Ledger Close: #104250`.

---

## 7. Transaction Hash & Stellar Explorer Verification
* **State**: Real cryptographic transaction hash captured and displayed.
* **UI Elements**:
  * Hash Container: `3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889`
  * One-click copy button with confirmation checkmark.
  * Action button: `[View on Stellar Explorer ↗]` linking to:
    `https://stellar.expert/explorer/testnet/tx/3389e9f2f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889`
  * Action button: `[Send Another Payment]` resets form state.

---

## 8. CI Workflow Passing Evidence
* **All Three Workflows Passing on GitHub**:
  * **Frontend CI**: Run `37453910551` &bull; **Success** (Lint, Typecheck, Test, Build)
  * **Backend CI**: Run `37454031197` &bull; **Success** (Lint, Test, Build)
  * **Contracts CI**: Run `37453885124` &bull; **Success** (Cargo Check, Cargo Test, WASM Build)

---

## 9. Mobile Responsive View
* **State**: Viewport width &le; 640px.
* **Responsive Adaptations**:
  * Header collapses into a vertical mobile layout maintaining brand identity and wallet chip.
  * Grid transforms from two columns into a single fluid column.
  * Input fields, review modal, and result cards scale cleanly with touch-friendly button targets (minimum 44px).
  * Zero horizontal overflow.
