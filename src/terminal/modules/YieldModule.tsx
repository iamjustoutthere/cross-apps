import { TrendingUp, Percent, DollarSign, Clock } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import { TradingPanel } from '../components/TradingPanel';

interface YieldModuleProps {
  appId: 'pendle' | 'morpho';
}

export function YieldModule({ appId }: YieldModuleProps) {
  const { markets, positions, apps, activeMarketId, setActiveMarket } = useTerminalStore();

  const app = apps.find(a => a.id === appId);
  const appMarkets = markets.filter(m => m.appId === appId);
  const appPositions = positions.filter(p => p.appId === appId);

  const selectedMarket = markets.find(m => m.id === activeMarketId);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${value}`;
  };

  // Mock APY data
  const getApy = (marketId: string) => {
    const apys: Record<string, number> = {
      'pe-1': 8.5,
      'pe-2': 12.3,
      'pe-3': 15.8,
      'mo-1': 5.2,
      'mo-2': 3.8,
      'mo-3': 2.9,
    };
    return apys[marketId] || 5.0;
  };

  // Mock TVL data
  const getTvl = (marketId: string) => {
    const tvls: Record<string, number> = {
      'pe-1': 245000000,
      'pe-2': 189000000,
      'pe-3': 98000000,
      'mo-1': 520000000,
      'mo-2': 380000000,
      'mo-3': 290000000,
    };
    return tvls[marketId] || 100000000;
  };

  return (
    <div className="flex h-full">
      {/* Markets List */}
      <div className="flex-1 flex flex-col border-r border-terminal-border">
        {/* Header */}
        <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-title font-bold text-terminal-accent font-display">
                {app?.icon}
              </span>
              <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
                {app?.name}
              </h2>
            </div>
            <span className="text-caption text-terminal-text-muted">
              {appPositions.length} POSITIONS
            </span>
          </div>
          <p className="text-micro text-terminal-text-muted">
            {app?.description}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 border-b border-terminal-border bg-terminal-bg-tertiary">
          <div className="px-4 py-3 border-r border-terminal-border">
            <div className="text-micro text-terminal-text-muted uppercase">TVL</div>
            <div className="text-caption text-terminal-text-primary font-bold">
              {formatVolume(appMarkets.reduce((sum, m) => sum + getTvl(m.id), 0))}
            </div>
          </div>
          <div className="px-4 py-3 border-r border-terminal-border">
            <div className="text-micro text-terminal-text-muted uppercase">AVG APY</div>
            <div className="text-caption text-terminal-positive font-bold">
              {(appMarkets.reduce((sum, m) => sum + getApy(m.id), 0) / appMarkets.length).toFixed(1)}%
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="text-micro text-terminal-text-muted uppercase">YOUR DEPOSITS</div>
            <div className="text-caption text-terminal-text-primary font-bold">
              {formatCurrency(appPositions.reduce((sum, p) => sum + p.size, 0))}
            </div>
          </div>
        </div>

        {/* Active Positions */}
        {appPositions.length > 0 && (
          <div className="border-b border-terminal-border">
            <div className="px-4 py-2 bg-terminal-bg-tertiary">
              <span className="text-micro text-terminal-text-muted uppercase">
                YOUR POSITIONS
              </span>
            </div>
            {appPositions.map(pos => (
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
                      <span className="text-micro text-terminal-positive font-bold">
                        SUPPLY
                      </span>
                      <span className="text-micro text-terminal-text-muted">
                        APY: {pos.pnlPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-caption text-terminal-text-primary">
                      {formatCurrency(pos.size)}
                    </div>
                    <div className="text-micro text-terminal-positive">
                      +{formatCurrency(pos.pnl)} earned
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
              {appId === 'pendle' ? 'YIELD MARKETS' : 'LENDING POOLS'}
            </span>
          </div>
          {appMarkets.map(market => {
            const apy = getApy(market.id);
            const tvl = getTvl(market.id);

            return (
              <button
                key={market.id}
                onClick={() => setActiveMarket(market.id)}
                className={`w-full px-4 py-4 text-left border-b border-terminal-border hover:bg-terminal-bg-secondary ${
                  activeMarketId === market.id ? 'bg-terminal-bg-secondary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-caption text-terminal-text-primary font-bold">
                      {market.name}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-micro text-terminal-text-muted">
                        <DollarSign size={10} />
                        <span>TVL: {formatVolume(tvl)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-micro text-terminal-text-muted">
                        <Clock size={10} />
                        <span>24H: {formatVolume(market.volume24h)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-terminal-positive">
                      <Percent size={14} />
                      <span className="text-title font-bold">{apy.toFixed(1)}%</span>
                    </div>
                    <div className="text-micro text-terminal-text-muted mt-1">
                      APY
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
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
            <TrendingUp size={32} className="mx-auto mb-4 text-terminal-text-muted" />
            <div className="text-caption text-terminal-text-muted">
              SELECT A {appId === 'pendle' ? 'YIELD MARKET' : 'LENDING POOL'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
