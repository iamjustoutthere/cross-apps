import { useState } from 'react';
import {
  Anchor,
  ExternalLink,
  Copy,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { whaleMovements, type WhaleMovement } from '../mock/opportunities';

type FilterType = 'all' | 'buy' | 'sell' | 'transfer';

export function WhaleTracker() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [followedWallets, setFollowedWallets] = useState<Set<string>>(new Set());

  const filteredMovements = filter === 'all'
    ? whaleMovements
    : whaleMovements.filter(m => m.action === filter);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-terminal-positive bg-terminal-positive/20';
      case 'sell': return 'text-terminal-negative bg-terminal-negative/20';
      case 'deposit': return 'text-terminal-positive bg-terminal-positive/20';
      case 'withdraw': return 'text-terminal-negative bg-terminal-negative/20';
      default: return 'text-terminal-text-secondary bg-terminal-bg-tertiary';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <ArrowUpRight size={12} />;
      case 'sell': return <ArrowDownRight size={12} />;
      case 'deposit': return <TrendingUp size={12} />;
      case 'withdraw': return <TrendingDown size={12} />;
      default: return <ArrowUpRight size={12} />;
    }
  };

  const toggleFollow = (walletAddress: string) => {
    setFollowedWallets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(walletAddress)) {
        newSet.delete(walletAddress);
      } else {
        newSet.add(walletAddress);
      }
      return newSet;
    });
  };

  const handleCopyTrade = (movement: WhaleMovement) => {
    alert(`Copy trade initiated!\n\nCopying: ${movement.walletLabel}\nAction: ${movement.action.toUpperCase()} ${movement.asset}\nAmount: ${formatCurrency(movement.amountUsd)}\n\nIn production, this would open a trade confirmation.`);
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'ALL' },
    { id: 'buy', label: 'BUYS' },
    { id: 'sell', label: 'SELLS' },
    { id: 'transfer', label: 'TRANSFERS' },
  ];

  return (
    <div className="flex flex-col h-full bg-terminal-bg-primary">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Anchor size={20} className="text-terminal-accent" />
            <div>
              <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
                WHALE TRACKER
              </h2>
              <p className="text-micro text-terminal-text-muted">
                MONITOR & COPY SMART MONEY MOVEMENTS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-terminal-positive/20 border border-terminal-positive text-terminal-positive text-micro">
            <div className="w-2 h-2 bg-terminal-positive animate-pulse" />
            LIVE FEED
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-terminal-border">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 text-micro border-r border-terminal-border ${
              filter === f.id
                ? 'bg-terminal-bg-tertiary text-terminal-text-primary'
                : 'text-terminal-text-muted hover:text-terminal-text-primary hover:bg-terminal-bg-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="px-4 py-2 text-micro text-terminal-text-muted">
          {followedWallets.size} FOLLOWING
        </div>
      </div>

      {/* Movements List */}
      <div className="flex-1 overflow-auto divide-y divide-terminal-border">
        {filteredMovements.map(movement => (
          <div
            key={movement.id}
            className="p-4 hover:bg-terminal-bg-secondary"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Wallet Info */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-bold text-terminal-text-primary">
                      {movement.walletLabel}
                    </span>
                    {movement.historicalAccuracy > 0 && (
                      <span className={`px-1.5 py-0.5 text-micro ${
                        movement.historicalAccuracy >= 70
                          ? 'bg-terminal-positive/20 text-terminal-positive'
                          : movement.historicalAccuracy >= 60
                            ? 'bg-terminal-warning/20 text-terminal-warning'
                            : 'bg-terminal-bg-tertiary text-terminal-text-muted'
                      }`}>
                        {movement.historicalAccuracy}% WIN
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFollow(movement.walletAddress)}
                    className={`flex items-center gap-1 px-2 py-0.5 text-micro border ${
                      followedWallets.has(movement.walletAddress)
                        ? 'bg-terminal-accent text-white border-terminal-accent'
                        : 'border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary'
                    }`}
                  >
                    {followedWallets.has(movement.walletAddress) ? (
                      <>
                        <CheckCircle size={10} />
                        FOLLOWING
                      </>
                    ) : (
                      <>
                        <UserCheck size={10} />
                        FOLLOW
                      </>
                    )}
                  </button>
                </div>

                {/* Action */}
                <div className="flex items-center gap-3 mb-2">
                  <span className={`flex items-center gap-1 px-2 py-0.5 text-micro font-bold uppercase ${getActionColor(movement.action)}`}>
                    {getActionIcon(movement.action)}
                    {movement.action}
                  </span>
                  <span className="text-caption text-terminal-text-primary">
                    {movement.amount.toLocaleString()} {movement.asset}
                  </span>
                  <span className="text-caption text-terminal-text-muted">
                    ({formatCurrency(movement.amountUsd)})
                  </span>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-micro text-terminal-text-muted">
                  <span>on {movement.platform}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {formatTime(movement.timestamp)}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(movement.walletAddress)}
                    className="flex items-center gap-1 hover:text-terminal-text-primary"
                  >
                    <Copy size={10} />
                    {movement.walletAddress}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {(movement.action === 'buy' || movement.action === 'deposit') && (
                  <button
                    onClick={() => handleCopyTrade(movement)}
                    className="flex items-center gap-2 px-3 py-2 bg-terminal-positive text-black text-micro font-bold hover:opacity-90"
                  >
                    <TrendingUp size={12} />
                    COPY TRADE
                  </button>
                )}
                <a
                  href={`https://etherscan.io/tx/${movement.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 border border-terminal-border text-terminal-text-muted text-micro hover:text-terminal-text-primary"
                >
                  <ExternalLink size={12} />
                  VIEW TX
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className="flex border-t border-terminal-border bg-terminal-bg-secondary">
        <div className="flex-1 px-4 py-3 border-r border-terminal-border">
          <div className="text-micro text-terminal-text-muted">24H BUY VOLUME</div>
          <div className="text-caption font-bold text-terminal-positive">
            {formatCurrency(whaleMovements.filter(m => m.action === 'buy').reduce((sum, m) => sum + m.amountUsd, 0))}
          </div>
        </div>
        <div className="flex-1 px-4 py-3 border-r border-terminal-border">
          <div className="text-micro text-terminal-text-muted">24H SELL VOLUME</div>
          <div className="text-caption font-bold text-terminal-negative">
            {formatCurrency(whaleMovements.filter(m => m.action === 'sell').reduce((sum, m) => sum + m.amountUsd, 0))}
          </div>
        </div>
        <div className="flex-1 px-4 py-3">
          <div className="text-micro text-terminal-text-muted">UNIQUE WALLETS</div>
          <div className="text-caption font-bold text-terminal-text-primary">
            {new Set(whaleMovements.map(m => m.walletAddress)).size}
          </div>
        </div>
      </div>
    </div>
  );
}
