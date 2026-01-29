import { useState } from 'react';
import {
  Play,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Zap,
  Shield,
  TrendingUp,
  DollarSign,
  X,
} from 'lucide-react';
import { strategyTemplates, type StrategyTemplate } from '../mock/opportunities';
import { useTerminalStore } from '../stores/terminalStore';

type CategoryFilter = 'all' | 'arbitrage' | 'yield' | 'hedging' | 'speculation' | 'income';

export function StrategiesModule() {
  const { portfolio } = useTerminalStore();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [executingStrategy, setExecutingStrategy] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<Record<string, string>>({});

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'ALL' },
    { id: 'arbitrage', label: 'ARBITRAGE' },
    { id: 'income', label: 'INCOME' },
    { id: 'yield', label: 'YIELD' },
    { id: 'hedging', label: 'HEDGING' },
    { id: 'speculation', label: 'SPECULATION' },
  ];

  const filteredStrategies = categoryFilter === 'all'
    ? strategyTemplates
    : strategyTemplates.filter(s => s.category === categoryFilter);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-terminal-positive bg-terminal-positive/20 border-terminal-positive';
      case 'medium': return 'text-terminal-warning bg-terminal-warning/20 border-terminal-warning';
      case 'high': return 'text-terminal-negative bg-terminal-negative/20 border-terminal-negative';
      default: return 'text-terminal-text-muted bg-terminal-bg-tertiary border-terminal-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'arbitrage': return <TrendingUp size={14} />;
      case 'yield': return <DollarSign size={14} />;
      case 'income': return <DollarSign size={14} />;
      case 'hedging': return <Shield size={14} />;
      case 'speculation': return <Zap size={14} />;
      default: return <Play size={14} />;
    }
  };

  const handleExecute = (strategy: StrategyTemplate) => {
    const amount = parseFloat(customAmount[strategy.id] || '') || strategy.minCapital;

    if (amount < strategy.minCapital) {
      alert(`Minimum capital required: ${formatCurrency(strategy.minCapital)}`);
      return;
    }

    if (amount > portfolio.availableBalance) {
      alert(`Insufficient balance. Available: ${formatCurrency(portfolio.availableBalance)}`);
      return;
    }

    setExecutingStrategy(strategy.id);

    // Simulate execution
    setTimeout(() => {
      setExecutingStrategy(null);
      alert(`Strategy "${strategy.name}" executed with ${formatCurrency(amount)}\n\nSteps executed:\n${
        strategy.steps.map(s => `${s.order}. ${s.action} ${s.asset} on ${s.platform} (${s.allocation}%)`).join('\n')
      }`);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-terminal-bg-primary">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play size={20} className="text-terminal-accent" />
            <div>
              <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
                ONE-CLICK STRATEGIES
              </h2>
              <p className="text-micro text-terminal-text-muted">
                PRE-BUILT STRATEGIES • EXECUTE IN SECONDS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-micro text-terminal-text-muted">
            <span>AVAILABLE:</span>
            <span className="text-terminal-text-primary font-bold">
              {formatCurrency(portfolio.availableBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex border-b border-terminal-border bg-terminal-bg-tertiary overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-2 text-micro whitespace-nowrap border-r border-terminal-border ${
              categoryFilter === cat.id
                ? 'bg-terminal-bg-primary text-terminal-text-primary'
                : 'text-terminal-text-muted hover:text-terminal-text-primary hover:bg-terminal-bg-secondary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Strategies List */}
      <div className="flex-1 overflow-auto">
        {filteredStrategies.map(strategy => (
          <div
            key={strategy.id}
            className="border-b border-terminal-border"
          >
            {/* Strategy Header */}
            <button
              onClick={() => setExpandedStrategy(
                expandedStrategy === strategy.id ? null : strategy.id
              )}
              className="w-full p-4 text-left hover:bg-terminal-bg-secondary"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`p-1.5 border ${getRiskColor(strategy.risk)}`}>
                      {getCategoryIcon(strategy.category)}
                    </span>
                    <span className="text-title font-bold text-terminal-text-primary">
                      {strategy.name}
                    </span>
                    {strategy.recommended && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-terminal-positive/20 text-terminal-positive text-micro">
                        <CheckCircle size={10} />
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-terminal-text-secondary mb-2">
                    {strategy.description}
                  </p>
                  <div className="flex items-center gap-4 text-micro">
                    <span className={`px-2 py-0.5 border uppercase ${getRiskColor(strategy.risk)}`}>
                      {strategy.risk} RISK
                    </span>
                    <span className="text-terminal-text-muted">
                      MIN: {formatCurrency(strategy.minCapital)}
                    </span>
                    <span className="text-terminal-text-muted">
                      MAX: {formatCurrency(strategy.maxCapital)}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  {strategy.expectedApy > 0 && (
                    <div>
                      <div className="text-display font-bold text-terminal-positive font-display">
                        {strategy.expectedApy}%
                      </div>
                      <div className="text-micro text-terminal-text-muted">EST APY</div>
                    </div>
                  )}
                  {expandedStrategy === strategy.id ? (
                    <ChevronDown size={20} className="text-terminal-text-muted" />
                  ) : (
                    <ChevronRight size={20} className="text-terminal-text-muted" />
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedStrategy === strategy.id && (
              <div className="px-4 pb-4 border-t border-terminal-border bg-terminal-bg-secondary">
                {/* Steps */}
                <div className="py-4">
                  <h4 className="text-micro text-terminal-text-muted uppercase mb-3">
                    EXECUTION STEPS
                  </h4>
                  <div className="space-y-2">
                    {strategy.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-terminal-bg-primary border border-terminal-border"
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-terminal-bg-tertiary text-micro font-bold">
                          {step.order}
                        </span>
                        <div className="flex-1">
                          <span className={`text-caption font-bold ${
                            step.side === 'buy' || step.side === 'long' || step.side === 'supply'
                              ? 'text-terminal-positive'
                              : 'text-terminal-negative'
                          }`}>
                            {step.action}
                          </span>
                          <span className="text-caption text-terminal-text-secondary ml-2">
                            {step.asset} on {step.platform}
                          </span>
                        </div>
                        <div className="text-right text-micro">
                          <div className="text-terminal-text-primary">{step.allocation}%</div>
                          {step.leverage && (
                            <div className="text-terminal-warning">{step.leverage}x LEV</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {strategy.warnings.length > 0 && (
                  <div className="py-4 border-t border-terminal-border">
                    <h4 className="text-micro text-terminal-text-muted uppercase mb-3">
                      WARNINGS
                    </h4>
                    <div className="space-y-2">
                      {strategy.warnings.map((warning, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-terminal-warning/10 border border-terminal-warning/30"
                        >
                          <AlertTriangle size={14} className="text-terminal-warning" />
                          <span className="text-caption text-terminal-warning">{warning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execute Section */}
                <div className="pt-4 border-t border-terminal-border">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-micro text-terminal-text-muted uppercase mb-2">
                        AMOUNT (USD)
                      </label>
                      <input
                        type="text"
                        value={customAmount[strategy.id] || ''}
                        onChange={(e) => setCustomAmount({
                          ...customAmount,
                          [strategy.id]: e.target.value
                        })}
                        placeholder={formatCurrency(strategy.minCapital)}
                        className="w-full px-4 py-3 bg-terminal-bg-primary border-b border-terminal-border text-body text-terminal-text-primary placeholder:text-terminal-text-muted outline-none focus:border-terminal-accent"
                      />
                      <div className="flex gap-2 mt-2">
                        {[25, 50, 75, 100].map(percent => (
                          <button
                            key={percent}
                            onClick={() => setCustomAmount({
                              ...customAmount,
                              [strategy.id]: ((portfolio.availableBalance * percent) / 100).toFixed(0)
                            })}
                            className="flex-1 py-1 text-micro border border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary hover:border-terminal-text-muted"
                          >
                            {percent}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleExecute(strategy)}
                      disabled={executingStrategy === strategy.id}
                      className={`flex items-center gap-2 px-6 py-4 text-caption font-bold ${
                        executingStrategy === strategy.id
                          ? 'bg-terminal-text-muted text-terminal-bg-primary cursor-wait'
                          : 'bg-terminal-accent text-white hover:opacity-90'
                      }`}
                    >
                      {executingStrategy === strategy.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-terminal-bg-primary border-t-transparent animate-spin" />
                          EXECUTING...
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          EXECUTE STRATEGY
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Strategy Execution Modal
export function StrategyExecutionModal({
  strategy,
  onClose,
  onConfirm,
}: {
  strategy: StrategyTemplate;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  const { portfolio } = useTerminalStore();
  const [amount, setAmount] = useState(strategy.minCapital.toString());

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);

  const parsedAmount = parseFloat(amount) || 0;
  const isValid = parsedAmount >= strategy.minCapital && parsedAmount <= portfolio.availableBalance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-lg border border-terminal-border bg-terminal-bg-secondary">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border">
          <h3 className="text-title font-bold text-terminal-text-primary font-display uppercase">
            EXECUTE: {strategy.name}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-terminal-bg-tertiary">
            <X size={16} className="text-terminal-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Steps Preview */}
          <div className="mb-4">
            <h4 className="text-micro text-terminal-text-muted uppercase mb-2">
              WILL EXECUTE:
            </h4>
            <div className="space-y-1">
              {strategy.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-caption">
                  <span className="text-terminal-text-muted">{step.order}.</span>
                  <span className={step.side === 'buy' || step.side === 'long' ? 'text-terminal-positive' : 'text-terminal-negative'}>
                    {step.action}
                  </span>
                  <span className="text-terminal-text-secondary">
                    {step.asset} ({step.allocation}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-micro text-terminal-text-muted uppercase mb-2">
              AMOUNT
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-terminal-bg-primary border-b border-terminal-border text-body text-terminal-text-primary outline-none focus:border-terminal-accent"
            />
            <div className="flex justify-between mt-1 text-micro text-terminal-text-muted">
              <span>Min: {formatCurrency(strategy.minCapital)}</span>
              <span>Available: {formatCurrency(portfolio.availableBalance)}</span>
            </div>
          </div>

          {/* Warnings */}
          {strategy.warnings.length > 0 && (
            <div className="mb-4 p-3 bg-terminal-warning/10 border border-terminal-warning/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-terminal-warning" />
                <span className="text-caption font-bold text-terminal-warning">RISKS</span>
              </div>
              <ul className="text-micro text-terminal-warning space-y-1">
                {strategy.warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-terminal-border">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-terminal-border text-caption text-terminal-text-secondary hover:bg-terminal-bg-tertiary"
          >
            CANCEL
          </button>
          <button
            onClick={() => isValid && onConfirm(parsedAmount)}
            disabled={!isValid}
            className={`flex-1 py-3 text-caption font-bold ${
              isValid
                ? 'bg-terminal-accent text-white hover:opacity-90'
                : 'bg-terminal-text-muted text-terminal-bg-primary cursor-not-allowed'
            }`}
          >
            CONFIRM EXECUTION
          </button>
        </div>
      </div>
    </div>
  );
}
