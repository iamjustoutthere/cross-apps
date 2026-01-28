import { Wallet, TrendingUp, Activity, Wifi } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';

export function StatusBar() {
  const { portfolio, positions, openModal } = useTerminalStore();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatPercent = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const isProfitable = totalPnl >= 0;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-terminal-border bg-terminal-bg-secondary">
      {/* Left Section - Balance */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => openModal('deposit')}
          className="flex items-center gap-2 hover:text-terminal-accent"
        >
          <Wallet size={14} className="text-terminal-text-muted" />
          <div className="flex items-center gap-2">
            <span className="text-caption text-terminal-text-muted">BALANCE</span>
            <span className="text-caption text-terminal-text-primary font-bold">
              {formatCurrency(portfolio.availableBalance)}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-terminal-text-muted" />
          <span className="text-caption text-terminal-text-muted">TOTAL VALUE</span>
          <span className="text-caption text-terminal-text-primary font-bold">
            {formatCurrency(portfolio.totalValue)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-caption text-terminal-text-muted">P&L</span>
          <span className={`text-caption font-bold ${
            isProfitable ? 'text-terminal-positive' : 'text-terminal-negative'
          }`}>
            {formatCurrency(totalPnl)} ({formatPercent(portfolio.totalPnlPercent)})
          </span>
        </div>
      </div>

      {/* Right Section - Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-terminal-text-muted" />
          <span className="text-caption text-terminal-text-muted">POSITIONS</span>
          <span className="text-caption text-terminal-text-primary">{positions.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-terminal-positive" />
          <span className="text-caption text-terminal-positive">CONNECTED</span>
        </div>

        <div className="text-micro text-terminal-text-muted">
          FAST v1.0
        </div>
      </div>
    </div>
  );
}
