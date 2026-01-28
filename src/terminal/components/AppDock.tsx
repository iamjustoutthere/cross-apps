import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';

export function AppDock() {
  const {
    apps,
    positions,
    activeAppId,
    setActiveApp,
    dockCollapsed,
    toggleDock,
  } = useTerminalStore();

  // Keyboard shortcuts for app switching (1-9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        const app = apps.find(a => a.shortcut === e.key);
        if (app) {
          e.preventDefault();
          setActiveApp(app.id);
        }
      }

      // ESC to go back to dashboard
      if (e.key === 'Escape' && activeAppId) {
        setActiveApp(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [apps, activeAppId, setActiveApp]);

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
    <div className="w-48 flex flex-col border-r border-terminal-border bg-terminal-bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border">
        <span className="text-micro text-terminal-text-muted uppercase tracking-wider">
          APPS
        </span>
        <button
          onClick={toggleDock}
          className="p-1 hover:bg-terminal-bg-tertiary"
        >
          <ChevronLeft size={14} className="text-terminal-text-muted" />
        </button>
      </div>

      {/* Dashboard Link */}
      <button
        onClick={() => setActiveApp(null)}
        className={`px-3 py-2 text-left border-b border-terminal-border ${
          activeAppId === null
            ? 'bg-terminal-bg-tertiary text-terminal-text-primary'
            : 'text-terminal-text-secondary hover:bg-terminal-bg-tertiary hover:text-terminal-text-primary'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-caption">DASHBOARD</span>
          <kbd className="px-1.5 py-0.5 bg-terminal-bg-primary border border-terminal-border text-micro">
            ESC
          </kbd>
        </div>
      </button>

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
                    <kbd className="px-1.5 py-0.5 bg-terminal-bg-primary border border-terminal-border text-micro">
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
