// Advanced Trading Opportunities & Strategies Mock Data
// Realistic data for prosumer/retail traders

// =============================================================================
// 1. FUNDING RATE ARBITRAGE
// Long on one exchange, short on another to capture funding rate differentials
// =============================================================================
export interface FundingArbitrage {
  id: string;
  asset: string;
  longExchange: string;
  shortExchange: string;
  longFundingRate: number; // negative = get paid to long
  shortFundingRate: number; // positive = get paid to short
  netApy: number;
  spread: number;
  liquidity: number;
  risk: 'low' | 'medium' | 'high';
  recommended: boolean;
}

export const fundingArbitrages: FundingArbitrage[] = [
  {
    id: 'fa-1',
    asset: 'ETH',
    longExchange: 'Hyperliquid',
    shortExchange: 'Lighter',
    longFundingRate: -0.0045,
    shortFundingRate: 0.0123,
    netApy: 61.32,
    spread: 0.02,
    liquidity: 45000000,
    risk: 'low',
    recommended: true,
  },
  {
    id: 'fa-2',
    asset: 'BTC',
    longExchange: 'Pacifica',
    shortExchange: 'Hyperliquid',
    longFundingRate: -0.0012,
    shortFundingRate: 0.0089,
    netApy: 36.86,
    spread: 0.01,
    liquidity: 120000000,
    risk: 'low',
    recommended: true,
  },
  {
    id: 'fa-3',
    asset: 'SOL',
    longExchange: 'Lighter',
    shortExchange: 'Hyperliquid',
    longFundingRate: 0.0034,
    shortFundingRate: 0.0156,
    netApy: 44.53,
    spread: 0.05,
    liquidity: 28000000,
    risk: 'medium',
    recommended: true,
  },
  {
    id: 'fa-4',
    asset: 'ARB',
    longExchange: 'Hyperliquid',
    shortExchange: 'Pacifica',
    longFundingRate: -0.0089,
    shortFundingRate: 0.0234,
    netApy: 117.89,
    spread: 0.08,
    liquidity: 8500000,
    risk: 'high',
    recommended: false,
  },
  {
    id: 'fa-5',
    asset: 'DOGE',
    longExchange: 'Pacifica',
    shortExchange: 'Lighter',
    longFundingRate: 0.0012,
    shortFundingRate: 0.0198,
    netApy: 67.89,
    spread: 0.12,
    liquidity: 5200000,
    risk: 'high',
    recommended: false,
  },
];

// =============================================================================
// 2. DELTA NEUTRAL STRATEGIES
// Long spot + short perp to capture funding while staying market neutral
// =============================================================================
export interface DeltaNeutralStrategy {
  id: string;
  asset: string;
  spotSource: string;
  perpExchange: string;
  fundingRate: number;
  apy: number;
  spotPrice: number;
  perpPrice: number;
  basis: number; // perp premium/discount to spot
  liquidationBuffer: number;
  maxLeverage: number;
  recommendedSize: number;
}

export const deltaNeutralStrategies: DeltaNeutralStrategy[] = [
  {
    id: 'dn-1',
    asset: 'ETH',
    spotSource: 'Morpho (collateral)',
    perpExchange: 'Hyperliquid',
    fundingRate: 0.0123,
    apy: 44.89,
    spotPrice: 2380,
    perpPrice: 2385.50,
    basis: 0.23,
    liquidationBuffer: 45,
    maxLeverage: 3,
    recommendedSize: 10000,
  },
  {
    id: 'dn-2',
    asset: 'BTC',
    spotSource: 'Morpho (collateral)',
    perpExchange: 'Hyperliquid',
    fundingRate: 0.0089,
    apy: 32.48,
    spotPrice: 44200,
    perpPrice: 44280,
    basis: 0.18,
    liquidationBuffer: 52,
    maxLeverage: 3,
    recommendedSize: 15000,
  },
  {
    id: 'dn-3',
    asset: 'SOL',
    spotSource: 'Pendle PT',
    perpExchange: 'Lighter',
    fundingRate: 0.0156,
    apy: 56.94,
    spotPrice: 98.50,
    perpPrice: 98.80,
    basis: 0.30,
    liquidationBuffer: 38,
    maxLeverage: 2,
    recommendedSize: 5000,
  },
];

