# Contributing to Stellar Payment Hub Frontend

Thank you for contributing to the **Stellar Payment Hub** decentralized application!

## Prerequisites

- **Node.js**: 18.x or 20.x
- **Package Manager**: npm v9+
- **Recommended Extensions**: Tailwind CSS IntelliSense, ESLint, Prettier

## Architecture Overview

```
src/
├── components/
│   ├── wallet/           # Multi-wallet connection, network switch, RPC failover
│   ├── streaming/        # Real-time payment streams & visual flow meter
│   ├── subscriptions/    # Recurring plan authoring & direct debit portal
│   ├── escrow/           # 2-of-3 multi-sig arbitration & milestone progress
│   ├── remittance/       # Cross-border currency converter & SEP-24 anchors
│   ├── analytics/        # Treasury analytics, bar charts, and tax invoices
│   └── accessibility/    # WCAG AAA contrast, font scaler, keyboard shortcuts
├── lib/                  # Streaming math, cadence epochs, FX rates, offline queue
└── types/                # Strict TypeScript domain interfaces
```

## Local Development Workflow

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local Vite development server:
   ```bash
   npm run dev
   ```
3. Run the complete Vitest test suite:
   ```bash
   npm test
   ```
4. Verify TypeScript compilation:
   ```bash
   npx tsc -b
   ```
5. Build production bundle:
   ```bash
   npm run build
   ```

## Commit Standards

All commits must follow [Conventional Commits](https://www.conventionalcommits.org):
- `feat(frontend): implement feature`
- `fix(frontend): resolve UI or state bug`
- `test(frontend): add component or math test`
