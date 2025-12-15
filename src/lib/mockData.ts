export type AppType = 'hyperliquid' | 'lighter' | 'morpho' | 'polymarket';

export interface AppInfo {
  id: AppType;
  name: string;
  type: 'perps' | 'lending' | 'prediction';
  chain: string;
  color: string;
  status: 'connected' | 'disconnected' | 'error';
}

export interface Balance {
  asset: string;
  amount: number;
  valueUsd: number;
  app: AppType;
  chain: string;
}

export interface Position {
  id: string;
  app: AppType;
  asset: string;
  type: 'long' | 'short' | 'lend' | 'borrow' | 'bet';
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage?: number;
  pnl: number;
  pnlPercent: number;
  collateral?: number;
  liquidationPrice?: number;
  apr?: number;
}

export interface WorkflowStep {
  id: string;
  action: string;
  app: AppType;
  details: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'draft' | 'executing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  estimatedGas?: number;
}

export interface ExecutionReceipt {
  id: string;
  workflowId: string;
  timestamp: number;
  preState: {
    totalValue: number;
    positions: Position[];
    balances: Balance[];
  };
  postState: {
    totalValue: number;
    positions: Position[];
    balances: Balance[];
  };
  claims: {
    id: string;
    type: string;
    app: AppType;
    status: 'verified' | 'pending' | 'failed';
    proof?: string;
  }[];
  gasUsed: number;
  executionTime: number;
}

// Mock data
export const apps: AppInfo[] = [
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    type: 'perps',
    chain: 'Arbitrum',
    color: '#00D4AA',
    status: 'connected',
  },
  {
    id: 'lighter',
    name: 'Lighter',
    type: 'perps',
    chain: 'Arbitrum',
    color: '#FF6B6B',
    status: 'connected',
  },
  {
    id: 'morpho',
    name: 'Morpho',
    type: 'lending',
    chain: 'Ethereum',
    color: '#4A90E2',
    status: 'connected',
  },
  {
    id: 'polymarket',
    name: 'PolyMarket',
    type: 'prediction',
    chain: 'Polygon',
    color: '#9945FF',
    status: 'connected',
  },
];

export const balances: Balance[] = [
  // Hyperliquid
  { asset: 'USDC', amount: 15420.50, valueUsd: 15420.50, app: 'hyperliquid', chain: 'Arbitrum' },
  { asset: 'ETH', amount: 2.45, valueUsd: 8330.25, app: 'hyperliquid', chain: 'Arbitrum' },

  // Lighter
  { asset: 'USDC', amount: 8750.00, valueUsd: 8750.00, app: 'lighter', chain: 'Arbitrum' },
  { asset: 'BTC', amount: 0.125, valueUsd: 12625.00, app: 'lighter', chain: 'Arbitrum' },

  // Morpho
  { asset: 'USDC', amount: 25000.00, valueUsd: 25000.00, app: 'morpho', chain: 'Ethereum' },
  { asset: 'CBBTC', amount: 0.5, valueUsd: 50500.00, app: 'morpho', chain: 'Ethereum' },

  // PolyMarket
  { asset: 'USDC', amount: 3200.00, valueUsd: 3200.00, app: 'polymarket', chain: 'Polygon' },
];

export const positions: Position[] = [
  // Hyperliquid positions
  {
    id: 'hl-eth-long-1',
    app: 'hyperliquid',
    asset: 'ETH-PERP',
    type: 'long',
    size: 5.0,
    entryPrice: 3300.00,
    currentPrice: 3398.50,
    leverage: 3,
    pnl: 492.50,
    pnlPercent: 2.99,
    collateral: 5500.00,
    liquidationPrice: 2900.00,
  },
  {
    id: 'hl-btc-short-1',
    app: 'hyperliquid',
    asset: 'BTC-PERP',
    type: 'short',
    size: 0.25,
    entryPrice: 102000.00,
    currentPrice: 101000.00,
    leverage: 2,
    pnl: 250.00,
    pnlPercent: 0.98,
    collateral: 12750.00,
    liquidationPrice: 112000.00,
  },

  // Lighter positions
  {
    id: 'lt-sol-long-1',
    app: 'lighter',
    asset: 'SOL-PERP',
    type: 'long',
    size: 100.0,
    entryPrice: 205.00,
    currentPrice: 218.50,
    leverage: 5,
    pnl: 1350.00,
    pnlPercent: 6.59,
    collateral: 4100.00,
    liquidationPrice: 182.00,
  },

  // Morpho positions
  {
    id: 'mp-usdc-lend-1',
    app: 'morpho',
    asset: 'USDC',
    type: 'lend',
    size: 25000.00,
    entryPrice: 1.00,
    currentPrice: 1.00,
    pnl: 125.00,
    pnlPercent: 0.50,
    apr: 6.2,
  },
  {
    id: 'mp-cbbtc-borrow-1',
    app: 'morpho',
    asset: 'CBBTC',
    type: 'borrow',
    size: 0.5,
    entryPrice: 101000.00,
    currentPrice: 101000.00,
    pnl: -84.17,
    pnlPercent: -0.17,
    collateral: 60000.00,
    apr: 2.1,
  },

  // PolyMarket positions
  {
    id: 'pm-election-1',
    app: 'polymarket',
    asset: '2024 Election Winner',
    type: 'bet',
    size: 3000.00,
    entryPrice: 0.52,
    currentPrice: 0.58,
    pnl: 345.00,
    pnlPercent: 11.50,
  },
];

