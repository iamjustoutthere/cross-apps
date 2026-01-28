import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronRight, Activity } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import { TradingPanel } from '../components/TradingPanel';

export function HyperliquidModule() {
  const { markets, positions, activeMarketId, setActiveMarket } = useTerminalStore();
  const [view, setView] = useState<'markets' | 'orderbook'>('markets');

  const hlMarkets = markets.filter(m => m.appId === 'hyperliquid');
  const hlPositions = positions.filter(p => p.appId === 'hyperliquid');

  const selectedMarket = markets.find(m => m.id === activeMarketId);

  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${value}`;
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatPrice = (value: number) => {
    if (value >= 1000) return formatCurrency(value);
    if (value >= 1) return `$${value.toFixed(4)}`;
    return `$${value.toFixed(6)}`;
  };

  // Mock orderbook data
  const generateOrderbook = () => {
    const asks = [];
    const bids = [];
    const basePrice = selectedMarket?.price || 44000;

    for (let i = 0; i < 10; i++) {
      asks.push({
        price: basePrice * (1 + (i + 1) * 0.001),
        size: Math.random() * 10 + 0.5,
        total: 0,
      });
      bids.push({
        price: basePrice * (1 - (i + 1) * 0.001),
        size: Math.random() * 10 + 0.5,
        total: 0,
      });
    }

    return { asks: asks.reverse(), bids };
  };

  const orderbook = generateOrderbook();

  return (
    <div className="flex h-full">
      {/* Left Panel - Markets & Positions */}
      <div className="w-72 flex flex-col border-r border-terminal-border">
        {/* Header */}
        <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
          <div className="flex items-center gap-2">
            <span className="text-title font-bold text-terminal-accent font-display">HL</span>
            <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
              HYPERLIQUID
            </h2>
          </div>
          <div className="flex items-center gap-4 mt-2 text-micro text-terminal-text-muted">
            <span>{hlPositions.length} POSITIONS</span>
            <span>|</span>
            <span>{hlMarkets.length} MARKETS</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex border-b border-terminal-border">
          <button
            onClick={() => setView('markets')}
            className={`flex-1 py-2 text-micro uppercase ${
              view === 'markets'
                ? 'bg-terminal-bg-tertiary text-terminal-text-primary'
                : 'text-terminal-text-muted hover:bg-terminal-bg-secondary'
            }`}
          >
            MARKETS
          </button>
          <button
            onClick={() => setView('orderbook')}
            className={`flex-1 py-2 text-micro uppercase ${
              view === 'orderbook'
                ? 'bg-terminal-bg-tertiary text-terminal-text-primary'
                : 'text-terminal-text-muted hover:bg-terminal-bg-secondary'
            }`}
          >
            ORDERBOOK
          </button>
        </div>

        {view === 'markets' ? (
          <>
            {/* Positions */}
            {hlPositions.length > 0 && (
              <div className="border-b border-terminal-border">
                <div className="px-4 py-2 bg-terminal-bg-tertiary">
                  <span className="text-micro text-terminal-text-muted uppercase">
                    POSITIONS
                  </span>
                </div>
                {hlPositions.map(pos => (
                  <div
                    key={pos.id}
                    className="px-4 py-3 border-b border-terminal-border hover:bg-terminal-bg-secondary"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-caption text-terminal-text-primary">
                          {pos.market}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-micro font-bold ${
                            pos.side === 'long' ? 'text-terminal-positive' : 'text-terminal-negative'
                          }`}>
                            {pos.side.toUpperCase()}
                          </span>
                          <span className="text-micro text-terminal-text-muted">
                            {formatCurrency(pos.entryPrice)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-caption text-terminal-text-primary">
                          {formatCurrency(pos.size)}
                        </div>
                        <div className={`text-micro ${
                          pos.pnl >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
                        }`}>
                          {pos.pnl >= 0 ? '+' : ''}{formatCurrency(pos.pnl)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Markets List */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2 bg-terminal-bg-tertiary border-b border-terminal-border">
                <span className="text-micro text-terminal-text-muted uppercase">
                  PERPETUALS
                </span>
              </div>
              {hlMarkets.map(market => (
                <button
                  key={market.id}
                  onClick={() => setActiveMarket(market.id)}
                  className={`w-full px-4 py-3 text-left border-b border-terminal-border hover:bg-terminal-bg-secondary ${
                    activeMarketId === market.id ? 'bg-terminal-bg-secondary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-caption text-terminal-text-primary font-bold">
                        {market.name}
                      </div>
                      <div className="text-micro text-terminal-text-muted mt-1">
                        {formatVolume(market.volume24h)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-caption text-terminal-text-primary">
                        {formatPrice(market.price)}
                      </div>
                      <div className={`flex items-center justify-end gap-1 text-micro ${
                        market.change24h >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
                      }`}>
                        {market.change24h >= 0 ? (
                          <TrendingUp size={10} />
                        ) : (
                          <TrendingDown size={10} />
                        )}
                        {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Orderbook View */
          <div className="flex-1 overflow-y-auto">
            {selectedMarket ? (
              <>
                <div className="px-4 py-2 bg-terminal-bg-tertiary border-b border-terminal-border">
                  <span className="text-micro text-terminal-text-muted">
                    {selectedMarket.name} ORDERBOOK
                  </span>
                </div>

                {/* Asks */}
                <div className="px-2">
                  {orderbook.asks.map((ask, i) => (
                    <div
                      key={`ask-${i}`}
                      className="flex items-center justify-between px-2 py-1 text-micro"
                      style={{
                        background: `linear-gradient(to left, rgba(255, 59, 59, 0.1) ${ask.size * 10}%, transparent ${ask.size * 10}%)`,
                      }}
                    >
                      <span className="text-terminal-negative">{formatPrice(ask.price)}</span>
                      <span className="text-terminal-text-secondary">{ask.size.toFixed(4)}</span>
                    </div>
                  ))}
                </div>

                {/* Spread */}
                <div className="px-4 py-2 bg-terminal-bg-tertiary text-center">
                  <span className="text-title font-bold text-terminal-text-primary">
                    {formatPrice(selectedMarket.price)}
                  </span>
                </div>

                {/* Bids */}
                <div className="px-2">
                  {orderbook.bids.map((bid, i) => (
                    <div
                      key={`bid-${i}`}
                      className="flex items-center justify-between px-2 py-1 text-micro"
                      style={{
                        background: `linear-gradient(to left, rgba(0, 255, 136, 0.1) ${bid.size * 10}%, transparent ${bid.size * 10}%)`,
                      }}
                    >
                      <span className="text-terminal-positive">{formatPrice(bid.price)}</span>
                      <span className="text-terminal-text-secondary">{bid.size.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-terminal-text-muted text-caption">
                SELECT A MARKET
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center - Chart Placeholder */}
      <div className="flex-1 flex flex-col">
        {selectedMarket ? (
          <>
            {/* Market Header */}
            <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-title font-bold text-terminal-text-primary">
                    {selectedMarket.name}
                  </h3>
                  <div className={`flex items-center gap-1 ${
                    selectedMarket.change24h >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
                  }`}>
                    {selectedMarket.change24h >= 0 ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    <span className="text-caption">
                      {selectedMarket.change24h >= 0 ? '+' : ''}{selectedMarket.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-display font-bold text-terminal-text-primary">
                    {formatPrice(selectedMarket.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 flex items-center justify-center bg-terminal-bg-primary">
              <div className="text-center">
                <Activity size={48} className="mx-auto mb-4 text-terminal-text-muted" />
                <div className="text-caption text-terminal-text-muted">
                  CHART VISUALIZATION
                </div>
                <div className="text-micro text-terminal-text-muted mt-1">
                  (INTEGRATE TRADING VIEW OR CUSTOM CHART)
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-terminal-bg-primary">
            <div className="text-center">
              <ChevronRight size={48} className="mx-auto mb-4 text-terminal-text-muted" />
              <div className="text-caption text-terminal-text-muted">
                SELECT A MARKET FROM THE LEFT
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right - Trading Panel */}
      {selectedMarket && (
        <div className="w-80">
          <TradingPanel market={selectedMarket} />
        </div>
      )}
    </div>
  );
}
