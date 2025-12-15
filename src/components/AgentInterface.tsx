import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Bot, Send, Copy, Terminal } from 'lucide-react';

interface AgentLog {
  id: string;
  timestamp: number;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export function AgentInterface() {
  const agentLogs: AgentLog[] = [
    {
      id: '1',
      timestamp: Date.now() - 60000,
      type: 'info',
      message: 'Agent initialized and ready to receive commands',
    },
    {
      id: '2',
      timestamp: Date.now() - 45000,
      type: 'success',
      message: 'Connected to FastSet execution fabric',
    },
    {
      id: '3',
      timestamp: Date.now() - 30000,
      type: 'info',
      message: 'Monitoring portfolio state across 4 applications',
    },
  ];

  const examplePayload = {
    intent: 'basis_trade',
    parameters: {
      asset: 'ETH',
      size_percent: 20,
      max_leverage: 3,
      target_apps: ['hyperliquid', 'lighter'],
      constraints: {
        max_slippage: 0.005,
        min_collateral_ratio: 1.5,
      },
    },
  };

  const exampleResponse = {
    workflow_id: 'wf-agent-12345',
    status: 'planned',
    estimated_steps: 6,
    estimated_gas: 0.032,
    execution_plan: [
      {
        step: 1,
        action: 'verify_collateral',
        app: 'morpho',
        details: 'Verify available collateral for leverage',
      },
      {
        step: 2,
        action: 'calculate_optimal_split',
        app: 'internal',
        details: 'Calculate optimal capital split based on liquidity depth',
      },
      {
        step: 3,
        action: 'route_capital',
        app: 'hyperliquid',
        details: 'Route 60% of capital to Hyperliquid',
      },
      {
        step: 4,
        action: 'route_capital',
        app: 'lighter',
        details: 'Route 40% of capital to Lighter',
      },
      {
        step: 5,
        action: 'open_position',
        app: 'hyperliquid',
        details: 'Long ETH-PERP @ 3x leverage',
      },
      {
        step: 6,
        action: 'open_position',
        app: 'lighter',
        details: 'Long ETH-PERP @ 3x leverage',
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agent Console */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle>Agent Console</CardTitle>
              <Badge variant="success">Online</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Terminal Output */}
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto">
            {agentLogs.map((log) => (
              <div key={log.id} className="mb-2">
                <span className="text-muted-foreground">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>{' '}
                <span
                  className={
                    log.type === 'error'
                      ? 'text-red-500'
                      : log.type === 'success'
                      ? 'text-green-500'
                      : log.type === 'warning'
                      ? 'text-yellow-500'
                      : 'text-foreground'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-4">
              <Terminal className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-primary">Awaiting command...</span>
            </div>
          </div>

          {/* Command Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter agent command or send JSON payload..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Endpoint</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded bg-secondary text-xs font-mono">
                POST /api/agent/execute
              </code>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Authentication</div>
            <code className="block px-3 py-2 rounded bg-secondary text-xs font-mono">
              Bearer &lt;API_KEY&gt;
            </code>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Example Payload</div>
            <div className="relative">
              <pre className="px-3 py-2 rounded bg-black/50 text-xs font-mono overflow-x-auto">
                {JSON.stringify(examplePayload, null, 2)}
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Example Response</div>
            <div className="relative">
              <pre className="px-3 py-2 rounded bg-black/50 text-xs font-mono overflow-x-auto max-h-64">
                {JSON.stringify(exampleResponse, null, 2)}
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full">
              View Full Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
