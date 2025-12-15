# Pi² Cross-App Execution Fabric - Frontend Prototype

A Bloomberg terminal-style interface for managing cross-app DeFi strategies across Hyperliquid, Lighter, Morpho, PolyMarket, and more.

## Overview

This is a **frontend-only prototype** designed to refine the user experience before building backend infrastructure. All data is mocked to demonstrate the interface and workflow concepts.

## What This Demonstrates

### Core Features

1. **Unified Portfolio Dashboard**
   - Single view of positions across all apps
   - Real-time P&L tracking
   - Liquid balances and active positions
   - App-level breakdown

2. **Workflow Builder**
   - Visual multi-step workflow creation
   - Cross-app strategy execution
   - Real-time status tracking
   - Estimated gas calculations

3. **Execution History**
   - Verifiable execution receipts
   - Before/after state comparisons
   - Claim verification status
   - Downloadable audit logs

4. **Application Details**
   - Per-app portfolio breakdown
   - Connection status monitoring
   - Detailed position metrics
   - Balance tracking

5. **Agent API Interface**
   - Terminal-style command console
   - JSON payload builder
   - API documentation
   - Real-time execution logs

## Target Apps (MVP)

- **Hyperliquid** - Perpetuals DEX
- **Lighter** - Perpetuals DEX
- **Morpho** - Lending/Borrowing
- **PolyMarket** - Prediction Markets

## Technology Stack

- **React 19** + **TypeScript**
- **Vite** for blazing fast development
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Recharts** for data visualization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will be available at `http://localhost:5173`

Navigate between views using the sidebar:
- **Dashboard** - Portfolio overview
- **Workflows** - Create and manage multi-app strategies
- **History** - View execution receipts
- **Applications** - Per-app details
- **Agent API** - Programmatic interface

## Design Philosophy

### Apps > Chains
The interface talks in terms of applications (Hyperliquid, Lighter) not chains (Arbitrum, Ethereum).

### Workflows > Transactions
Users define high-level strategies, not individual transactions. A "basis trade" might be 6+ underlying transactions.

### Verifiable State Logs
Every execution produces machine-verifiable receipts with pre/post state and cryptographic proofs.

## Mock Data Structure

Located in `src/lib/mockData.ts`:

- **Apps** - Connected applications and their status
- **Balances** - Assets across all apps
- **Positions** - Active trading positions, loans, bets
- **Workflows** - Multi-step execution plans
- **Execution Receipts** - Verifiable execution logs

## UI/UX Principles

- **Bloomberg Terminal Aesthetic** - Professional, data-dense, dark theme
- **Real-time Updates** - Live position tracking and P&L
- **Verifiable Everything** - Cryptographic proofs and audit trails
- **One-Click Workflows** - Complex strategies in single actions
- **Agent-First** - Built for both human and programmatic use

## What's NOT Included (Yet)

- ❌ Backend API
- ❌ Real blockchain integrations
- ❌ Authentication
- ❌ Real-time data feeds
- ❌ Actual cross-chain bridging
- ❌ Smart contract interactions

This is intentional! We're validating UX before building infrastructure.

## Next Steps

1. **User Testing** - Get feedback from DeFi traders
2. **Refine Workflows** - Iterate on multi-app strategy builder
3. **API Design** - Define backend contracts based on UI needs
4. **Integration Planning** - Map out app-specific requirements

## Contributing

This is a prototype for internal testing. Feedback welcome!

## License

MIT
