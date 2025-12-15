import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { apps, positions, balances } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';
import { CheckCircle2, XCircle, Activity } from 'lucide-react';

export function AppDetails() {
  return (
    <div className="space-y-6">
      {/* App Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app) => {
          const appBalances = balances.filter((b) => b.app === app.id);
          const appPositions = positions.filter((p) => p.app === app.id);
          const totalBalance = appBalances.reduce((sum, b) => sum + b.valueUsd, 0);
          const totalPositionValue = appPositions.reduce(
            (sum, p) => sum + p.size * p.currentPrice,
            0
          );
          const totalPnl = appPositions.reduce((sum, p) => sum + p.pnl, 0);

          return (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: app.color }}
                    />
                    <div>
                      <CardTitle>{app.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {app.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{app.chain}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.status === 'connected' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-500">Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500">Disconnected</span>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-secondary/50">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Value</div>
                    <div className="font-medium">
                      {formatCurrency(totalBalance + totalPositionValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Positions</div>
                    <div className="font-medium font-mono">{appPositions.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">P&L</div>
                    <div
                      className={`font-medium ${
                        totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {totalPnl >= 0 ? '+' : ''}
                      {formatCurrency(totalPnl)}
                    </div>
                  </div>
                </div>

                {/* Balances */}
                {appBalances.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Balances</div>
                    <div className="space-y-2">
                      {appBalances.map((balance, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm p-2 rounded bg-secondary/30"
                        >
                          <span className="font-medium">{balance.asset}</span>
                          <div className="text-right">
                            <div className="font-mono">
                              {balance.amount.toLocaleString('en-US', {
                                maximumFractionDigits: 4,
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(balance.valueUsd)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Positions */}
                {appPositions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Active Positions</div>
                    <div className="space-y-2">
                      {appPositions.map((position) => (
                        <div
                          key={position.id}
                          className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium">{position.asset}</div>
                            <Badge
                              variant={
                                position.type === 'long'
                                  ? 'success'
                                  : position.type === 'short'
                                  ? 'error'
                                  : 'default'
                              }
                            >
                              {position.type.toUpperCase()}
                              {position.leverage && ` ${position.leverage}x`}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-muted-foreground">Size</div>
                              <div className="font-mono">
                                {position.size.toLocaleString('en-US', {
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Entry Price</div>
                              <div className="font-mono">
                                ${position.entryPrice.toLocaleString('en-US')}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Current Price</div>
                              <div className="font-mono">
                                ${position.currentPrice.toLocaleString('en-US')}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">P&L</div>
                              <div
                                className={`font-mono ${
                                  position.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                                }`}
                              >
                                {position.pnl >= 0 ? '+' : ''}
                                {formatCurrency(position.pnl)}
                              </div>
                            </div>
                          </div>
                          {position.liquidationPrice && (
                            <div className="mt-2 pt-2 border-t border-border text-xs">
                              <span className="text-muted-foreground">Liquidation: </span>
                              <span className="font-mono text-red-500">
                                ${position.liquidationPrice.toLocaleString('en-US')}
                              </span>
                            </div>
                          )}
                          {position.apr && (
                            <div className="mt-2 pt-2 border-t border-border text-xs">
                              <span className="text-muted-foreground">APR: </span>
                              <span className="font-mono text-green-500">{position.apr}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {appBalances.length === 0 && appPositions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No activity on this app</div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