// =============================================================================
// 3. PREDICTION MARKET ARBITRAGE
// Price discrepancies between Polymarket, Kalshi, and Opinion
// =============================================================================
export interface PredictionArbitrage {
  id: string;
  event: string;
  category: string;
  expiresAt: number;
  polymarketYes: number;
  kalshiYes: number;
  opinionYes: number;
  bestBuy: { exchange: string; price: number; side: 'yes' | 'no' };
  bestSell: { exchange: string; price: number; side: 'yes' | 'no' };
  spreadPercent: number;
  guaranteedProfit: number; // per $100 deployed
  liquidity: number;
}

export const predictionArbitrages: PredictionArbitrage[] = [
  {
    id: 'pa-1',
    event: 'Trump wins 2024 election',
    category: 'Politics',
    expiresAt: Date.now() + 86400000 * 280,
    polymarketYes: 0.58,
    kalshiYes: 0.61,
    opinionYes: 0.56,
    bestBuy: { exchange: 'Opinion', price: 0.56, side: 'yes' },
    bestSell: { exchange: 'Kalshi', price: 0.61, side: 'yes' },
    spreadPercent: 8.93,
    guaranteedProfit: 5.00,
    liquidity: 2500000,
  },
  {
    id: 'pa-2',
    event: 'Fed cuts rates in March',
    category: 'Economics',
    expiresAt: Date.now() + 86400000 * 45,
    polymarketYes: 0.23,
    kalshiYes: 0.19,
    opinionYes: 0.25,
    bestBuy: { exchange: 'Kalshi', price: 0.19, side: 'yes' },
    bestSell: { exchange: 'Opinion', price: 0.25, side: 'yes' },
    spreadPercent: 31.58,
    guaranteedProfit: 6.00,
    liquidity: 890000,
  },
  {
    id: 'pa-3',
    event: 'BTC > $60k by Feb 1',
    category: 'Crypto',
    expiresAt: Date.now() + 86400000 * 3,
    polymarketYes: 0.12,
    kalshiYes: 0.15,
    opinionYes: 0.11,
    bestBuy: { exchange: 'Opinion', price: 0.11, side: 'yes' },
    bestSell: { exchange: 'Kalshi', price: 0.15, side: 'yes' },
    spreadPercent: 36.36,
    guaranteedProfit: 4.00,
    liquidity: 450000,
  },
];

// =============================================================================
// 4. HIGH PROBABILITY EXPIRING EVENTS
// Markets with >85% probability that haven't fully priced in
// =============================================================================
export interface HighProbEvent {
  id: string;
  event: string;
  exchange: string;
  category: string;
  probability: number;
  currentPrice: number;
  fairValue: number; // estimated true probability
  edge: number; // fairValue - currentPrice
  expiresAt: number;
  hoursToExpiry: number;
  volume24h: number;
  confidence: 'high' | 'medium';
  reasoning: string;
}

export const highProbEvents: HighProbEvent[] = [
  {
    id: 'hp-1',
    event: 'Super Bowl happens on Feb 9',
    exchange: 'Polymarket',
    category: 'Sports',
    probability: 0.92,
    currentPrice: 0.92,
    fairValue: 0.999,
    edge: 7.9,
    expiresAt: Date.now() + 86400000 * 11,
    hoursToExpiry: 264,
    volume24h: 125000,
    confidence: 'high',
    reasoning: 'Event is confirmed, only force majeure prevents resolution',
  },
  {
    id: 'hp-2',
    event: 'NVIDIA reports earnings in Feb',
    exchange: 'Kalshi',
    category: 'Stocks',
    probability: 0.88,
    currentPrice: 0.88,
    fairValue: 0.98,
    edge: 10.0,
    expiresAt: Date.now() + 86400000 * 23,
    hoursToExpiry: 552,
    volume24h: 340000,
    confidence: 'high',
    reasoning: 'Earnings date confirmed by company IR',
  },
  {
    id: 'hp-3',
    event: 'ETH Shanghai upgrade completes',
    exchange: 'Polymarket',
    category: 'Crypto',
    probability: 0.95,
    currentPrice: 0.89,
    fairValue: 0.95,
    edge: 6.0,
    expiresAt: Date.now() + 86400000 * 5,
    hoursToExpiry: 120,
    volume24h: 89000,
    confidence: 'medium',
    reasoning: 'Testnet successful, mainnet scheduled',
  },
  {
    id: 'hp-4',
    event: 'Taylor Swift tour continues',
    exchange: 'Opinion',
    category: 'Entertainment',
    probability: 0.97,
    currentPrice: 0.91,
    fairValue: 0.97,
    edge: 6.0,
    expiresAt: Date.now() + 86400000 * 2,
    hoursToExpiry: 48,
    volume24h: 56000,
    confidence: 'high',
    reasoning: 'Tickets sold, no cancellation announcements',
  },
];

