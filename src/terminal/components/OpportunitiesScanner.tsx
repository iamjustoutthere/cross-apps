import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  ArrowRightLeft,
  Clock,
  CheckCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  fundingArbitrages,
  predictionArbitrages,
  highProbEvents,
  priceSpreads,
  deltaNeutralStrategies,
  type FundingArbitrage,
  type PredictionArbitrage,
  type HighProbEvent,
} from '../mock/opportunities';

type TabType = 'funding' | 'prediction' | 'highprob' | 'spreads' | 'delta';

export function OpportunitiesScanner() {
  const [activeTab, setActiveTab] = useState<TabType>('funding');
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'funding', label: 'FUNDING ARB', count: fundingArbitrages.length },
    { id: 'delta', label: 'DELTA NEUTRAL', count: deltaNeutralStrategies.length },
    { id: 'prediction', label: 'PRED MARKET ARB', count: predictionArbitrages.length },
    { id: 'highprob', label: 'HIGH PROB', count: highProbEvents.length },
    { id: 'spreads', label: 'PRICE SPREADS', count: priceSpreads.length },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const formatTime = (timestamp: number) => {
    const hours = Math.floor((timestamp - Date.now()) / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    return `${hours}h`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-terminal-positive';
      case 'medium': return 'text-terminal-warning';
      case 'high': return 'text-terminal-negative';
      default: return 'text-terminal-text-muted';
    }
  };

  const handleExecute = (type: string, id: string) => {
    alert(`Executing ${type} strategy: ${id}\n\nIn production, this would open a confirmation modal and execute the trade.`);
  };

  return (
    <div className="flex flex-col h-full bg-terminal-bg-primary">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target size={20} className="text-terminal-accent" />
            <div>
              <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
                OPPORTUNITIES SCANNER
              </h2>
              <p className="text-micro text-terminal-text-muted">
                REAL-TIME ARBITRAGE & HIGH-VALUE TRADES
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
              className={`flex items-center gap-2 px-3 py-1.5 text-micro border ${
                showOnlyRecommended
                  ? 'bg-terminal-accent text-white border-terminal-accent'
                  : 'border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary'
              }`}
            >
              <Filter size={12} />
              RECOMMENDED ONLY
            </button>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-terminal-positive/20 border border-terminal-positive text-terminal-positive text-micro">
              <div className="w-2 h-2 bg-terminal-positive animate-pulse" />
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-terminal-border bg-terminal-bg-tertiary overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-caption whitespace-nowrap border-r border-terminal-border ${
              activeTab === tab.id
                ? 'bg-terminal-bg-primary text-terminal-text-primary'
                : 'text-terminal-text-muted hover:text-terminal-text-primary hover:bg-terminal-bg-secondary'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 text-micro ${
              activeTab === tab.id ? 'bg-terminal-accent text-white' : 'bg-terminal-bg-secondary'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'funding' && (
          <FundingArbitrageList
            items={showOnlyRecommended ? fundingArbitrages.filter(i => i.recommended) : fundingArbitrages}
            onExecute={handleExecute}
            formatCurrency={formatCurrency}
            getRiskColor={getRiskColor}
          />
        )}

        {activeTab === 'delta' && (
          <DeltaNeutralList
            items={deltaNeutralStrategies}
            onExecute={handleExecute}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'prediction' && (
          <PredictionArbitrageList
            items={predictionArbitrages}
            onExecute={handleExecute}
            formatCurrency={formatCurrency}
            formatTime={formatTime}
          />
        )}

        {activeTab === 'highprob' && (
          <HighProbEventsList
            items={highProbEvents}
            onExecute={handleExecute}
          />
        )}

        {activeTab === 'spreads' && (
          <PriceSpreadsList
            items={priceSpreads}
            onExecute={handleExecute}
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
          />
        )}
      </div>
    </div>
  );
}

// Funding Arbitrage List Component
function FundingArbitrageList({
  items,
  onExecute,
  formatCurrency,
  getRiskColor,
}: {
  items: FundingArbitrage[];
  onExecute: (type: string, id: string) => void;
  formatCurrency: (value: number) => string;
  getRiskColor: (risk: string) => string;
}) {
  return (
    <div className="divide-y divide-terminal-border">
      {items.map(item => (
        <div
          key={item.id}
          className="p-4 hover:bg-terminal-bg-secondary"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-title font-bold text-terminal-text-primary">
                  {item.asset}
                </span>
                {item.recommended && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-terminal-positive/20 text-terminal-positive text-micro">
                    <CheckCircle size={10} />
                    RECOMMENDED
                  </span>
                )}
                <span className={`text-micro uppercase ${getRiskColor(item.risk)}`}>
                  {item.risk} RISK
                </span>
              </div>

              <div className="flex items-center gap-2 text-caption text-terminal-text-secondary mb-3">
                <span className="text-terminal-positive">LONG {item.longExchange}</span>
                <ArrowRightLeft size={14} className="text-terminal-text-muted" />
                <span className="text-terminal-negative">SHORT {item.shortExchange}</span>
              </div>

              <div className="grid grid-cols-4 gap-4 text-micro">
                <div>
                  <span className="text-terminal-text-muted">LONG FUNDING</span>
                  <div className={item.longFundingRate < 0 ? 'text-terminal-positive' : 'text-terminal-negative'}>
                    {(item.longFundingRate * 100).toFixed(4)}%
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">SHORT FUNDING</span>
                  <div className="text-terminal-positive">
                    {(item.shortFundingRate * 100).toFixed(4)}%
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">SPREAD</span>
                  <div className="text-terminal-text-primary">
                    {(item.spread * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">LIQUIDITY</span>
                  <div className="text-terminal-text-primary">
                    {formatCurrency(item.liquidity)}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-display font-bold text-terminal-positive font-display">
                {item.netApy.toFixed(1)}%
              </div>
              <div className="text-micro text-terminal-text-muted mb-3">NET APY</div>
              <button
                onClick={() => onExecute('funding', item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-accent text-white text-caption font-bold hover:opacity-90"
              >
                <Zap size={14} />
                EXECUTE
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Delta Neutral List Component
function DeltaNeutralList({
  items,
  onExecute,
  formatCurrency,
}: {
  items: typeof deltaNeutralStrategies;
  onExecute: (type: string, id: string) => void;
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="divide-y divide-terminal-border">
      {items.map(item => (
        <div
          key={item.id}
          className="p-4 hover:bg-terminal-bg-secondary"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-title font-bold text-terminal-text-primary">
                  {item.asset} DELTA NEUTRAL
                </span>
              </div>

              <div className="flex items-center gap-4 text-caption text-terminal-text-secondary mb-3">
                <span>SPOT: {item.spotSource}</span>
                <ArrowRightLeft size={14} className="text-terminal-text-muted" />
                <span>PERP: {item.perpExchange}</span>
              </div>

              <div className="grid grid-cols-5 gap-4 text-micro">
                <div>
                  <span className="text-terminal-text-muted">SPOT PRICE</span>
                  <div className="text-terminal-text-primary">
                    {formatCurrency(item.spotPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">PERP PRICE</span>
                  <div className="text-terminal-text-primary">
                    {formatCurrency(item.perpPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">BASIS</span>
                  <div className="text-terminal-positive">
                    +{item.basis.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">LIQ BUFFER</span>
                  <div className="text-terminal-text-primary">
                    {item.liquidationBuffer}%
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">RECOMMENDED</span>
                  <div className="text-terminal-text-primary">
                    {formatCurrency(item.recommendedSize)}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-display font-bold text-terminal-positive font-display">
                {item.apy.toFixed(1)}%
              </div>
              <div className="text-micro text-terminal-text-muted mb-3">EST APY</div>
              <button
                onClick={() => onExecute('delta', item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-accent text-white text-caption font-bold hover:opacity-90"
              >
                <Zap size={14} />
                EXECUTE
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Prediction Arbitrage List Component
function PredictionArbitrageList({
  items,
  onExecute,
  formatCurrency,
  formatTime,
}: {
  items: PredictionArbitrage[];
  onExecute: (type: string, id: string) => void;
  formatCurrency: (value: number) => string;
  formatTime: (timestamp: number) => string;
}) {
  return (
    <div className="divide-y divide-terminal-border">
      {items.map(item => (
        <div
          key={item.id}
          className="p-4 hover:bg-terminal-bg-secondary"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-title font-bold text-terminal-text-primary">
                  {item.event}
                </span>
                <span className="px-2 py-0.5 bg-terminal-bg-tertiary text-terminal-text-muted text-micro">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-2 text-caption text-terminal-text-muted mb-3">
                <Clock size={12} />
                <span>Expires: {formatTime(item.expiresAt)}</span>
              </div>

              <div className="grid grid-cols-5 gap-4 text-micro mb-3">
                <div>
                  <span className="text-terminal-text-muted">POLYMARKET</span>
                  <div className="text-terminal-text-primary">
                    {(item.polymarketYes * 100).toFixed(0)}¢
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">KALSHI</span>
                  <div className="text-terminal-text-primary">
                    {(item.kalshiYes * 100).toFixed(0)}¢
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">OPINION</span>
                  <div className="text-terminal-text-primary">
                    {(item.opinionYes * 100).toFixed(0)}¢
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">SPREAD</span>
                  <div className="text-terminal-positive">
                    {item.spreadPercent.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">LIQUIDITY</span>
                  <div className="text-terminal-text-primary">
                    {formatCurrency(item.liquidity)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-terminal-bg-tertiary border border-terminal-border text-micro">
                <TrendingUp size={12} className="text-terminal-positive" />
                <span className="text-terminal-text-muted">BUY:</span>
                <span className="text-terminal-positive">{item.bestBuy.side.toUpperCase()} @ {item.bestBuy.exchange}</span>
                <ArrowRightLeft size={12} className="text-terminal-text-muted mx-2" />
                <TrendingDown size={12} className="text-terminal-negative" />
                <span className="text-terminal-text-muted">SELL:</span>
                <span className="text-terminal-negative">{item.bestSell.side.toUpperCase()} @ {item.bestSell.exchange}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-display font-bold text-terminal-positive font-display">
                ${item.guaranteedProfit.toFixed(2)}
              </div>
              <div className="text-micro text-terminal-text-muted mb-3">PER $100</div>
              <button
                onClick={() => onExecute('prediction', item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-accent text-white text-caption font-bold hover:opacity-90"
              >
                <Zap size={14} />
                EXECUTE ARB
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// High Probability Events List Component
function HighProbEventsList({
  items,
  onExecute,
}: {
  items: HighProbEvent[];
  onExecute: (type: string, id: string) => void;
}) {
  return (
    <div className="divide-y divide-terminal-border">
      {items.map(item => (
        <div
          key={item.id}
          className="p-4 hover:bg-terminal-bg-secondary"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-title font-bold text-terminal-text-primary">
                  {item.event}
                </span>
                <span className={`px-2 py-0.5 text-micro ${
                  item.confidence === 'high'
                    ? 'bg-terminal-positive/20 text-terminal-positive'
                    : 'bg-terminal-warning/20 text-terminal-warning'
                }`}>
                  {item.confidence.toUpperCase()} CONFIDENCE
                </span>
              </div>

              <div className="flex items-center gap-4 text-caption text-terminal-text-muted mb-3">
                <span>{item.exchange}</span>
                <span>|</span>
                <span>{item.category}</span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.hoursToExpiry}h to expiry
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 text-micro mb-3">
                <div>
                  <span className="text-terminal-text-muted">CURRENT PRICE</span>
                  <div className="text-terminal-text-primary">
                    {(item.currentPrice * 100).toFixed(0)}¢
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">FAIR VALUE</span>
                  <div className="text-terminal-positive">
                    {(item.fairValue * 100).toFixed(0)}¢
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">EDGE</span>
                  <div className="text-terminal-positive">
                    +{item.edge.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">24H VOLUME</span>
                  <div className="text-terminal-text-primary">
                    ${(item.volume24h / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>

              <div className="p-2 bg-terminal-bg-tertiary border border-terminal-border text-micro text-terminal-text-secondary">
                {item.reasoning}
              </div>
            </div>

            <div className="text-right">
              <div className="text-display font-bold text-terminal-positive font-display">
                {(item.probability * 100).toFixed(0)}%
              </div>
              <div className="text-micro text-terminal-text-muted mb-3">PROBABILITY</div>
              <button
                onClick={() => onExecute('highprob', item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-positive text-black text-caption font-bold hover:opacity-90"
              >
                <Zap size={14} />
                BUY YES
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Price Spreads List Component
function PriceSpreadsList({
  items,
  onExecute,
  formatCurrency,
  formatPercent,
}: {
  items: typeof priceSpreads;
  onExecute: (type: string, id: string) => void;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
}) {
  return (
    <div className="divide-y divide-terminal-border">
      {items.map(item => (
        <div
          key={item.id}
          className="p-4 hover:bg-terminal-bg-secondary"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-title font-bold text-terminal-text-primary">
                  {item.asset}
                </span>
                <span className="px-2 py-0.5 bg-terminal-positive/20 text-terminal-positive text-micro">
                  {item.executionTime}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-4 text-micro">
                <div>
                  <span className="text-terminal-text-muted">BUY @ {item.lowExchange}</span>
                  <div className="text-terminal-positive">
                    {formatCurrency(item.lowPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">SELL @ {item.highExchange}</span>
                  <div className="text-terminal-negative">
                    {formatCurrency(item.highPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">SPREAD</span>
                  <div className="text-terminal-positive">
                    {formatPercent(item.spreadPercent)}
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">SLIPPAGE</span>
                  <div className="text-terminal-warning">
                    ~{formatPercent(item.estimatedSlippage)}
                  </div>
                </div>
                <div>
                  <span className="text-terminal-text-muted">NET PROFIT</span>
                  <div className="text-terminal-positive">
                    {formatCurrency(item.netProfit)}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => onExecute('spread', item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-accent text-white text-caption font-bold hover:opacity-90"
              >
                <Zap size={14} />
                EXECUTE
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
