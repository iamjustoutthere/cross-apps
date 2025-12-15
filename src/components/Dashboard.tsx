import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import {
  getTotalPortfolioValue,
  getTotalPnL,
  getAppBreakdown,
  positions,
  balances,
} from '../lib/mockData';
import { formatCurrency, formatPercent } from '../lib/utils';
import { TrendingUp, TrendingDown, Activity, Wallet, BarChart3 } from 'lucide-react';

export function Dashboard() {
  const totalValue = getTotalPortfolioValue();
  const totalPnL = getTotalPnL();
  const pnlPercent = (totalPnL / totalValue) * 100;
  const appBreakdown = getAppBreakdown();

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {appBreakdown.length} applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </div>
            <p className={`text-xs mt-1 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatPercent(pnlPercent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {positions.filter(p => p.pnl > 0).length} profitable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquid Balances</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balances.reduce((sum, b) => sum + b.valueUsd, 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available across all apps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* App Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Application Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appBreakdown.map(({ app, totalValue: appValue, totalPnl: appPnl, positions: posCount }) => (
              <div key={app.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: app.color }}
                  />
                  <div>
                    <div className="font-medium">{app.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {app.type.charAt(0).toUpperCase() + app.type.slice(1)} • {app.chain}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(appValue)}</div>
                  <div className={`text-xs ${appPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {appPnl >= 0 ? '+' : ''}{formatCurrency(appPnl)} • {posCount} pos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="text-left py-3 px-4">App</th>
                  <th className="text-left py-3 px-4">Asset</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Size</th>
                  <th className="text-right py-3 px-4">Entry</th>
                  <th className="text-right py-3 px-4">Current</th>
                  <th className="text-right py-3 px-4">P&L</th>
                  <th className="text-right py-3 px-4">%</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {position.app.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{position.asset}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          position.type === 'long' ? 'success' :
                          position.type === 'short' ? 'error' :
                          position.type === 'lend' ? 'default' :
                          'warning'
                        }
                      >
                        {position.type.toUpperCase()}
                        {position.leverage && `${position.leverage}x`}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {position.size.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ${position.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${position.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