// =============================================================================
// 5. CROSS-EXCHANGE PRICE SPREADS
// Same asset trading at different prices across exchanges
// =============================================================================
export interface PriceSpread {
  id: string;
  asset: string;
  lowExchange: string;
  highExchange: string;
  lowPrice: number;
  highPrice: number;
  spreadPercent: number;
  spreadUsd: number;
  direction: 'buy-low-sell-high';
  estimatedSlippage: number;
  netProfit: number; // after slippage
  executionTime: string;
  liquidity: number;
}

export const priceSpreads: PriceSpread[] = [
  {
    id: 'ps-1',
    asset: 'ETH-PERP',
    lowExchange: 'Lighter',
    highExchange: 'Hyperliquid',
    lowPrice: 2378.50,
    highPrice: 2382.20,
    spreadPercent: 0.156,
    spreadUsd: 3.70,
    direction: 'buy-low-sell-high',
    estimatedSlippage: 0.05,
    netProfit: 2.51,
    executionTime: '< 2s',
    liquidity: 5200000,
  },
  {
    id: 'ps-2',
    asset: 'BTC-PERP',
    lowExchange: 'Pacifica',
    highExchange: 'Hyperliquid',
    lowPrice: 44150,
    highPrice: 44220,
    spreadPercent: 0.159,
    spreadUsd: 70,
    direction: 'buy-low-sell-high',
    estimatedSlippage: 0.03,
    netProfit: 56.73,
    executionTime: '< 2s',
    liquidity: 12000000,
  },
];

// =============================================================================
// 6. YIELD ROTATION OPPORTUNITIES
// Best yields across protocols with one-click migration
// =============================================================================
export interface YieldOpportunity {
  id: string;
  asset: string;
  protocol: string;
  type: 'lending' | 'staking' | 'lp' | 'vault';
  apy: number;
  apyChange24h: number;
  tvl: number;
  utilization: number;
  risk: 'low' | 'medium' | 'high';
  lockPeriod: number; // days, 0 = none
  rewards: string[];
  audited: boolean;
}

export const yieldOpportunities: YieldOpportunity[] = [
  {
    id: 'yo-1',
    asset: 'USDC',
    protocol: 'Morpho',
    type: 'lending',
    apy: 8.5,
    apyChange24h: 0.3,
    tvl: 520000000,
    utilization: 78,
    risk: 'low',
    lockPeriod: 0,
    rewards: ['MORPHO'],
    audited: true,
  },
  {
    id: 'yo-2',
    asset: 'ETH',
    protocol: 'Pendle',
    type: 'vault',
    apy: 12.3,
    apyChange24h: -0.5,
    tvl: 245000000,
    utilization: 0,
    risk: 'medium',
    lockPeriod: 90,
    rewards: ['PENDLE', 'Points'],
    audited: true,
  },
  {
    id: 'yo-3',
    asset: 'stETH',
    protocol: 'Pendle',
    type: 'vault',
    apy: 15.8,
    apyChange24h: 1.2,
    tvl: 189000000,
    utilization: 0,
    risk: 'medium',
    lockPeriod: 180,
    rewards: ['PENDLE', 'LDO', 'Points'],
    audited: true,
  },
  {
    id: 'yo-4',
    asset: 'USDT',
    protocol: 'Morpho',
    type: 'lending',
    apy: 7.2,
    apyChange24h: 0.1,
    tvl: 380000000,
    utilization: 72,
    risk: 'low',
    lockPeriod: 0,
    rewards: ['MORPHO'],
    audited: true,
  },
];

