import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  getTotalPortfolioValue,
  getTotalPnL,
  getAppBreakdown,
  positions,
  balances,
  apps,
  type Position,
  type AppType,
} from '../lib/mockData';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  // Automation toggles
  const [autoCollateralEnabled, setAutoCollateralEnabled] = useState(true);
  const [smartRouterEnabled, setSmartRouterEnabled] = useState(true);
  const [fundingOptimizerEnabled, setFundingOptimizerEnabled] = useState(false);

  const totalValue = getTotalPortfolioValue();
  const totalPnL = getTotalPnL();
  const appBreakdown = getAppBreakdown();

  const filteredPositions = selectedApp
    ? positions.filter((p) => p.app === selectedApp)
    : positions;

  const filteredBalances = selectedApp
    ? balances.filter((b) => b.app === selectedApp)
    : balances;

  // Mock opportunities data
  const opportunities = [
    {
      id: '1',
      type: 'ARBITRAGE',
      description: 'ETH price difference detected',
      apps: ['hyperliquid', 'lighter'],
      profit: 125.50,
      action: 'Buy Hyperliquid @ $3,398 → Sell Lighter @ $3,405',
    },
    {
      id: '2',
      type: 'FUNDING RATE',
      description: 'Positive funding on SOL-PERP',
      apps: ['lighter'],
      profit: 0.08,
      action: 'Short SOL on Lighter to capture +0.08% funding',
    },
    {
      id: '3',
      type: 'YIELD OPTIMIZATION',
      description: 'Better USDC yield available',
      apps: ['morpho'],
      profit: 45.20,
      action: 'Move 10k USDC to Morpho for +1.8% APR boost',
    },
  ];

  const strategies = [
    {
      id: 'delta-neutral',
      name: 'DELTA NEUTRAL',
      description: 'Long spot + Short perp to capture funding',
      apps: ['morpho', 'hyperliquid'],
      risk: 'LOW',
    },
    {
      id: 'basis-trade',
      name: 'BASIS TRADE',
      description: 'Capture basis between spot and futures',
      apps: ['lighter', 'hyperliquid'],
      risk: 'LOW',
    },
    {
      id: 'funding-arb',
      name: 'FUNDING ARB',
      description: 'Exploit funding rate differences',
      apps: ['hyperliquid', 'lighter'],
      risk: 'MEDIUM',
    },
    {
      id: 'yield-rotation',
      name: 'YIELD ROTATION',
      description: 'Auto-rotate to highest yields',
      apps: ['morpho', 'polymarket'],
      risk: 'LOW',
    },
  ];

  const alerts = [
    {
      id: '1',
      type: 'WARNING',
      message: 'ETH-PERP liquidation risk at $2,900 (-13.2%)',
      action: 'ADD COLLATERAL',
    },
    {
      id: '2',
      type: 'INFO',
      message: 'SOL funding rate changed to +0.12%',
      action: 'VIEW DETAILS',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="border-2 border-black bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
            TOTAL VALUE
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-black">
            {formatCurrency(totalValue)}
          </div>
        </div>

        <div className="border-2 border-black bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
            P&L
          </div>
          <div
            className={`text-2xl md:text-3xl font-bold font-mono ${
              totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {totalPnL >= 0 ? '+' : ''}
            {formatCurrency(totalPnL)}
          </div>
        </div>

        <div className="border-2 border-black bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
            POSITIONS
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-black">
            {positions.length}
          </div>
        </div>

        <div className="border-2 border-black bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
            RISK SCORE
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-600">
            7.2/10
          </div>
        </div>
      </div>

      {/* Automation Features */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Auto-Collateral Shield */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">🛡️ AUTO-COLLATERAL</CardTitle>
              <button
                onClick={() => setAutoCollateralEnabled(!autoCollateralEnabled)}
                className={`w-12 h-6 border-2 border-black transition-all ${
                  autoCollateralEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white border-2 border-black transition-transform ${
                    autoCollateralEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-xs text-gray-700">
                Automatically adds collateral before liquidation threshold
              </div>
              <div className="border-2 border-black bg-emerald-50 p-3">
                <div className="text-xs font-bold uppercase text-gray-700">PROTECTED</div>
                <div className="text-2xl font-mono font-bold text-emerald-600">$127K</div>
              </div>
              {autoCollateralEnabled && (
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Threshold:</span>
                    <span className="font-mono font-bold">130%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Source:</span>
                    <span className="font-mono font-bold">MORPHO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Saved (YTD):</span>
                    <span className="font-mono font-bold text-emerald-600">$27K</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Smart Order Router */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">📊 SMART ROUTER</CardTitle>
              <button
                onClick={() => setSmartRouterEnabled(!smartRouterEnabled)}
                className={`w-12 h-6 border-2 border-black transition-all ${
                  smartRouterEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white border-2 border-black transition-transform ${
                    smartRouterEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-xs text-gray-700">
                Routes orders to best execution across all venues
              </div>
              <div className="border-2 border-black bg-blue-50 p-3">
                <div className="text-xs font-bold uppercase text-gray-700">SAVED (MONTH)</div>
                <div className="text-2xl font-mono font-bold text-blue-600">$8.2K</div>
              </div>
              {smartRouterEnabled && (
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Trades:</span>
                    <span className="font-mono font-bold">342</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Avg Savings:</span>
                    <span className="font-mono font-bold text-blue-600">$24/trade</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Best Route:</span>
                    <span className="font-mono font-bold text-xs">MULTI</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Funding Rate Optimizer */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">💰 FUNDING OPT</CardTitle>
              <button
                onClick={() => setFundingOptimizerEnabled(!fundingOptimizerEnabled)}
                className={`w-12 h-6 border-2 border-black transition-all ${
                  fundingOptimizerEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white border-2 border-black transition-transform ${
                    fundingOptimizerEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-xs text-gray-700">
                Auto-rotates positions to best funding rates
              </div>
              {fundingOptimizerEnabled ? (
                <div className="border-2 border-black bg-purple-50 p-3">
                  <div className="text-xs font-bold uppercase text-gray-700">EARNING (MONTH)</div>
                  <div className="text-2xl font-mono font-bold text-purple-600">$4.5K</div>
                </div>
              ) : (
                <div className="border-2 border-black bg-amber-50 p-3">
                  <div className="text-xs font-bold uppercase text-gray-700">OPPORTUNITY</div>
                  <div className="text-2xl font-mono font-bold text-amber-600">+$4.5K</div>
                </div>
              )}
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-700">Current:</span>
                  <span className="font-mono font-bold">+0.01%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Best:</span>
                  <span className="font-mono font-bold text-emerald-600">+0.15%</span>
                </div>
                {!fundingOptimizerEnabled && (
                  <Button
                    size="sm"
                    variant="accent"
                    className="w-full mt-2"
                    onClick={() => setFundingOptimizerEnabled(true)}
                  >
                    ENABLE NOW
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ SMART OPPORTUNITIES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="border-2 border-black p-4 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">{opp.type}</Badge>
                    <span className="font-bold text-sm">{opp.description}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-emerald-600">
                      +{typeof opp.profit === 'number' ? formatCurrency(opp.profit) : `${opp.profit}%`}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-3">{opp.action}</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {opp.apps.map((appId) => {
                      const app = apps.find((a) => a.id === appId);
                      return (
                        <Badge key={appId} style={{ borderColor: app?.color, color: app?.color }}>
                          {app?.name}
                        </Badge>
                      );
                    })}
                  </div>
                  <Button size="sm" variant="primary">
                    EXECUTE
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - One-Click Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 QUICK STRATEGIES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`border-2 border-black p-4 text-left transition-all ${
                  selectedStrategy === strategy.id
                    ? 'bg-black text-white'
                    : 'bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-sm uppercase tracking-wide">
                    {strategy.name}
                  </div>
                  <Badge
                    variant={strategy.risk === 'LOW' ? 'success' : 'warning'}
                    className={selectedStrategy === strategy.id ? 'bg-white text-black' : ''}
                  >
                    {strategy.risk}
                  </Badge>
                </div>
                <div className={`text-xs mb-3 ${selectedStrategy === strategy.id ? 'text-white' : 'text-gray-700'}`}>
                  {strategy.description}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {strategy.apps.map((appId) => {
                    const app = apps.find((a) => a.id === appId);
                    return (
                      <Badge
                        key={appId}
                        className={selectedStrategy === strategy.id ? 'bg-white text-black' : ''}
                        style={selectedStrategy !== strategy.id ? { borderColor: app?.color, color: app?.color } : {}}
                      >
                        {app?.name}
                      </Badge>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
          {selectedStrategy && (
            <div className="mt-4 border-t-2 border-black pt-4">
              <Button variant="accent" className="w-full">
                DEPLOY STRATEGY
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🛡️ SMART ALERTS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-2 p-3 flex items-center justify-between ${
                    alert.type === 'WARNING'
                      ? 'border-red-600 bg-red-50'
                      : 'border-black bg-white'
                  }`}
                >
                  <div>
                    <Badge variant={alert.type === 'WARNING' ? 'error' : 'default'}>
                      {alert.type}
                    </Badge>
                    <span className="ml-2 text-sm font-medium">{alert.message}</span>
                  </div>
                  <Button size="sm" variant="secondary">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Actions */}
      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
              EMERGENCY CONTROLS
            </div>
            <div className="text-sm text-gray-700">
              Close all positions across all apps instantly
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              PAUSE ALL AUTOMATION
            </Button>
            <Button variant="accent">
              EMERGENCY EXIT ALL
            </Button>
          </div>
        </div>
      </div>

      {/* App Filter */}
      <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle>FILTER BY APP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedApp === null ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedApp(null)}
            >
              ALL APPS
            </Button>
            {apps.map((app) => (
              <Button
                key={app.id}
                variant={selectedApp === app.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedApp(app.id)}
              >
                {app.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </div>

      {/* App Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>APPLICATION BREAKDOWN</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {appBreakdown.map(({ app, totalValue: appValue, totalPnl: appPnl }) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className={`border-2 border-black p-4 text-left transition-all ${
                  selectedApp === app.id
                    ? 'bg-black text-white'
                    : 'bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 border-2 border-black"
                      style={{ backgroundColor: app.color }}
                    />
                    <div className="font-bold text-sm uppercase tracking-wide">{app.name}</div>
                  </div>
                  <Badge className={selectedApp === app.id ? 'bg-white text-black' : ''}>
                    {app.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className={`font-medium uppercase ${selectedApp === app.id ? 'text-white' : 'text-gray-700'}`}>
                      VALUE
                    </div>
                    <div className="font-mono font-bold">{formatCurrency(appValue)}</div>
                  </div>
                  <div>
                    <div className={`font-medium uppercase ${selectedApp === app.id ? 'text-white' : 'text-gray-700'}`}>
                      P&L
                    </div>
                    <div
                      className={`font-mono font-bold ${
                        appPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {appPnl >= 0 ? '+' : ''}
                      {formatCurrency(appPnl)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              ACTIVE POSITIONS {selectedApp && `- ${apps.find(a => a.id === selectedApp)?.name}`}
            </CardTitle>
            {selectedApp && (
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs font-bold uppercase tracking-wide text-white hover:underline"
              >
                CLEAR FILTER
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wide">
                    APP
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wide">
                    ASSET
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wide">
                    TYPE
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wide">
                    SIZE
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wide">
                    P&L
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wide">
                    %
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wide">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.map((position) => (
                  <tr
                    key={position.id}
                    className={`border-b border-black cursor-pointer transition-all ${
                      selectedPosition?.id === position.id
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPosition(position)}
                  >
                    <td className="py-3 px-4">
                      <Badge className={selectedPosition?.id === position.id ? 'bg-white text-black' : ''}>
                        {position.app}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sm">{position.asset}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={position.type === 'long' || position.type === 'lend' ? 'success' : 'error'}
                      >
                        {position.type} {position.leverage && `${position.leverage}X`}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm">
                      {position.size.toFixed(4)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold ${
                        position.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {position.pnl >= 0 ? '+' : ''}
                      {formatCurrency(position.pnl)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold ${
                        position.pnlPercent >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {position.pnlPercent >= 0 ? '+' : ''}
                      {position.pnlPercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="secondary">
                        DETAILS
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Position Detail Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b-4 border-black bg-black px-6 py-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">
                  POSITION DETAILS
                </h2>
                <button
                  onClick={() => setSelectedPosition(null)}
                  className="text-white hover:bg-white hover:text-black border-2 border-white w-10 h-10 flex items-center justify-center font-bold text-2xl transition-all"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-black p-3 bg-gray-50">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                    ASSET
                  </div>
                  <div className="text-xl font-bold font-mono">{selectedPosition.asset}</div>
                </div>
                <div className="border-2 border-black p-3 bg-gray-50">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                    APP
                  </div>
                  <div className="text-xl font-bold uppercase">{selectedPosition.app}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-black p-3">
                  <div className="text-xs font-medium text-gray-700 uppercase">SIZE</div>
                  <div className="text-lg font-mono font-bold">{selectedPosition.size}</div>
                </div>
                <div className="border-2 border-black p-3">
                  <div className="text-xs font-medium text-gray-700 uppercase">TYPE</div>
                  <div className="text-lg font-bold uppercase">{selectedPosition.type}</div>
                </div>
                <div className="border-2 border-black p-3">
                  <div className="text-xs font-medium text-gray-700 uppercase">ENTRY PRICE</div>
                  <div className="text-lg font-mono font-bold">
                    ${selectedPosition.entryPrice.toLocaleString()}
                  </div>
                </div>
                <div className="border-2 border-black p-3">
                  <div className="text-xs font-medium text-gray-700 uppercase">CURRENT PRICE</div>
                  <div className="text-lg font-mono font-bold">
                    ${selectedPosition.currentPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="border-4 border-black p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                      P&L
                    </div>
                    <div
                      className={`text-2xl font-mono font-bold ${
                        selectedPosition.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {selectedPosition.pnl >= 0 ? '+' : ''}
                      {formatCurrency(selectedPosition.pnl)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                      P&L %
                    </div>
                    <div
                      className={`text-2xl font-mono font-bold ${
                        selectedPosition.pnlPercent >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {selectedPosition.pnlPercent >= 0 ? '+' : ''}
                      {selectedPosition.pnlPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>

              {selectedPosition.liquidationPrice && (
                <div className="border-2 border-red-600 bg-red-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                    LIQUIDATION PRICE
                  </div>
                  <div className="text-xl font-mono font-bold text-red-600">
                    ${selectedPosition.liquidationPrice.toLocaleString()}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  CLOSE POSITION
                </Button>
                <Button variant="secondary" className="flex-1">
                  ADJUST
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balances */}
      {filteredBalances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>LIQUID BALANCES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredBalances.map((balance, i) => (
                <div key={i} className="border-2 border-black p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold font-mono">{balance.asset}</div>
                    <Badge>{balance.app}</Badge>
                  </div>
                  <div className="text-xl font-bold font-mono">{balance.amount.toFixed(4)}</div>
                  <div className="text-xs text-gray-700 font-medium">
                    {formatCurrency(balance.valueUsd)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
