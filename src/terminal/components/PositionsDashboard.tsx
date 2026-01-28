import { useState } from 'react';
import { X, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';

type FilterType = 'all' | 'prediction' | 'perpetuals' | 'yield';

export function PositionsDashboard() {
  const { positions, apps, closePosition } = useTerminalStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<'pnl' | 'size' | 'time'>('pnl');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatPercent = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'now';
  };

  const getAppById = (appId: string) => apps.find(a => a.id === appId);

  // Filter positions
  const filteredPositions = positions.filter(pos => {
    if (filter === 'all') return true;
    const app = getAppById(pos.appId);
    return app?.category === filter;
  });

  // Sort positions
  const sortedPositions = [...filteredPositions].sort((a, b) => {
    switch (sortBy) {
      case 'pnl':
        return b.pnl - a.pnl;
      case 'size':
        return b.size - a.size;
      case 'time':
        return b.timestamp - a.timestamp;
      default:
        return 0;
    }
  });

  // Calculate totals
  const totalSize = positions.reduce((sum, p) => sum + p.size, 0);
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'PREDICTION', value: 'prediction' },
    { label: 'PERPETUALS', value: 'perpetuals' },
    { label: 'YIELD', value: 'yield' },
  ];

  return (
    <div className="flex flex-col h-full bg-terminal-bg-primary">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
              POSITIONS
            </h2>
            <span className="text-caption text-terminal-text-muted">
              {positions.length} ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter */}
            <div className="flex items-center gap-1">
              <Filter size={12} className="text-terminal-text-muted" />
              {filters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-2 py-1 text-micro border ${
                    filter === f.value
                      ? 'bg-terminal-accent text-white border-terminal-accent'
                      : 'border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'pnl' | 'size' | 'time')}
              className="px-2 py-1 text-micro bg-terminal-bg-tertiary border border-terminal-border text-terminal-text-primary outline-none"
            >
              <option value="pnl">SORT: P&L</option>
              <option value="size">SORT: SIZE</option>
              <option value="time">SORT: TIME</option>
            </select>
          </div>
        </div>

        {/* Summary Row */}
        <div className="flex items-center gap-8 px-4 py-2 border-t border-terminal-border bg-terminal-bg-primary">
          <div className="flex items-center gap-2">
            <span className="text-caption text-terminal-text-muted">TOTAL SIZE</span>
            <span className="text-caption text-terminal-text-primary font-bold">
              {formatCurrency(totalSize)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption text-terminal-text-muted">TOTAL P&L</span>
            <span className={`text-caption font-bold ${
              totalPnl >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
            }`}>
              {formatCurrency(totalPnl)}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-terminal-bg-secondary border-b border-terminal-border">
            <tr>
              <th className="px-4 py-2 text-left text-micro text-terminal-text-muted uppercase">
                APP
              </th>
              <th className="px-4 py-2 text-left text-micro text-terminal-text-muted uppercase">
                MARKET
              </th>
              <th className="px-4 py-2 text-left text-micro text-terminal-text-muted uppercase">
                SIDE
              </th>
              <th className="px-4 py-2 text-right text-micro text-terminal-text-muted uppercase">
                SIZE
              </th>
              <th className="px-4 py-2 text-right text-micro text-terminal-text-muted uppercase">
                ENTRY
              </th>
              <th className="px-4 py-2 text-right text-micro text-terminal-text-muted uppercase">
                CURRENT
              </th>
              <th className="px-4 py-2 text-right text-micro text-terminal-text-muted uppercase">
                P&L
              </th>
              <th className="px-4 py-2 text-right text-micro text-terminal-text-muted uppercase">
                TIME
              </th>
              <th className="px-4 py-2 text-center text-micro text-terminal-text-muted uppercase">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((position, index) => {
              const app = getAppById(position.appId);
              const isProfitable = position.pnl >= 0;

              return (
                <tr
                  key={position.id}
                  className={`border-b border-terminal-border hover:bg-terminal-bg-secondary ${
                    index % 2 === 1 ? 'bg-terminal-bg-secondary/50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-bold text-terminal-accent">
                        {app?.icon}
                      </span>
                      <span className="text-caption text-terminal-text-secondary">
                        {app?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-caption text-terminal-text-primary">
                      {position.market}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-caption uppercase font-bold ${
                      position.side === 'long' || position.side === 'yes' || position.side === 'supply'
                        ? 'text-terminal-positive'
                        : 'text-terminal-negative'
                    }`}>
                      {position.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-caption text-terminal-text-primary">
                      {formatCurrency(position.size)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-caption text-terminal-text-secondary">
                      {position.entryPrice < 10
                        ? position.entryPrice.toFixed(4)
                        : formatCurrency(position.entryPrice)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-caption text-terminal-text-primary">
                      {position.currentPrice < 10
                        ? position.currentPrice.toFixed(4)
                        : formatCurrency(position.currentPrice)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isProfitable ? (
                        <ArrowUpRight size={12} className="text-terminal-positive" />
                      ) : (
                        <ArrowDownRight size={12} className="text-terminal-negative" />
                      )}
                      <span className={`text-caption font-bold ${
                        isProfitable ? 'text-terminal-positive' : 'text-terminal-negative'
                      }`}>
                        {formatCurrency(position.pnl)}
                      </span>
                      <span className={`text-micro ${
                        isProfitable ? 'text-terminal-positive' : 'text-terminal-negative'
                      }`}>
                        ({formatPercent(position.pnlPercent)})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-caption text-terminal-text-muted">
                      {formatTime(position.timestamp)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => closePosition(position.id)}
                      className="p-1 border border-terminal-border hover:bg-terminal-negative hover:border-terminal-negative hover:text-white"
                      title="Close position"
                    >
                      <X size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedPositions.length === 0 && (
          <div className="flex items-center justify-center h-48 text-terminal-text-muted">
            <span className="text-caption">NO POSITIONS FOUND</span>
          </div>
        )}
      </div>
    </div>
  );
}
