import { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  Wifi,
  Clock,
  Zap,
} from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import { AlertBadge, SmartAlerts } from './SmartAlerts';

export function StatusBar() {
  const { portfolio, positions, openModal } = useTerminalStore();
  const [showAlerts, setShowAlerts] = useState(false);

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

  // Simulated values
  const latency = 12;

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
          <span className="text-caption text-terminal-text-muted">TOTAL</span>
          <span className="text-caption text-terminal-text-primary font-bold">
            {formatCurrency(portfolio.totalValue)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-caption text-terminal-text-muted">P&L</span>
          <span className={`flex items-center gap-1 text-caption font-bold ${
            isProfitable ? 'text-terminal-positive' : 'text-terminal-negative'
          }`}>
            {isProfitable ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {formatCurrency(totalPnl)} ({formatPercent(portfolio.totalPnlPercent)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Activity size={14} className="text-terminal-text-muted" />
          <span className="text-caption text-terminal-text-muted">POSITIONS</span>
          <span className="text-caption text-terminal-text-primary">{positions.length}</span>
        </div>
      </div>

      {/* Right Section - Status */}
      <div className="flex items-center gap-4">
        {/* Alerts */}
        <div className="relative">
          <AlertBadge onClick={() => setShowAlerts(!showAlerts)} />
          {showAlerts && (
            <div className="absolute bottom-full right-0 mb-2 z-50">
              <SmartAlerts compact onClose={() => setShowAlerts(false)} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-2 py-1 border border-terminal-positive text-terminal-positive">
          <Wifi size={12} />
          <span className="text-micro">CONNECTED</span>
          <span className="text-micro text-terminal-text-muted">({latency}ms)</span>
        </div>

        <div className="flex items-center gap-2 px-2 py-1 bg-terminal-accent/20 border border-terminal-accent text-terminal-accent">
          <Zap size={12} />
          <span className="text-micro">FAST</span>
        </div>

        <div className="flex items-center gap-2 text-terminal-text-muted">
          <Clock size={12} />
          <span className="text-micro">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>
    </div>
  );
}