// =============================================================================
// 7. LIQUIDATION OPPORTUNITIES
// Large positions approaching liquidation - potential entries
// =============================================================================
export interface LiquidationRisk {
  id: string;
  exchange: string;
  asset: string;
  side: 'long' | 'short';
  positionSize: number;
  entryPrice: number;
  liquidationPrice: number;
  currentPrice: number;
  distanceToLiq: number; // percentage
  estimatedLiqTime: string;
  walletAddress: string;
  potentialCascade: number; // estimated cascade liquidation value
}

export const liquidationRisks: LiquidationRisk[] = [
  {
    id: 'liq-1',
    exchange: 'Hyperliquid',
    asset: 'ETH',
    side: 'long',
    positionSize: 2500000,
    entryPrice: 2450,
    liquidationPrice: 2290,
    currentPrice: 2380,
    distanceToLiq: 3.78,
    estimatedLiqTime: '< 4h if -4%',
    walletAddress: '0x1a2b...3c4d',
    potentialCascade: 8500000,
  },
  {
    id: 'liq-2',
    exchange: 'Lighter',
    asset: 'BTC',
    side: 'short',
    positionSize: 5200000,
    entryPrice: 42800,
    liquidationPrice: 45500,
    currentPrice: 44200,
    distanceToLiq: 2.94,
    estimatedLiqTime: '< 2h if +3%',
    walletAddress: '0x5e6f...7g8h',
    potentialCascade: 15000000,
  },
  {
    id: 'liq-3',
    exchange: 'Hyperliquid',
    asset: 'SOL',
    side: 'long',
    positionSize: 890000,
    entryPrice: 105,
    liquidationPrice: 92,
    currentPrice: 98.50,
    distanceToLiq: 6.60,
    estimatedLiqTime: '< 8h if -7%',
    walletAddress: '0x9i0j...1k2l',
    potentialCascade: 2200000,
  },
];

// =============================================================================
// 8. WHALE MOVEMENTS
// Large wallet activity to potentially follow
// =============================================================================
export interface WhaleMovement {
  id: string;
  walletAddress: string;
  walletLabel: string;
  action: 'buy' | 'sell' | 'transfer' | 'deposit' | 'withdraw';
  asset: string;
  amount: number;
  amountUsd: number;
  platform: string;
  timestamp: number;
  txHash: string;
  historicalAccuracy: number; // % of profitable trades
  followersCount: number;
}

export const whaleMovements: WhaleMovement[] = [
  {
    id: 'wm-1',
    walletAddress: '0xd8dA...6045',
    walletLabel: 'vitalik.eth',
    action: 'transfer',
    asset: 'ETH',
    amount: 500,
    amountUsd: 1190000,
    platform: 'Ethereum',
    timestamp: Date.now() - 3600000,
    txHash: '0xabc...123',
    historicalAccuracy: 0,
    followersCount: 125000,
  },
  {
    id: 'wm-2',
    walletAddress: '0x1234...5678',
    walletLabel: 'Smart Money #1',
    action: 'buy',
    asset: 'ETH',
    amount: 2500,
    amountUsd: 5950000,
    platform: 'Hyperliquid',
    timestamp: Date.now() - 1800000,
    txHash: '0xdef...456',
    historicalAccuracy: 73.5,
    followersCount: 8500,
  },
  {
    id: 'wm-3',
    walletAddress: '0x8765...4321',
    walletLabel: 'Polymarket Whale',
    action: 'buy',
    asset: 'Trump YES',
    amount: 150000,
    amountUsd: 87000,
    platform: 'Polymarket',
    timestamp: Date.now() - 900000,
    txHash: '0xghi...789',
    historicalAccuracy: 68.2,
    followersCount: 3200,
  },
  {
    id: 'wm-4',
    walletAddress: '0xabcd...efgh',
    walletLabel: 'DeFi Degen',
    action: 'deposit',
    asset: 'USDC',
    amount: 1000000,
    amountUsd: 1000000,
    platform: 'Morpho',
    timestamp: Date.now() - 600000,
    txHash: '0xjkl...012',
    historicalAccuracy: 61.8,
    followersCount: 1500,
  },
];

