# Stellar Payment Hub - Web Application (Vite + React + Tailwind)

[![React 18](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com)
[![Freighter](https://img.shields.io/badge/Wallet-Freighter%20%7C%20DevKey-yellow.svg)](https://freighter.app)
[![Vitest](https://img.shields.io/badge/Vitest-75%20Tests%20Passing-brightgreen.svg)]()

Modern, high-performance web interface for seamless decentralized payments, split settlements, escrow release, and dispute management on the Stellar Network.

## Feature Showcase

- **Multi-Wallet Support**: Seamless integration with the Freighter browser wallet and instant Testnet Dev Sandbox keypairs.
- **Atomic Split Bill & Payroll Form**: Multi-recipient distribution with real-time zero-loss Stroop remainder visualization.
- **Interactive Escrow Timer**: Visual countdown to lockup expiration with one-click claim and refund dispatch.
- **Arbitration & Dispute Dashboard**: Merchant-buyer dispute resolution interface with evidence hash verification.
- **SEP-0007 QR & Payment Links**: Generate standard `web+stellar:pay` links with scannable vector SVG QR codes.
- **Gas & Fee Simulation Preview**: Live CPU and RAM gauges estimating Soroban resource fees before transaction signing.
- **Dark / Light Mode**: Instant theme switching with zero layout shift and accessible contrast ratios.
- **Offline & Network Mismatch Detection**: Real-time banners alerting users to network changes or lost connectivity.

## Technology Stack

- **Framework**: React 18 with TypeScript 5.5
- **Build Tool**: Vite 5 with manual vendor chunk splitting (`@stellar/stellar-sdk`, `lucide-react`)
- **Styling**: Tailwind CSS with custom Stellar dark/light palette
- **Icons**: Lucide React
- **Audio Feedback**: Web Audio API synthesizer for transaction sounds

## Getting Started

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run Vitest component tests (75 passing tests)
npm test

# Production build
npm run build
```

## License
MIT License - Copyright (c) 2026 omolobamoyinoluwa-max
