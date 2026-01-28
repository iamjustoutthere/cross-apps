import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import { TradingPanel } from '../components/TradingPanel';

export function PolymarketModule() {
  const { markets, positions, activeMarketId, setActiveMarket } = useTerminalStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const polymarketMarkets = markets.filter(m => m.appId === 'polymarket');
  const polymarketPositions = positions.filter(p => p.appId === 'polymarket');

  const categories = ['all', ...new Set(polymarketMarkets.map(m => m.category))];

  const filteredMarkets = categoryFilter === 'all'
    ? polymarketMarkets
    : polymarketMarkets.filter(m => m.category === categoryFilter);

  const selectedMarket = markets.find(m => m.id === activeMarketId);

  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="flex h-full">
      {/* Markets List */}
      <div className="flex-1 flex flex-col border-r border-terminal-border">
        {/* Header */}
        <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-title font-bold text-terminal-accent font-display">PM</span>
              <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
                POLYMARKET
              </h2>
            </div>
            <span className="text-caption text-terminal-text-muted">
              {polymarketPositions.length} POSITIONS
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-micro uppercase border ${
                  categoryFilter === cat
                    ? 'bg-terminal-accent text-white border-terminal-accent'
                    : 'border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Positions */}
        {polymarketPositions.length > 0 && (
          <div className="border-b border-terminal-border">
            <div className="px-4 py-2 bg-terminal-bg-tertiary">
              <span className="text-micro text-terminal-text-muted uppercase">
                YOUR POSITIONS
              </span>
            </div>
            {polymarketPositions.map(pos => (
              <div
                key={pos.id}
                className="px-4 py-3 border-b border-terminal-border hover:bg-terminal-bg-secondary cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-caption text-terminal-text-primary">
                      {pos.market}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-micro font-bold ${
                        pos.side === 'yes' ? 'text-terminal-positive' : 'text-terminal-negative'
                      }`}>
                        {pos.side.toUpperCase()}
                      </span>
                      <span className="text-micro text-terminal-text-muted">
                        @ {pos.entryPrice.toFixed(2)}
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
              MARKETS
            </span>
          </div>
          {filteredMarkets.map(market => (
            <button
              key={market.id}
              onClick={() => setActiveMarket(market.id)}
              className={`w-full px-4 py-3 text-left border-b border-terminal-border hover:bg-terminal-bg-secondary ${
                activeMarketId === market.id ? 'bg-terminal-bg-secondary' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-micro text-terminal-text-muted uppercase">
                      {market.category}
                    </span>
                  </div>
                  <div className="text-caption text-terminal-text-primary mt-1">
                    {market.name}
                  </div>
                  <div className="text-micro text-terminal-text-muted mt-1">
                    VOL: {formatVolume(market.volume24h)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-title font-bold text-terminal-text-primary">
                    {(market.price * 100).toFixed(0)}%
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-micro ${
                    market.change24h >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
                  }`}>
                    {market.change24h >= 0 ? (
                      <TrendingUp size={10} />
                    ) : (
                      <TrendingDown size={10} />
                    )}
                    {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(1)}%
                  </div>
                </div>
                <ChevronRight size={16} className="ml-2 text-terminal-text-muted" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trading Panel */}
      {selectedMarket && (
        <div className="w-80">
          <TradingPanel market={selectedMarket} />
        </div>
      )}

      {/* Empty State */}
      {!selectedMarket && (
        <div className="w-80 flex items-center justify-center bg-terminal-bg-secondary border-l border-terminal-border">
          <div className="text-center p-8">
            <div className="text-caption text-terminal-text-muted">
              SELECT A MARKET TO TRADE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
