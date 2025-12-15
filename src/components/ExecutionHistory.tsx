import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { executionReceipts, apps } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Download,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export function ExecutionHistory() {
  const [selectedReceipt, setSelectedReceipt] = useState(executionReceipts[0]);
  const [expandedClaims, setExpandedClaims] = useState(false);

  const valueDelta = selectedReceipt.postState.totalValue - selectedReceipt.preState.totalValue;
  const pnlPercent = (valueDelta / selectedReceipt.preState.totalValue) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Receipt List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {executionReceipts.map((receipt) => {
              const delta = receipt.postState.totalValue - receipt.preState.totalValue;
              return (
                <button
                  key={receipt.id}
                  onClick={() => setSelectedReceipt(receipt)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedReceipt.id === receipt.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium font-mono">
                      {receipt.id.toUpperCase()}
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(receipt.timestamp).toLocaleString()}
                  </div>
                  <div className={`text-sm font-medium mt-2 ${delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {delta >= 0 ? '+' : ''}{formatCurrency(delta)}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{receipt.claims.length} claims</span>
                    <span>•</span>
                    <span>{receipt.executionTime}s</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Receipt Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Execution Receipt</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                {selectedReceipt.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Execution Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <div>
              <div className="text-sm text-muted-foreground">Executed At</div>
              <div className="font-medium">
                {new Date(selectedReceipt.timestamp).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Execution Time</div>
              <div className="font-medium font-mono">{selectedReceipt.executionTime}s</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Gas Used</div>
              <div className="font-medium font-mono">{selectedReceipt.gasUsed} ETH</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Claims Verified</div>
              <div className="font-medium">
                {selectedReceipt.claims.filter(c => c.status === 'verified').length} / {selectedReceipt.claims.length}
              </div>
            </div>
          </div>

          {/* State Changes */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Portfolio State Change</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Pre-State */}
              <div className="p-4 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-2">Before Execution</div>
                <div className="text-2xl font-bold mb-4">
                  {formatCurrency(selectedReceipt.preState.totalValue)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Positions</span>
                    <span className="font-mono">{selectedReceipt.preState.positions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balances</span>
                    <span className="font-mono">{selectedReceipt.preState.balances.length}</span>
                  </div>
                </div>
              </div>

              {/* Post-State */}
              <div className="p-4 rounded-lg border border-primary bg-primary/5">
                <div className="text-xs text-muted-foreground mb-2">After Execution</div>
                <div className="text-2xl font-bold mb-4">
                  {formatCurrency(selectedReceipt.postState.totalValue)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Positions</span>
                    <span className="font-mono">{selectedReceipt.postState.positions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balances</span>
                    <span className="font-mono">{selectedReceipt.postState.balances.length}</span>
                  </div>
                  <div className={`flex items-center gap-1 pt-2 border-t border-border ${valueDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {valueDelta >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">
                      {valueDelta >= 0 ? '+' : ''}{formatCurrency(valueDelta)}
                    </span>
                    <span className="text-xs">
                      ({valueDelta >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claims */}
          <div>
            <button
              onClick={() => setExpandedClaims(!expandedClaims)}
              className="flex items-center justify-between w-full text-sm font-semibold mb-3 hover:text-primary transition-colors"
            >
              <span>Verified Claims ({selectedReceipt.claims.length})</span>
              {expandedClaims ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {expandedClaims && (
              <div className="space-y-2">
                {selectedReceipt.claims.map((claim) => {
                  const app = apps.find((a) => a.id === claim.app);
                  return (
                    <div
                      key={claim.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {claim.status === 'verified' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : claim.status === 'failed' ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <div>
                          <div className="text-sm font-medium capitalize">
                            {claim.type.replace(/_/g, ' ')}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{ borderColor: app?.color, color: app?.color }}
                            >
                              {app?.name}
                            </Badge>
                            {claim.proof && (
                              <span className="text-xs text-muted-foreground font-mono">
                                {claim.proof.slice(0, 12)}...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant={claim.status === 'verified' ? 'success' : 'warning'}>
                        {claim.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Verification Info */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-green-500">Fully Verified Execution</div>
                <div className="text-sm text-muted-foreground mt-1">
                  All claims have been verified and state transitions are cryptographically proven.
                  This execution receipt is machine-verifiable and can be audited independently.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
