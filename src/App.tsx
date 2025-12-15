import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { ExecutionHistory } from './components/ExecutionHistory';
import { AppDetails } from './components/AppDetails';
import { AgentInterface } from './components/AgentInterface';
import {
  LayoutDashboard,
  Workflow,
  History,
  Blocks,
  Bot,
  Menu,
  X,
} from 'lucide-react';

type View = 'dashboard' | 'workflows' | 'history' | 'apps' | 'agent';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard' as View, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'workflows' as View, name: 'Workflows', icon: Workflow },
    { id: 'history' as View, name: 'History', icon: History },
    { id: 'apps' as View, name: 'Applications', icon: Blocks },
    { id: 'agent' as View, name: 'Agent API', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-accent rounded-md"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center font-bold text-primary-foreground">
              π²
            </div>
            <div>
              <h1 className="text-lg font-bold">Pi² Terminal</h1>
              <p className="text-xs text-muted-foreground">Cross-App Execution Fabric</p>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Connected</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>FastSet TPS</span>
                <span className="font-mono text-primary">12,450</span>
              </div>
              <div className="flex justify-between">
                <span>Active Claims</span>
                <span className="font-mono">342</span>
              </div>
              <div className="flex justify-between">
                <span>Network</span>
                <span className="font-mono">Mainnet</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'workflows' && <WorkflowBuilder />}
          {currentView === 'history' && <ExecutionHistory />}
          {currentView === 'apps' && <AppDetails />}
          {currentView === 'agent' && <AgentInterface />}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