// =============================================================================
// 9. CORRELATED ASSET SPREADS
// Trade when correlation breaks down
// =============================================================================
export interface CorrelationSpread {
  id: string;
  asset1: string;
  asset2: string;
  normalCorrelation: number;
  currentCorrelation: number;
  spreadZScore: number; // how many std devs from mean
  direction: 'converging' | 'diverging';
  tradeSetup: string;
  expectedReturn: number;
  timeframe: string;
  confidence: 'high' | 'medium' | 'low';
}

export const correlationSpreads: CorrelationSpread[] = [
  {
    id: 'cs-1',
    asset1: 'ETH',
    asset2: 'BTC',
    normalCorrelation: 0.85,
    currentCorrelation: 0.62,
    spreadZScore: 2.3,
    direction: 'diverging',
    tradeSetup: 'Long ETH / Short BTC',
    expectedReturn: 4.5,
    timeframe: '3-7 days',
    confidence: 'high',
  },
  {
    id: 'cs-2',
    asset1: 'SOL',
    asset2: 'ETH',
    normalCorrelation: 0.78,
    currentCorrelation: 0.91,
    spreadZScore: -1.8,
    direction: 'converging',
    tradeSetup: 'Short SOL / Long ETH',
    expectedReturn: 3.2,
    timeframe: '5-10 days',
    confidence: 'medium',
  },
];

// =============================================================================
// 10. ONE-CLICK STRATEGY TEMPLATES
// Pre-built strategies users can execute with one click
// =============================================================================
export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'arbitrage' | 'yield' | 'hedging' | 'speculation' | 'income';
  risk: 'low' | 'medium' | 'high';
  expectedApy: number;
  minCapital: number;
  maxCapital: number;
  steps: StrategyStep[];
  warnings: string[];
  recommended: boolean;
}

export interface StrategyStep {
  order: number;
  action: string;
  platform: string;
  asset: string;
  side: 'buy' | 'sell' | 'long' | 'short' | 'supply' | 'borrow';
  allocation: number; // percentage of total capital
  leverage?: number;
}

