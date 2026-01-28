// Fast Terminal Mock Data
// $50,000 starting balance with positions across multiple protocols

export interface App {
  id: string;
  name: string;
  category: 'prediction' | 'perpetuals' | 'yield';
  description: string;
  shortcut: string;
  hasPositions: boolean;
  icon: string;
}

export interface Position {
  id: string;
  appId: string;
  market: string;
  side: 'long' | 'short' | 'yes' | 'no' | 'supply' | 'borrow';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

export interface Market {
  id: string;
  appId: string;
  name: string;
  category: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export interface Transaction {
  id: string;
  appId: string;
  type: 'deposit' | 'withdraw' | 'trade' | 'close';
  market?: string;
  amount: number;
  timestamp: number;
  status: 'confirmed' | 'pending';
}

export interface Command {
  command: string;
  description: string;
  example: string;
}

// Integrated Applications
export const apps: App[] = [
  {
    id: 'polymarket',
    name: 'Polymarket',
    category: 'prediction',
    description: 'Political, sports, and event prediction markets',
    shortcut: '1',
    hasPositions: true,
    icon: 'PM',
  },
  {
    id: 'kalshi',
    name: 'Kalshi',
    category: 'prediction',
    description: 'CFTC-regulated event contracts',
    shortcut: '2',
    hasPositions: false,
    icon: 'KA',
  },
  {
    id: 'opinion',
    name: 'Opinion',
    category: 'prediction',
    description: 'Decentralized prediction platform',
    shortcut: '3',
    hasPositions: false,
    icon: 'OP',
  },
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    category: 'perpetuals',
    description: 'High-performance perpetual DEX',
    shortcut: '4',
    hasPositions: true,
    icon: 'HL',
  },
  {
    id: 'lighter',
    name: 'Lighter',
    category: 'perpetuals',
    description: 'Orderbook-based perpetuals',
    shortcut: '5',
    hasPositions: false,
    icon: 'LT',
  },
  {
    id: 'pacifica',
    name: 'Pacifica',
    category: 'perpetuals',
    description: 'Low-fee perpetual trading',
    shortcut: '6',
    hasPositions: false,
    icon: 'PA',
  },
  {
    id: 'pendle',
    name: 'Pendle',
    category: 'yield',
    description: 'Yield tokenization and trading',
    shortcut: '7',
    hasPositions: true,
    icon: 'PE',
  },
  {
    id: 'morpho',
    name: 'Morpho',
    category: 'yield',
    description: 'Optimized lending protocol',
    shortcut: '8',
    hasPositions: true,
    icon: 'MO',
  },
];

// User Portfolio
export const portfolio = {
  totalValue: 54823.47,
  availableBalance: 28450.00,
  totalPnl: 4823.47,
  totalPnlPercent: 9.65,
  depositedValue: 50000.00,
};

// Active Positions
export const positions: Position[] = [
  {
    id: 'pos-1',
    appId: 'polymarket',
    market: 'Trump wins 2024',
    side: 'yes',
    size: 5000,
    entryPrice: 0.52,
    currentPrice: 0.58,
    pnl: 576.92,
    pnlPercent: 11.54,
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 'pos-2',
    appId: 'polymarket',
    market: 'ETH > $4000 by March',
    side: 'yes',
    size: 2500,
    entryPrice: 0.35,
    currentPrice: 0.42,
    pnl: 500.00,
    pnlPercent: 20.00,
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: 'pos-3',
    appId: 'hyperliquid',
    market: 'BTC-PERP',
    side: 'long',
    size: 8000,
    entryPrice: 42500,
    currentPrice: 44200,
    pnl: 320.00,
    pnlPercent: 4.00,
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'pos-4',
    appId: 'hyperliquid',
    market: 'ETH-PERP',
    side: 'long',
    size: 5000,
    entryPrice: 2250,
    currentPrice: 2380,
    pnl: 288.89,
    pnlPercent: 5.78,
    timestamp: Date.now() - 86400000 * 1,
  },
  {
    id: 'pos-5',
    appId: 'pendle',
    market: 'stETH Dec 2024',
    side: 'supply',
    size: 3500,
    entryPrice: 1.0,
    currentPrice: 1.045,
    pnl: 157.50,
    pnlPercent: 4.50,
    timestamp: Date.now() - 86400000 * 7,
  },
  {
    id: 'pos-6',
    appId: 'morpho',
    market: 'USDC Supply',
    side: 'supply',
    size: 2373.47,
    entryPrice: 1.0,
    currentPrice: 1.0,
    pnl: 0,
    pnlPercent: 8.5, // APY
    timestamp: Date.now() - 86400000 * 14,
  },
];

// Sample Markets for each app
export const markets: Market[] = [
  // Polymarket
  { id: 'pm-1', appId: 'polymarket', name: 'Trump wins 2024', category: 'Politics', price: 0.58, change24h: 2.1, volume24h: 12500000 },
  { id: 'pm-2', appId: 'polymarket', name: 'ETH > $4000 by March', category: 'Crypto', price: 0.42, change24h: 5.0, volume24h: 3200000 },
  { id: 'pm-3', appId: 'polymarket', name: 'Fed rate cut in Jan', category: 'Economics', price: 0.15, change24h: -3.2, volume24h: 8900000 },
  { id: 'pm-4', appId: 'polymarket', name: 'BTC > $100k by EOY', category: 'Crypto', price: 0.28, change24h: 1.5, volume24h: 15600000 },
  { id: 'pm-5', appId: 'polymarket', name: 'Super Bowl - Chiefs', category: 'Sports', price: 0.35, change24h: -1.0, volume24h: 4500000 },

  // Hyperliquid
  { id: 'hl-1', appId: 'hyperliquid', name: 'BTC-PERP', category: 'Perpetuals', price: 44200, change24h: 1.8, volume24h: 850000000 },
  { id: 'hl-2', appId: 'hyperliquid', name: 'ETH-PERP', category: 'Perpetuals', price: 2380, change24h: 2.4, volume24h: 420000000 },
  { id: 'hl-3', appId: 'hyperliquid', name: 'SOL-PERP', category: 'Perpetuals', price: 98.5, change24h: 4.2, volume24h: 180000000 },
  { id: 'hl-4', appId: 'hyperliquid', name: 'ARB-PERP', category: 'Perpetuals', price: 1.15, change24h: -0.8, volume24h: 45000000 },
  { id: 'hl-5', appId: 'hyperliquid', name: 'DOGE-PERP', category: 'Perpetuals', price: 0.082, change24h: 3.1, volume24h: 92000000 },

  // Pendle
  { id: 'pe-1', appId: 'pendle', name: 'stETH Dec 2024', category: 'Yield', price: 1.045, change24h: 0.2, volume24h: 12000000 },
  { id: 'pe-2', appId: 'pendle', name: 'eETH Mar 2025', category: 'Yield', price: 1.082, change24h: 0.5, volume24h: 8500000 },
  { id: 'pe-3', appId: 'pendle', name: 'rsETH Jun 2025', category: 'Yield', price: 1.12, change24h: 0.3, volume24h: 5200000 },

  // Morpho
  { id: 'mo-1', appId: 'morpho', name: 'USDC Supply', category: 'Lending', price: 1.0, change24h: 0, volume24h: 25000000 },
  { id: 'mo-2', appId: 'morpho', name: 'ETH Supply', category: 'Lending', price: 2380, change24h: 2.4, volume24h: 18000000 },
  { id: 'mo-3', appId: 'morpho', name: 'WBTC Supply', category: 'Lending', price: 44200, change24h: 1.8, volume24h: 15000000 },
];

// Transaction History
export const transactions: Transaction[] = [
  { id: 'tx-1', appId: 'system', type: 'deposit', amount: 50000, timestamp: Date.now() - 86400000 * 14, status: 'confirmed' },
  { id: 'tx-2', appId: 'polymarket', type: 'trade', market: 'Trump wins 2024', amount: 5000, timestamp: Date.now() - 86400000 * 3, status: 'confirmed' },
  { id: 'tx-3', appId: 'hyperliquid', type: 'trade', market: 'BTC-PERP', amount: 8000, timestamp: Date.now() - 86400000 * 2, status: 'confirmed' },
  { id: 'tx-4', appId: 'pendle', type: 'trade', market: 'stETH Dec 2024', amount: 3500, timestamp: Date.now() - 86400000 * 7, status: 'confirmed' },
  { id: 'tx-5', appId: 'morpho', type: 'trade', market: 'USDC Supply', amount: 2373.47, timestamp: Date.now() - 86400000 * 14, status: 'confirmed' },
  { id: 'tx-6', appId: 'polymarket', type: 'trade', market: 'ETH > $4000 by March', amount: 2500, timestamp: Date.now() - 86400000 * 5, status: 'confirmed' },
  { id: 'tx-7', appId: 'hyperliquid', type: 'trade', market: 'ETH-PERP', amount: 5000, timestamp: Date.now() - 86400000 * 1, status: 'confirmed' },
];

// Command Reference
export const commands: Command[] = [
  { command: '/trade [app] [market]', description: 'Open trading interface for specified market', example: '/trade polymarket trump' },
  { command: '/deposit [amount]', description: 'Initiate deposit flow', example: '/deposit 10000' },
  { command: '/withdraw [amount]', description: 'Initiate withdrawal flow', example: '/withdraw 5000' },
  { command: '/positions', description: 'Open unified positions dashboard', example: '/positions' },
  { command: '/close [position-id]', description: 'Close specific position', example: '/close pos-1' },
  { command: '/closeall [app]', description: 'Close all positions (optionally filter by app)', example: '/closeall hyperliquid' },
  { command: '/balance', description: 'Show current balance', example: '/balance' },
  { command: '/help', description: 'Show command reference', example: '/help' },
];

// Supported Chains
export const supportedChains = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB' },
  { id: 'optimism', name: 'Optimism', symbol: 'OP' },
  { id: 'base', name: 'Base', symbol: 'BASE' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX' },
];
