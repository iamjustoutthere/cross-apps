import { useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useTerminalStore } from './stores/terminalStore';
import { CommandBar } from './components/CommandBar';
import { AppDock } from './components/AppDock';
import { StatusBar } from './components/StatusBar';
import { PositionsDashboard } from './components/PositionsDashboard';
import { DepositModal } from './components/DepositModal';
import { HelpModal } from './components/HelpModal';
import { OpportunitiesScanner } from './components/OpportunitiesScanner';
import { StrategiesModule } from './components/StrategiesModule';
import { RiskDashboard } from './components/RiskDashboard';
import { WhaleTracker } from './components/WhaleTracker';
import { SmartAlerts } from './components/SmartAlerts';
import { PolymarketModule } from './modules/PolymarketModule';
import { HyperliquidModule } from './modules/HyperliquidModule';
import { YieldModule } from './modules/YieldModule';

function Dashboard() {
  const { portfolio, positions, apps } = useTerminalStore();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

  const formatPercent = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  // Group positions by app
  const positionsByApp = apps.reduce((acc, app) => {
    acc[app.id] = positions.filter(p => p.appId === app.id);
    return acc;
  }, {} as Record<string, typeof positions>);

  // Calculate total P&L
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Portfolio Summary */}
      <div className="p-6 border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-6">
            <div className="p-4 border border-terminal-border bg-terminal-bg-primary">
              <div className="text-micro text-terminal-text-muted uppercase mb-2">
                TOTAL VALUE
              </div>
              <div className="text-display font-bold text-terminal-text-primary font-display">
                {formatCurrency(portfolio.totalValue)}
              </div>
            </div>

            <div className="p-4 border border-terminal-border bg-terminal-bg-primary">
              <div className="text-micro text-terminal-text-muted uppercase mb-2">
                AVAILABLE
              </div>
              <div className="text-display font-bold text-terminal-text-primary font-display">
                {formatCurrency(portfolio.availableBalance)}
              </div>
            </div>

            <div className="p-4 border border-terminal-border bg-terminal-bg-primary">
              <div className="text-micro text-terminal-text-muted uppercase mb-2">
                TOTAL P&L
              </div>
              <div className={`text-display font-bold font-display ${
                totalPnl >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
              }`}>
                {formatCurrency(totalPnl)}
              </div>
              <div className={`text-caption ${
                portfolio.totalPnlPercent >= 0 ? 'text-terminal-positive' : 'text-terminal-negative'
              }`}>
                {formatPercent(portfolio.totalPnlPercent)}
              </div>
            </div>

            <div className="p-4 border border-terminal-border bg-terminal-bg-primary">
              <div className="text-micro text-terminal-text-muted uppercase mb-2">
                ACTIVE POSITIONS
              </div>
              <div className="text-display font-bold text-terminal-text-primary font-display">
                {positions.length}
              </div>
              <div className="text-caption text-terminal-text-muted">
                across {Object.values(positionsByApp).filter(p => p.length > 0).length} apps
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Dashboard */}
      <div className="flex-1 overflow-hidden">
        <PositionsDashboard />
      </div>
    </div>
  );
}

function MainContent() {
  const { activeAppId, activeView } = useTerminalStore();

  // If an app is selected, show the app module
  if (activeAppId) {
    switch (activeAppId) {
      case 'polymarket':
      case 'kalshi':
      case 'opinion':
        return <PolymarketModule />;
      case 'hyperliquid':
      case 'lighter':
      case 'pacifica':
        return <HyperliquidModule />;
      case 'pendle':
        return <YieldModule appId="pendle" />;
      case 'morpho':
        return <YieldModule appId="morpho" />;
    }
  }

  // Otherwise show the active view
  switch (activeView) {
    case 'opportunities':
      return <OpportunitiesScanner />;
    case 'strategies':
      return <StrategiesModule />;
    case 'risk':
      return <RiskDashboard />;
    case 'whales':
      return <WhaleTracker />;
    case 'alerts':
      return <SmartAlerts />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
}

export function FastTerminal() {
  const { openModal } = useTerminalStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open help with ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          openModal('help');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openModal]);

  return (
    <div className="h-screen flex flex-col bg-terminal-bg-primary text-terminal-text-primary">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-terminal-border bg-terminal-bg-secondary">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-terminal-accent" />
            <span className="text-title font-bold text-terminal-text-primary font-display uppercase">
              FAST
            </span>
          </div>
          <span className="text-micro text-terminal-text-muted">
            ONE DEPOSIT. EVERY APP. ZERO FRICTION.
          </span>
        </div>

        {/* Command Bar */}
        <CommandBar />

        {/* Help */}
        <button
          onClick={() => openModal('help')}
          className="px-3 py-1 text-micro text-terminal-text-muted hover:text-terminal-text-primary border border-terminal-border hover:border-terminal-text-muted"
        >
          HELP [?]
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* App Dock */}
        <AppDock />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <MainContent />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Modals */}
      <DepositModal />
      <HelpModal />
    </div>
  );
}
