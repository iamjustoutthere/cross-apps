import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { ExecutionHistory } from './components/ExecutionHistory';
import { AppDetails } from './components/AppDetails';
import { AgentInterface } from './components/AgentInterface';

type View = 'dashboard' | 'workflows' | 'history' | 'apps' | 'agent';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const navigation: { id: View; name: string }[] = [
    { id: 'dashboard', name: 'DASHBOARD' },
    { id: 'workflows', name: 'WORKFLOWS' },
    { id: 'history', name: 'HISTORY' },
    { id: 'apps', name: 'APPLICATIONS' },
    { id: 'agent', name: 'AGENT API' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-black bg-black">
        <div className="flex h-16 items-center px-4 md:px-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-white bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-lg">
              π²
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold uppercase tracking-wide text-white">
                Pi² TERMINAL
              </h1>
              <p className="text-xs text-gray-300 uppercase font-medium">
                Cross-App Execution Fabric
              </p>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 border-2 border-white px-3 py-1.5 bg-emerald-600">
              <div className="w-2 h-2 bg-white animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wide text-white">
                CONNECTED
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r-4 border-black bg-gray-50 hidden lg:block">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full text-left px-4 py-3 border-2 border-black text-xs font-bold uppercase tracking-wide transition-all ${
                  currentView === item.id
                    ? 'bg-black text-white'
                    : 'bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-black bg-black">
            <div className="text-xs text-white space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">FASTSET TPS</span>
                <span className="font-mono font-bold text-emerald-400">12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ACTIVE CLAIMS</span>
                <span className="font-mono font-bold">342</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">NETWORK</span>
                <span className="font-mono font-bold">MAINNET</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t-4 border-black bg-white">
          <div className="flex overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex-1 px-3 py-3 border-r-2 last:border-r-0 border-black text-xs font-bold uppercase tracking-wide ${
                  currentView === item.id ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'workflows' && <WorkflowBuilder />}
          {currentView === 'history' && <ExecutionHistory />}
          {currentView === 'apps' && <AppDetails />}
          {currentView === 'agent' && <AgentInterface />}
        </main>
      </div>
    </div>
  );
}

export default App;
