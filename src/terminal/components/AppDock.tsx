import { useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Play,
  Shield,
  Anchor,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import { useTerminalStore, type ViewType } from '../stores/terminalStore';

const tools: { id: ViewType; label: string; icon: React.ReactNode; shortcut?: string }[] = [
  { id: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard size={14} />, shortcut: 'ESC' },
  { id: 'opportunities', label: 'OPPORTUNITIES', icon: <Target size={14} />, shortcut: 'O' },
  { id: 'strategies', label: 'STRATEGIES', icon: <Play size={14} />, shortcut: 'S' },
  { id: 'risk', label: 'RISK', icon: <Shield size={14} />, shortcut: 'R' },
  { id: 'whales', label: 'WHALES', icon: <Anchor size={14} />, shortcut: 'W' },
  { id: 'alerts', label: 'ALERTS', icon: <Bell size={14} />, shortcut: 'A' },
];

export function AppDock() {
  const {
    apps,
    positions,
    activeAppId,
    activeView,
    setActiveApp,
    setActiveView,
    dockCollapsed,
    toggleDock,
  } = useTerminalStore();

  // Keyboard shortcuts for app switching (1-9) and tools (O, S, R, W, A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Number shortcuts for apps
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        const app = apps.find(a => a.shortcut === e.key);
        if (app) {
          e.preventDefault();
          setActiveApp(app.id);
        }
      }

      // ESC to go back to dashboard
      if (e.key === 'Escape') {
        setActiveApp(null);
        setActiveView('dashboard');
      }

      // Tool shortcuts
      if (key === 'o' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveView('opportunities');
      } else if (key === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveView('strategies');
      } else if (key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveView('risk');
      } else if (key === 'w' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveView('whales');
      } else if (key === 'a' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveView('alerts');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [apps, activeAppId, setActiveApp, setActiveView]);

  // Group apps by category
  const categories = {
    prediction: apps.filter(a => a.category === 'prediction'),
    perpetuals: apps.filter(a => a.category === 'perpetuals'),
    yield: apps.filter(a => a.category === 'yield'),
  };

  // Check if app has positions
  const hasPositions = (appId: string) =>
    positions.some(p => p.appId === appId);

  if (dockCollapsed) {
    return (
      <div className="flex flex-col border-r border-terminal-border bg-terminal-bg-secondary">
        <button
          onClick={toggleDock}
          className="p-2 border-b border-terminal-border hover:bg-terminal-bg-tertiary"
        >
          <ChevronRight size={16} className="text-terminal-text-muted" />
        </button>

        {/* Collapsed tools */}
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveView(tool.id)}
            className={`p-3 border-b border-terminal-border ${
              activeView === tool.id && !activeAppId
                ? 'bg-terminal-accent text-white'
                : 'text-terminal-text-secondary hover:bg-terminal-bg-tertiary hover:text-terminal-text-primary'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}

        <div className="border-b border-terminal-border my-1" />

        {/* Collapsed app icons */}
        {apps.map(app => (
          <button
            key={app.id}
            onClick={() => setActiveApp(app.id)}
            className={`relative p-3 border-b border-terminal-border ${
              activeAppId === app.id
                ? 'bg-terminal-accent text-white'
                : 'text-terminal-text-secondary hover:bg-terminal-bg-tertiary hover:text-terminal-text-primary'
            }`}
            title={app.name}
          >
            <span className="text-caption font-bold">{app.icon}</span>
            {hasPositions(app.id) && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-terminal-positive" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-52 flex flex-col border-r border-terminal-border bg-terminal-bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border">
        <span className="text-micro text-terminal-text-muted uppercase tracking-wider">
          TERMINAL
        </span>
        <button
          onClick={toggleDock}
          className="p-1 hover:bg-terminal-bg-tertiary"
        >
          <ChevronLeft size={14} className="text-terminal-text-muted" />
        </button>
      </div>

      {/* Tools Section */}
      <div className="border-b border-terminal-border">
        <div className="px-3 py-2 bg-terminal-bg-primary">
          <span className="text-micro text-terminal-text-muted uppercase tracking-wider">
            TOOLS
          </span>
        </div>
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveView(tool.id)}
            className={`w-full px-3 py-2 text-left border-b border-terminal-border ${
              activeView === tool.id && !activeAppId
                ? 'bg-terminal-accent text-white'
                : 'text-terminal-text-secondary hover:bg-terminal-bg-tertiary hover:text-terminal-text-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tool.icon}
                <span className="text-caption">{tool.label}</span>
              </div>
              {tool.shortcut && (
                <kbd className={`px-1.5 py-0.5 border text-micro ${
                  activeView === tool.id && !activeAppId
                    ? 'bg-white/20 border-white/30'
                    : 'bg-terminal-bg-primary border-terminal-border'
                }`}>
                  {tool.shortcut}
                </kbd>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* App Categories */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(categories).map(([category, categoryApps]) => (
          <div key={category}>
            <div className="px-3 py-2 border-b border-terminal-border bg-terminal-bg-primary">
              <span className="text-micro text-terminal-text-muted uppercase tracking-wider">
                {category}
              </span>
            </div>

            {categoryApps.map(app => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className={`w-full px-3 py-2 text-left border-b border-terminal-border ${
                  activeAppId === app.id
                    ? 'bg-terminal-accent text-white'
                    : 'text-terminal-text-secondary hover:bg-terminal-bg-tertiary hover:text-terminal-text-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-bold w-6">{app.icon}</span>
                    <span className="text-caption">{app.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasPositions(app.id) && (
                      <div className="w-1.5 h-1.5 bg-terminal-positive" />
                    )}
                    <kbd className={`px-1.5 py-0.5 border text-micro ${
                      activeAppId === app.id
                        ? 'bg-white/20 border-white/30'
                        : 'bg-terminal-bg-primary border-terminal-border'
                    }`}>
                      {app.shortcut}
                    </kbd>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