export const strategyTemplates: StrategyTemplate[] = [
  {
    id: 'st-1',
    name: 'ETH Funding Rate Arb',
    description: 'Capture funding rate differential by going long on Hyperliquid and short on Lighter',
    category: 'arbitrage',
    risk: 'low',
    expectedApy: 45,
    minCapital: 1000,
    maxCapital: 100000,
    steps: [
      { order: 1, action: 'Open Long', platform: 'Hyperliquid', asset: 'ETH-PERP', side: 'long', allocation: 50, leverage: 2 },
      { order: 2, action: 'Open Short', platform: 'Lighter', asset: 'ETH-PERP', side: 'short', allocation: 50, leverage: 2 },
    ],
    warnings: ['Funding rates can change', 'Requires active monitoring'],
    recommended: true,
  },
  {
    id: 'st-2',
    name: 'Delta Neutral ETH Yield',
    description: 'Hold ETH in Morpho as collateral, short perp on Hyperliquid to stay delta neutral while earning funding',
    category: 'income',
    risk: 'low',
    expectedApy: 32,
    minCapital: 5000,
    maxCapital: 500000,
    steps: [
      { order: 1, action: 'Supply ETH', platform: 'Morpho', asset: 'ETH', side: 'supply', allocation: 60 },
      { order: 2, action: 'Open Short', platform: 'Hyperliquid', asset: 'ETH-PERP', side: 'short', allocation: 40, leverage: 1.5 },
    ],
    warnings: ['Liquidation risk if ETH moves >30%', 'Basis can go negative'],
    recommended: true,
  },
  {
    id: 'st-3',
    name: 'Prediction Market Hedge',
    description: 'Buy YES on Polymarket, sell YES on Kalshi to lock in arbitrage profit',
    category: 'arbitrage',
    risk: 'low',
    expectedApy: 25,
    minCapital: 500,
    maxCapital: 50000,
    steps: [
      { order: 1, action: 'Buy YES', platform: 'Polymarket', asset: 'Trump 2024', side: 'buy', allocation: 50 },
      { order: 2, action: 'Sell YES', platform: 'Kalshi', asset: 'Trump 2024', side: 'sell', allocation: 50 },
    ],
    warnings: ['Settlement risk between platforms', 'Capital locked until resolution'],
    recommended: true,
  },
  {
    id: 'st-4',
    name: 'High Prob Event Capture',
    description: 'Buy high probability events trading below fair value near expiry',
    category: 'speculation',
    risk: 'medium',
    expectedApy: 120,
    minCapital: 100,
    maxCapital: 25000,
    steps: [
      { order: 1, action: 'Buy YES', platform: 'Auto-select', asset: 'Best opportunity', side: 'buy', allocation: 100 },
    ],
    warnings: ['Black swan risk', 'Low liquidity near expiry'],
    recommended: false,
  },
  {
    id: 'st-5',
    name: 'Yield Ladder',
    description: 'Spread capital across multiple yield sources for diversification',
    category: 'yield',
    risk: 'low',
    expectedApy: 9.5,
    minCapital: 10000,
    maxCapital: 1000000,
    steps: [
      { order: 1, action: 'Supply USDC', platform: 'Morpho', asset: 'USDC', side: 'supply', allocation: 40 },
      { order: 2, action: 'Supply ETH', platform: 'Pendle', asset: 'stETH', side: 'supply', allocation: 30 },
      { order: 3, action: 'Supply USDT', platform: 'Morpho', asset: 'USDT', side: 'supply', allocation: 30 },
    ],
    warnings: ['Smart contract risk', 'Variable APY'],
    recommended: true,
  },
  {
    id: 'st-6',
    name: 'Leveraged Long BTC',
    description: '3x leveraged long on BTC with stop loss',
    category: 'speculation',
    risk: 'high',
    expectedApy: 0, // speculative, no fixed APY
    minCapital: 500,
    maxCapital: 50000,
    steps: [
      { order: 1, action: 'Open Long', platform: 'Hyperliquid', asset: 'BTC-PERP', side: 'long', allocation: 100, leverage: 3 },
    ],
    warnings: ['High liquidation risk', 'Funding rate costs', 'Not for beginners'],
    recommended: false,
  },
  {
    id: 'st-7',
    name: 'SOL Basis Trade',
    description: 'Long spot SOL, short perpetual to capture positive basis',
    category: 'arbitrage',
    risk: 'medium',
    expectedApy: 28,
    minCapital: 2000,
    maxCapital: 200000,
    steps: [
      { order: 1, action: 'Buy Spot', platform: 'Fast (unified)', asset: 'SOL', side: 'buy', allocation: 55 },
      { order: 2, action: 'Open Short', platform: 'Hyperliquid', asset: 'SOL-PERP', side: 'short', allocation: 45, leverage: 1 },
    ],
    warnings: ['Basis can compress', 'Requires rebalancing'],
    recommended: true,
  },
  {
    id: 'st-8',
    name: 'Whale Follow - Smart Money',
    description: 'Mirror the top performing whale wallets',
    category: 'speculation',
    risk: 'high',
    expectedApy: 0,
    minCapital: 1000,
    maxCapital: 100000,
    steps: [
      { order: 1, action: 'Auto-follow', platform: 'Multiple', asset: 'Multiple', side: 'buy', allocation: 100 },
    ],
    warnings: ['Past performance not indicative', 'Slippage on large moves'],
    recommended: false,
  },
];

// =============================================================================
// 11. PORTFOLIO RISK METRICS
// =============================================================================
export interface PortfolioRisk {
  totalExposure: number;
  netExposure: number; // long - short
  grossExposure: number; // long + short
  leverage: number;
  var95: number; // Value at Risk 95%
  var99: number;
  maxDrawdown: number;
  sharpeRatio: number;
  correlationToBtc: number;
  liquidationRisk: 'low' | 'medium' | 'high';
  concentrationRisk: 'low' | 'medium' | 'high';
  biggestPosition: { asset: string; percentage: number };
}

