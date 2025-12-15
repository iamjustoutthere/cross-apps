import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { workflows, apps } from '../lib/mockData';
import {
  Plus,
  Play,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Save,
} from 'lucide-react';

export function WorkflowBuilder() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'executing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'error' | 'secondary' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'executing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflows</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workflows.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedWorkflow.id === workflow.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium">{workflow.name}</div>
                  <Badge variant={getStatusVariant(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {workflow.description}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{workflow.steps.length} steps</span>
                  {workflow.estimatedGas && (
                    <>
                      <span>•</span>
                      <span>~{workflow.estimatedGas} ETH gas</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedWorkflow.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedWorkflow.description}
              </p>
            </div>
            <div className="flex gap-2">
              {selectedWorkflow.status === 'draft' && (
                <>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button size="sm">
                    <Play className="h-4 w-4" />
                    Execute
                  </Button>
                </>
              )}
              {selectedWorkflow.status === 'completed' && (
                <Badge variant="success" className="h-8">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Workflow Steps */}
          <div className="space-y-1">
            {selectedWorkflow.steps.map((step, index) => {
              const app = apps.find((a) => a.id === step.app);
              return (
                <div
                  key={step.id}
                  className="relative flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
                >
                  {/* Step Number & Connector */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary border border-border font-mono text-sm">
                      {index + 1}
                    </div>
                    {index < selectedWorkflow.steps.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-2" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {step.action}
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                            style={{ borderColor: app?.color, color: app?.color }}
                          >
                            {app?.name}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {step.details}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(step.status)}
                        {selectedWorkflow.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {step.timestamp && (
                      <div className="text-xs text-muted-foreground">
                        Completed {new Date(step.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Step Button */}
          {selectedWorkflow.status === 'draft' && (
            <Button variant="outline" className="w-full mt-4">
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          )}

          {/* Workflow Summary */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium capitalize">{selectedWorkflow.status}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Created</div>
                <div className="font-medium">
                  {new Date(selectedWorkflow.createdAt).toLocaleDateString()}
                </div>
              </div>
              {selectedWorkflow.completedAt && (
                <div>
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-medium">
                    {new Date(selectedWorkflow.completedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
              {selectedWorkflow.estimatedGas && (
                <div>
                  <div className="text-muted-foreground">Estimated Gas</div>
                  <div className="font-medium font-mono">{selectedWorkflow.estimatedGas} ETH</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
