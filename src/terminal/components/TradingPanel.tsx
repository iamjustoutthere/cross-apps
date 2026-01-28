import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import type { Market } from '../mock/terminalData';

interface TradingPanelProps {
  market: Market;
}

export function TradingPanel({ market }: TradingPanelProps) {
  const { portfolio, apps } = useTerminalStore();
  const [side, setSide] = useState<'long' | 'short' | 'yes' | 'no'>('long');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(1);

  const app = apps.find(a => a.id === market.appId);
  const isPrediction = app?.category === 'prediction';
  const isYield = app?.category === 'yield';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return formatCurrency(value);
  };

  const handleTrade = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (parsedAmount > portfolio.availableBalance) return;

    // In a real app, this would execute the trade
    alert(`Trade executed: ${side.toUpperCase()} ${formatCurrency(parsedAmount)} on ${market.name}`);
    setAmount('');
  };

  const setPercentage = (percent: number) => {
    const value = (portfolio.availableBalance * percent) / 100;
    setAmount(value.toFixed(2));
  };

  return (
    <div className="flex flex-col h-full bg-terminal-bg-primary border border-terminal-border">
      {/* Market Header */}
      <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-caption font-bold text-terminal-accent">
                {app?.icon}
              </span>
              <h3 className="text-title font-bold text-terminal-text-primary">
                {market.name}
              </h3>
            </div>
            <span className="text-micro text-terminal-text-muted uppercase">
              {market.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-title font-bold text-terminal-text-primary">
              {market.price < 10 ? market.price.toFixed(4) : formatCurrency(market.price)}
            </div>
            <div className={`flex items-center justify-end gap-1 ${
              market.change24h >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
            }`}>
              {market.change24h >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span className="text-caption">
                {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-micro text-terminal-text-muted">
          <span>24H VOL: {formatVolume(market.volume24h)}</span>
        </div>
      </div>

      {/* Trading Form */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Side Selection */}
        <div className="mb-4">
          <label className="block text-micro text-terminal-text-muted uppercase mb-2">
            SIDE
          </label>
          <div className="grid grid-cols-2 gap-2">
            {isPrediction ? (
              <>
                <button
                  onClick={() => setSide('yes')}
                  className={`py-3 text-caption font-bold uppercase border ${
                    side === 'yes'
                      ? 'bg-terminal-positive text-black border-terminal-positive'
                      : 'border-terminal-border text-terminal-text-secondary hover:border-terminal-positive'
                  }`}
                >
                  YES
                </button>
                <button
                  onClick={() => setSide('no')}
                  className={`py-3 text-caption font-bold uppercase border ${
                    side === 'no'
                      ? 'bg-terminal-negative text-white border-terminal-negative'
                      : 'border-terminal-border text-terminal-text-secondary hover:border-terminal-negative'
                  }`}
                >
                  NO
                </button>
              </>
            ) : isYield ? (
              <button
                onClick={() => setSide('long')}
                className="col-span-2 py-3 text-caption font-bold uppercase border bg-terminal-positive text-black border-terminal-positive"
              >
                SUPPLY
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSide('long')}
                  className={`py-3 text-caption font-bold uppercase border ${
                    side === 'long'
                      ? 'bg-terminal-positive text-black border-terminal-positive'
                      : 'border-terminal-border text-terminal-text-secondary hover:border-terminal-positive'
                  }`}
                >
                  LONG
                </button>
                <button
                  onClick={() => setSide('short')}
                  className={`py-3 text-caption font-bold uppercase border ${
                    side === 'short'
                      ? 'bg-terminal-negative text-white border-terminal-negative'
                      : 'border-terminal-border text-terminal-text-secondary hover:border-terminal-negative'
                  }`}
                >
                  SHORT
                </button>
              </>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-micro text-terminal-text-muted uppercase mb-2">
            AMOUNT (USD)
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-terminal-bg-secondary border-b border-terminal-border text-body text-terminal-text-primary placeholder:text-terminal-text-muted outline-none focus:border-terminal-accent"
          />
          <div className="flex gap-2 mt-2">
            {[10, 25, 50, 100].map(percent => (
              <button
                key={percent}
                onClick={() => setPercentage(percent)}
                className="flex-1 py-1 text-micro border border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary hover:border-terminal-text-muted"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage (for perpetuals) */}
        {app?.category === 'perpetuals' && (
          <div className="mb-4">
            <label className="block text-micro text-terminal-text-muted uppercase mb-2">
              LEVERAGE: {leverage}x
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className="w-full h-2 bg-terminal-bg-secondary appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-micro text-terminal-text-muted">
              <span>1x</span>
              <span>5x</span>
              <span>10x</span>
              <span>20x</span>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-terminal-bg-secondary border border-terminal-border mb-4">
          <div className="text-micro text-terminal-text-muted uppercase mb-2">
            ORDER SUMMARY
          </div>
          <div className="space-y-2 text-caption">
            <div className="flex justify-between">
              <span className="text-terminal-text-muted">SIDE</span>
              <span className={`font-bold ${
                side === 'long' || side === 'yes' ? 'text-terminal-positive' : 'text-terminal-negative'
              }`}>
                {side.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-text-muted">SIZE</span>
              <span className="text-terminal-text-primary">
                {amount ? formatCurrency(parseFloat(amount) || 0) : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-text-muted">PRICE</span>
              <span className="text-terminal-text-primary">
                {market.price < 10 ? market.price.toFixed(4) : formatCurrency(market.price)}
              </span>
            </div>
            {app?.category === 'perpetuals' && (
              <div className="flex justify-between">
                <span className="text-terminal-text-muted">LEVERAGE</span>
                <span className="text-terminal-text-primary">{leverage}x</span>
              </div>
            )}
          </div>
        </div>

        {/* Available Balance */}
        <div className="flex items-center justify-between mb-4 text-caption">
          <span className="text-terminal-text-muted">AVAILABLE</span>
          <span className="text-terminal-text-primary">
            {formatCurrency(portfolio.availableBalance)}
          </span>
        </div>

        {/* Warning if amount exceeds balance */}
        {parseFloat(amount) > portfolio.availableBalance && (
          <div className="flex items-center gap-2 p-3 bg-terminal-negative/20 border border-terminal-negative mb-4">
            <AlertCircle size={14} className="text-terminal-negative" />
            <span className="text-caption text-terminal-negative">
              INSUFFICIENT BALANCE
            </span>
          </div>
        )}
      </div>

      {/* Execute Button */}
      <div className="p-4 border-t border-terminal-border bg-terminal-bg-secondary">
        <button
          onClick={handleTrade}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > portfolio.availableBalance}
          className={`w-full py-4 text-body font-bold uppercase ${
            side === 'long' || side === 'yes'
              ? 'bg-terminal-positive text-black hover:opacity-90 disabled:bg-terminal-text-muted disabled:text-terminal-bg-primary'
              : 'bg-terminal-negative text-white hover:opacity-90 disabled:bg-terminal-text-muted disabled:text-terminal-bg-primary'
          } disabled:cursor-not-allowed`}
        >
          {side === 'long' || side === 'yes' ? 'EXECUTE LONG' : 'EXECUTE SHORT'}
        </button>
      </div>
    </div>
  );
}
