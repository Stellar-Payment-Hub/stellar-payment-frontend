# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Frontend Security Standards

1. **Non-Custodial Architecture**: Private keys and secret seed phrases are never accessed, handled, or stored by the web application. All transactions are securely signed via hardware wallets or browser wallet extensions (Freighter, xBull, Lobstr, Hana).
2. **Soroban Allowance Protection**: Pre-authorized spend caps require explicit user signature authorization before executing direct debits.
3. **RPC Failover & Integrity**: Transaction submission uses dynamic fallback across verified Stellar Horizon and Soroban RPC nodes.
4. **Offline Queue Encryption**: Offline transactions queued in local storage are validated against local tampering before broadcast.
5. **No Dangerous Evaluation**: Strict avoidance of `dangerouslySetInnerHTML` and unsanitized HTML execution to eliminate cross-site scripting (XSS) risks.

## Reporting a Vulnerability

To report a vulnerability in the frontend application:
1. **DO NOT** open a public issue.
2. Email full reproduction steps to **security@stellar-payment-hub.org**.
3. We acknowledge reports within 24 hours.