export const portfolioRisk: PortfolioRisk = {
  totalExposure: 54823.47,
  netExposure: 18500,
  grossExposure: 26373.47,
  leverage: 1.43,
  var95: 4250,
  var99: 6800,
  maxDrawdown: 12.5,
  sharpeRatio: 1.8,
  correlationToBtc: 0.72,
  liquidationRisk: 'low',
  concentrationRisk: 'medium',
  biggestPosition: { asset: 'BTC-PERP', percentage: 30.2 },
};

// =============================================================================
// 12. SMART ALERTS
// =============================================================================
export interface SmartAlert {
  id: string;
  type: 'opportunity' | 'risk' | 'whale' | 'liquidation' | 'funding' | 'price';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: boolean;
  action?: string;
  timestamp: number;
  expiresAt?: number;
  seen: boolean;
}

export const smartAlerts: SmartAlert[] = [
  {
    id: 'alert-1',
    type: 'opportunity',
    priority: 'high',
    title: 'Funding Rate Spike on ETH',
    description: 'ETH funding rate on Hyperliquid spiked to 0.015% (54% APY). Consider opening short.',
    actionable: true,
    action: 'Open Funding Arb',
    timestamp: Date.now() - 120000,
    expiresAt: Date.now() + 3600000,
    seen: false,
  },
  {
    id: 'alert-2',
    type: 'liquidation',
    priority: 'high',
    title: '$2.5M ETH Long at Risk',
    description: 'Large ETH long position 3.8% from liquidation. Potential cascade if triggered.',
    actionable: true,
    action: 'View Position',
    timestamp: Date.now() - 300000,
    seen: false,
  },
  {
    id: 'alert-3',
    type: 'whale',
    priority: 'medium',
    title: 'Smart Money Buying ETH',
    description: 'Wallet with 73% accuracy bought $5.9M ETH on Hyperliquid',
    actionable: true,
    action: 'Copy Trade',
    timestamp: Date.now() - 1800000,
    seen: true,
  },
  {
    id: 'alert-4',
    type: 'opportunity',
    priority: 'medium',
    title: 'Prediction Arb Available',
    description: 'Trump 2024: 5.0% spread between Opinion (56¢) and Kalshi (61¢)',
    actionable: true,
    action: 'Execute Arb',
    timestamp: Date.now() - 600000,
    seen: false,
  },
  {
    id: 'alert-5',
    type: 'risk',
    priority: 'low',
    title: 'Position Approaching 24h',
    description: 'Your ETH-PERP long has been open 23 hours. Review funding costs.',
    actionable: true,
    action: 'Review Position',
    timestamp: Date.now() - 60000,
    seen: true,
  },
];

// =============================================================================
// 13. REAL-TIME MARKET DATA (simulated)
// =============================================================================
export interface MarketTicker {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  nextFunding: number;
  markPrice: number;
  indexPrice: number;
}

export const marketTickers: MarketTicker[] = [
  {
    symbol: 'BTC-PERP',
    price: 44200,
    change24h: 1.8,
    high24h: 44850,
    low24h: 43200,
    volume24h: 2850000000,
    openInterest: 890000000,
    fundingRate: 0.0089,
    nextFunding: Date.now() + 3600000,
    markPrice: 44205,
    indexPrice: 44198,
  },
  {
    symbol: 'ETH-PERP',
    price: 2380,
    change24h: 2.4,
    high24h: 2420,
    low24h: 2320,
    volume24h: 1420000000,
    openInterest: 520000000,
    fundingRate: 0.0123,
    nextFunding: Date.now() + 3600000,
    markPrice: 2381.50,
    indexPrice: 2379.80,
  },
  {
    symbol: 'SOL-PERP',
    price: 98.50,
    change24h: 4.2,
    high24h: 102.30,
    low24h: 94.80,
    volume24h: 680000000,
    openInterest: 180000000,
    fundingRate: 0.0156,
    nextFunding: Date.now() + 3600000,
    markPrice: 98.55,
    indexPrice: 98.42,
  },
];