export const workflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'ETH Basis Trade Setup',
    description: 'Borrow USDC from Morpho, deploy to Hyperliquid and Lighter for ETH basis trade',
    status: 'completed',
    createdAt: Date.now() - 3600000,
    completedAt: Date.now() - 3500000,
    estimatedGas: 0.025,
    steps: [
      {
        id: 'step-1',
        action: 'Verify Collateral',
        app: 'morpho',
        details: 'Verify CBBTC collateral on Morpho (0.5 BTC)',
        status: 'completed',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'step-2',
        action: 'Borrow USDC',
        app: 'morpho',
        details: 'Borrow 25,000 USDC against BTC collateral',
        status: 'completed',
        timestamp: Date.now() - 3580000,
      },
      {
        id: 'step-3',
        action: 'Route Capital',
        app: 'hyperliquid',
        details: 'Send 15,000 USDC to Hyperliquid vault',
        status: 'completed',
        timestamp: Date.now() - 3560000,
      },
      {
        id: 'step-4',
        action: 'Route Capital',
        app: 'lighter',
        details: 'Send 10,000 USDC to Lighter vault',
        status: 'completed',
        timestamp: Date.now() - 3540000,
      },
      {
        id: 'step-5',
        action: 'Open Position',
        app: 'hyperliquid',
        details: 'Long ETH-PERP, 5.0 ETH @ 3x leverage',
        status: 'completed',
        timestamp: Date.now() - 3520000,
      },
      {
        id: 'step-6',
        action: 'Open Position',
        app: 'lighter',
        details: 'Long SOL-PERP, 100 SOL @ 5x leverage',
        status: 'completed',
        timestamp: Date.now() - 3500000,
      },
    ],
  },
  {
    id: 'wf-2',
    name: 'Election Hedge',
    description: 'Deploy remaining capital to PolyMarket for election bet',
    status: 'draft',
    createdAt: Date.now() - 1800000,
    estimatedGas: 0.012,
    steps: [
      {
        id: 'step-1',
        action: 'Route Capital',
        app: 'polymarket',
        details: 'Send 3,000 USDC to PolyMarket',
        status: 'pending',
      },
      {
        id: 'step-2',
        action: 'Place Bet',
        app: 'polymarket',
        details: 'Bet on 2024 Election Winner @ 0.52',
        status: 'pending',
      },
    ],
  },
];

export const executionReceipts: ExecutionReceipt[] = [
  {
    id: 'receipt-1',
    workflowId: 'wf-1',
    timestamp: Date.now() - 3500000,
    preState: {
      totalValue: 125000.00,
      positions: [],
      balances: [
        { asset: 'USDC', amount: 50000.00, valueUsd: 50000.00, app: 'morpho', chain: 'Ethereum' },
        { asset: 'CBBTC', amount: 0.5, valueUsd: 50500.00, app: 'morpho', chain: 'Ethereum' },
      ],
    },
    postState: {
      totalValue: 127482.58,
      positions: positions.slice(0, 4),
      balances: balances,
    },
    claims: [
      {
        id: 'claim-1',
        type: 'collateral_verification',
        app: 'morpho',
        status: 'verified',
        proof: '0x1a2b3c4d5e6f...',
      },
      {
        id: 'claim-2',
        type: 'borrow_state',
        app: 'morpho',
        status: 'verified',
        proof: '0x2b3c4d5e6f7a...',
      },
      {
        id: 'claim-3',
        type: 'vault_deposit',
        app: 'hyperliquid',
        status: 'verified',
        proof: '0x3c4d5e6f7a8b...',
      },
      {
        id: 'claim-4',
        type: 'vault_deposit',
        app: 'lighter',
        status: 'verified',
        proof: '0x4d5e6f7a8b9c...',
      },
      {
        id: 'claim-5',
        type: 'position_open',
        app: 'hyperliquid',
        status: 'verified',
        proof: '0x5e6f7a8b9c0d...',
      },
      {
        id: 'claim-6',
        type: 'position_open',
        app: 'lighter',
        status: 'verified',
        proof: '0x6f7a8b9c0d1e...',
      },
    ],
    gasUsed: 0.0234,
    executionTime: 100,
  },
];

// Helper functions
export function getTotalPortfolioValue(): number {
  const balanceValue = balances.reduce((sum, b) => sum + b.valueUsd, 0);
  const positionValue = positions.reduce((sum, p) => sum + (p.size * p.currentPrice), 0);
  return balanceValue + positionValue;
}

export function getTotalPnL(): number {
  return positions.reduce((sum, p) => sum + p.pnl, 0);
}

export function getAppBreakdown() {
  return apps.map(app => {
    const appBalances = balances.filter(b => b.app === app.id);
    const appPositions = positions.filter(p => p.app === app.id);

    const totalValue = appBalances.reduce((sum, b) => sum + b.valueUsd, 0) +
                      appPositions.reduce((sum, p) => sum + (p.size * p.currentPrice), 0);

    const totalPnl = appPositions.reduce((sum, p) => sum + p.pnl, 0);

    return {
      app,
      totalValue,
      totalPnl,
      positions: appPositions.length,
      balances: appBalances.length,
    };
  });
}
