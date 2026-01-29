import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Activity,
  PieChart,
  Target,
} from 'lucide-react';
import { portfolioRisk, liquidationRisks } from '../mock/opportunities';
import { useTerminalStore } from '../stores/terminalStore';

type ViewType = 'overview' | 'exposure' | 'liquidations' | 'stress';

export function RiskDashboard() {
  const { positions, portfolio } = useTerminalStore();
  const [activeView, setActiveView] = useState<ViewType>('overview');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-terminal-positive';
      case 'medium': return 'text-terminal-warning';
      case 'high': return 'text-terminal-negative';
      default: return 'text-terminal-text-muted';
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-terminal-positive';
      case 'medium': return 'bg-terminal-warning';
      case 'high': return 'bg-terminal-negative';
      default: return 'bg-terminal-text-muted';
    }
  };

  // Calculate position breakdown
  const positionsByApp = positions.reduce((acc, pos) => {
    acc[pos.appId] = (acc[pos.appId] || 0) + pos.size;
    return acc;
  }, {} as Record<string, number>);

  const longPositions = positions.filter(p => p.side === 'long' || p.side === 'yes' || p.side === 'supply');
  const shortPositions = positions.filter(p => p.side === 'short' || p.side === 'no' || p.side === 'borrow');

  const totalLong = longPositions.reduce((sum, p) => sum + p.size, 0);
  const totalShort = shortPositions.reduce((sum, p) => sum + p.size, 0);

  // Stress test scenarios
  const stressScenarios = [
    { name: 'BTC -10%', impact: -2800, pnl: -5.1 },
    { name: 'BTC -20%', impact: -5600, pnl: -10.2 },
    { name: 'ETH -15%', impact: -1950, pnl: -3.6 },
    { name: 'Market Crash -30%', impact: -8400, pnl: -15.3 },
    { name: 'Funding Flip', impact: -450, pnl: -0.8 },
  ];

  const views: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'OVERVIEW', icon: <Shield size={14} /> },
    { id: 'exposure', label: 'EXPOSURE', icon: <PieChart size={14} /> },
    { id: 'liquidations', label: 'LIQUIDATIONS', icon: <AlertTriangle size={14} /> },
    { id: 'stress', label: 'STRESS TEST', icon: <Activity size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-terminal-bg-primary">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-terminal-accent" />
            <div>
              <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
                RISK DASHBOARD
              </h2>
              <p className="text-micro text-terminal-text-muted">
                PORTFOLIO RISK ANALYSIS & MONITORING
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 border ${
            portfolioRisk.liquidationRisk === 'low'
              ? 'border-terminal-positive text-terminal-positive'
              : portfolioRisk.liquidationRisk === 'medium'
                ? 'border-terminal-warning text-terminal-warning'
                : 'border-terminal-negative text-terminal-negative'
          }`}>
            <div className={`w-2 h-2 ${getRiskBgColor(portfolioRisk.liquidationRisk)}`} />
            <span className="text-micro uppercase">{portfolioRisk.liquidationRisk} RISK</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-terminal-border">
        {views.map(view => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-2 px-4 py-3 text-caption border-r border-terminal-border ${
              activeView === view.id
                ? 'bg-terminal-bg-tertiary text-terminal-text-primary'
                : 'text-terminal-text-muted hover:text-terminal-text-primary hover:bg-terminal-bg-secondary'
            }`}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeView === 'overview' && (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <MetricCard
                label="TOTAL EXPOSURE"
                value={formatCurrency(portfolioRisk.totalExposure)}
                subValue={`${portfolioRisk.leverage.toFixed(2)}x leverage`}
              />
              <MetricCard
                label="NET EXPOSURE"
                value={formatCurrency(portfolioRisk.netExposure)}
                subValue={portfolioRisk.netExposure > 0 ? 'NET LONG' : 'NET SHORT'}
                valueColor={portfolioRisk.netExposure > 0 ? 'text-terminal-positive' : 'text-terminal-negative'}
              />
              <MetricCard
                label="VAR (95%)"
                value={formatCurrency(portfolioRisk.var95)}
                subValue="Daily at risk"
                valueColor="text-terminal-warning"
              />
              <MetricCard
                label="MAX DRAWDOWN"
                value={`${portfolioRisk.maxDrawdown}%`}
                subValue="Historical"
                valueColor="text-terminal-negative"
              />
            </div>

            {/* Risk Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-micro text-terminal-text-muted">SHARPE RATIO</span>
                  <span className="text-caption font-bold text-terminal-positive">
                    {portfolioRisk.sharpeRatio.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-terminal-bg-tertiary">
                  <div
                    className="h-full bg-terminal-positive"
                    style={{ width: `${Math.min(portfolioRisk.sharpeRatio / 3 * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-micro text-terminal-text-muted">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-micro text-terminal-text-muted">BTC CORRELATION</span>
                  <span className="text-caption font-bold text-terminal-text-primary">
                    {(portfolioRisk.correlationToBtc * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-terminal-bg-tertiary">
                  <div
                    className="h-full bg-terminal-accent"
                    style={{ width: `${portfolioRisk.correlationToBtc * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-micro text-terminal-text-muted">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-micro text-terminal-text-muted">CONCENTRATION</span>
                  <span className={`text-caption font-bold ${getRiskColor(portfolioRisk.concentrationRisk)}`}>
                    {portfolioRisk.concentrationRisk.toUpperCase()}
                  </span>
                </div>
                <div className="text-micro text-terminal-text-secondary">
                  Largest: {portfolioRisk.biggestPosition.asset} ({portfolioRisk.biggestPosition.percentage}%)
                </div>
              </div>
            </div>

            {/* Position Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
                <h4 className="text-micro text-terminal-text-muted uppercase mb-3">LONG POSITIONS</h4>
                <div className="text-display font-bold text-terminal-positive font-display">
                  {formatCurrency(totalLong)}
                </div>
                <div className="text-caption text-terminal-text-muted">
                  {longPositions.length} positions
                </div>
              </div>
              <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
                <h4 className="text-micro text-terminal-text-muted uppercase mb-3">SHORT POSITIONS</h4>
                <div className="text-display font-bold text-terminal-negative font-display">
                  {formatCurrency(totalShort)}
                </div>
                <div className="text-caption text-terminal-text-muted">
                  {shortPositions.length} positions
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'exposure' && (
          <div className="space-y-4">
            {/* Exposure by App */}
            <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
              <h4 className="text-micro text-terminal-text-muted uppercase mb-4">EXPOSURE BY APP</h4>
              <div className="space-y-3">
                {Object.entries(positionsByApp).map(([appId, size]) => {
                  const percentage = (size / portfolio.totalValue) * 100;
                  return (
                    <div key={appId}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-caption text-terminal-text-primary uppercase">
                          {appId}
                        </span>
                        <span className="text-caption text-terminal-text-secondary">
                          {formatCurrency(size)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-terminal-bg-tertiary">
                        <div
                          className="h-full bg-terminal-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Net Exposure Visualization */}
            <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
              <h4 className="text-micro text-terminal-text-muted uppercase mb-4">NET EXPOSURE</h4>
              <div className="relative h-8 bg-terminal-bg-tertiary">
                <div className="absolute inset-y-0 left-1/2 w-px bg-terminal-border" />
                {totalLong > 0 && (
                  <div
                    className="absolute inset-y-0 bg-terminal-positive/50 right-1/2"
                    style={{ width: `${(totalLong / (totalLong + totalShort)) * 50}%` }}
                  />
                )}
                {totalShort > 0 && (
                  <div
                    className="absolute inset-y-0 bg-terminal-negative/50 left-1/2"
                    style={{ width: `${(totalShort / (totalLong + totalShort)) * 50}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-2 text-micro">
                <span className="text-terminal-positive">LONG: {formatCurrency(totalLong)}</span>
                <span className="text-terminal-text-muted">NET: {formatCurrency(totalLong - totalShort)}</span>
                <span className="text-terminal-negative">SHORT: {formatCurrency(totalShort)}</span>
              </div>
            </div>
          </div>
        )}

        {activeView === 'liquidations' && (
          <div className="space-y-4">
            <div className="p-3 bg-terminal-warning/10 border border-terminal-warning/30 text-caption text-terminal-warning">
              <AlertTriangle size={14} className="inline mr-2" />
              Monitoring {liquidationRisks.length} large positions at risk of liquidation
            </div>

            {liquidationRisks.map(risk => (
              <div
                key={risk.id}
                className="p-4 border border-terminal-border bg-terminal-bg-secondary"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-title font-bold text-terminal-text-primary">
                        {risk.asset} {risk.side.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-terminal-bg-tertiary text-terminal-text-muted text-micro">
                        {risk.exchange}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-micro">
                      <div>
                        <span className="text-terminal-text-muted">SIZE</span>
                        <div className="text-terminal-text-primary font-bold">
                          {formatCurrency(risk.positionSize)}
                        </div>
                      </div>
                      <div>
                        <span className="text-terminal-text-muted">ENTRY</span>
                        <div className="text-terminal-text-primary">
                          {formatCurrency(risk.entryPrice)}
                        </div>
                      </div>
                      <div>
                        <span className="text-terminal-text-muted">CURRENT</span>
                        <div className="text-terminal-text-primary">
                          {formatCurrency(risk.currentPrice)}
                        </div>
                      </div>
                      <div>
                        <span className="text-terminal-text-muted">LIQUIDATION</span>
                        <div className="text-terminal-negative font-bold">
                          {formatCurrency(risk.liquidationPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-micro text-terminal-text-muted">DISTANCE TO LIQ</span>
                        <span className={`text-micro font-bold ${
                          risk.distanceToLiq < 5 ? 'text-terminal-negative' : 'text-terminal-warning'
                        }`}>
                          {risk.distanceToLiq.toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-2 bg-terminal-bg-tertiary">
                        <div
                          className={`h-full ${
                            risk.distanceToLiq < 5 ? 'bg-terminal-negative' : 'bg-terminal-warning'
                          }`}
                          style={{ width: `${100 - Math.min(risk.distanceToLiq * 5, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-micro text-terminal-text-muted mb-1">{risk.estimatedLiqTime}</div>
                    <div className="text-micro text-terminal-text-muted">
                      CASCADE: {formatCurrency(risk.potentialCascade)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'stress' && (
          <div className="space-y-4">
            <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
              <h4 className="text-micro text-terminal-text-muted uppercase mb-4">STRESS TEST SCENARIOS</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="py-2 text-left text-micro text-terminal-text-muted">SCENARIO</th>
                    <th className="py-2 text-right text-micro text-terminal-text-muted">IMPACT</th>
                    <th className="py-2 text-right text-micro text-terminal-text-muted">P&L %</th>
                    <th className="py-2 text-right text-micro text-terminal-text-muted">RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {stressScenarios.map((scenario, i) => (
                    <tr key={i} className="border-b border-terminal-border">
                      <td className="py-3 text-caption text-terminal-text-primary">
                        {scenario.name}
                      </td>
                      <td className="py-3 text-caption text-right text-terminal-negative">
                        {formatCurrency(scenario.impact)}
                      </td>
                      <td className="py-3 text-caption text-right text-terminal-negative">
                        {scenario.pnl}%
                      </td>
                      <td className="py-3 text-caption text-right">
                        <span className={`px-2 py-0.5 text-micro ${
                          Math.abs(scenario.pnl) < 10
                            ? 'bg-terminal-positive/20 text-terminal-positive'
                            : Math.abs(scenario.pnl) < 20
                              ? 'bg-terminal-warning/20 text-terminal-warning'
                              : 'bg-terminal-negative/20 text-terminal-negative'
                        }`}>
                          {Math.abs(scenario.pnl) < 10 ? 'SURVIVABLE' : Math.abs(scenario.pnl) < 20 ? 'PAINFUL' : 'CRITICAL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
              <h4 className="text-micro text-terminal-text-muted uppercase mb-4">RECOMMENDATIONS</h4>
              <div className="space-y-2 text-caption">
                <div className="flex items-center gap-2 p-2 bg-terminal-bg-primary border border-terminal-border">
                  <Target size={14} className="text-terminal-positive" />
                  <span className="text-terminal-text-secondary">
                    Consider reducing leverage to improve crash resilience
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-terminal-bg-primary border border-terminal-border">
                  <Target size={14} className="text-terminal-positive" />
                  <span className="text-terminal-text-secondary">
                    Add hedges to reduce net long exposure
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-terminal-bg-primary border border-terminal-border">
                  <Target size={14} className="text-terminal-warning" />
                  <span className="text-terminal-text-secondary">
                    Diversify across more assets to reduce concentration
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subValue,
  valueColor = 'text-terminal-text-primary',
}: {
  label: string;
  value: string;
  subValue: string;
  valueColor?: string;
}) {
  return (
    <div className="p-4 border border-terminal-border bg-terminal-bg-secondary">
      <div className="text-micro text-terminal-text-muted uppercase mb-2">{label}</div>
      <div className={`text-title font-bold font-display ${valueColor}`}>{value}</div>
      <div className="text-micro text-terminal-text-muted">{subValue}</div>
    </div>
  );
}
