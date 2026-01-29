import { useState } from 'react';
import {
  Bell,
  X,
  Zap,
  AlertTriangle,
  Anchor,
  TrendingUp,
  DollarSign,
  Target,
  ChevronRight,
  Check,
} from 'lucide-react';
import { smartAlerts, type SmartAlert } from '../mock/opportunities';

interface SmartAlertsProps {
  onClose?: () => void;
  compact?: boolean;
}

export function SmartAlerts({ onClose, compact = false }: SmartAlertsProps) {
  const [alerts, setAlerts] = useState(smartAlerts);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredAlerts = filter === 'unread'
    ? alerts.filter(a => !a.seen)
    : alerts;

  const unreadCount = alerts.filter(a => !a.seen).length;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const getAlertIcon = (type: SmartAlert['type']) => {
    switch (type) {
      case 'opportunity': return <Target size={14} className="text-terminal-positive" />;
      case 'risk': return <AlertTriangle size={14} className="text-terminal-warning" />;
      case 'whale': return <Anchor size={14} className="text-terminal-accent" />;
      case 'liquidation': return <AlertTriangle size={14} className="text-terminal-negative" />;
      case 'funding': return <TrendingUp size={14} className="text-terminal-positive" />;
      case 'price': return <DollarSign size={14} className="text-terminal-text-primary" />;
      default: return <Bell size={14} />;
    }
  };

  const getPriorityColor = (priority: SmartAlert['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-terminal-negative';
      case 'medium': return 'border-l-terminal-warning';
      case 'low': return 'border-l-terminal-text-muted';
      default: return 'border-l-terminal-border';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, seen: true } : a
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, seen: true })));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleAction = (alert: SmartAlert) => {
    markAsRead(alert.id);
    // In production, this would navigate to the relevant section or open a modal
    alert.action && window.alert(`Action: ${alert.action}\n\nThis would open the relevant trading interface.`);
  };

  if (compact) {
    return (
      <div className="w-80 border border-terminal-border bg-terminal-bg-secondary">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-terminal-accent" />
            <span className="text-caption font-bold text-terminal-text-primary">ALERTS</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 bg-terminal-negative text-white text-micro">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-micro text-terminal-text-muted hover:text-terminal-text-primary"
            >
              MARK ALL READ
            </button>
            {onClose && (
              <button onClick={onClose} className="p-1 hover:bg-terminal-bg-tertiary">
                <X size={12} className="text-terminal-text-muted" />
              </button>
            )}
          </div>
        </div>

        {/* Alerts List */}
        <div className="max-h-96 overflow-auto divide-y divide-terminal-border">
          {filteredAlerts.slice(0, 5).map(alert => (
            <div
              key={alert.id}
              className={`p-3 hover:bg-terminal-bg-tertiary border-l-2 ${getPriorityColor(alert.priority)} ${
                !alert.seen ? 'bg-terminal-bg-tertiary/50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-caption text-terminal-text-primary font-bold truncate">
                    {alert.title}
                  </div>
                  <div className="text-micro text-terminal-text-muted line-clamp-2">
                    {alert.description}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-micro text-terminal-text-muted">
                      {formatTime(alert.timestamp)}
                    </span>
                    {alert.actionable && (
                      <button
                        onClick={() => handleAction(alert)}
                        className="flex items-center gap-1 text-micro text-terminal-accent hover:underline"
                      >
                        {alert.action}
                        <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 text-terminal-text-muted hover:text-terminal-text-primary"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length > 5 && (
          <div className="px-3 py-2 border-t border-terminal-border text-center">
            <button className="text-micro text-terminal-accent hover:underline">
              VIEW ALL {filteredAlerts.length} ALERTS
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-terminal-bg-primary">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-terminal-accent" />
            <div>
              <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
                SMART ALERTS
              </h2>
              <p className="text-micro text-terminal-text-muted">
                {unreadCount} UNREAD • {alerts.length} TOTAL
              </p>
            </div>
          </div>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-3 py-1.5 border border-terminal-border text-micro text-terminal-text-muted hover:text-terminal-text-primary"
          >
            <Check size={12} />
            MARK ALL READ
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex border-b border-terminal-border">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 text-micro ${
            filter === 'all'
              ? 'bg-terminal-bg-tertiary text-terminal-text-primary'
              : 'text-terminal-text-muted hover:text-terminal-text-primary'
          }`}
        >
          ALL ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-2 text-micro ${
            filter === 'unread'
              ? 'bg-terminal-bg-tertiary text-terminal-text-primary'
              : 'text-terminal-text-muted hover:text-terminal-text-primary'
          }`}
        >
          UNREAD ({unreadCount})
        </button>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-auto divide-y divide-terminal-border">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 hover:bg-terminal-bg-secondary border-l-4 ${getPriorityColor(alert.priority)} ${
              !alert.seen ? 'bg-terminal-bg-tertiary/30' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-terminal-bg-tertiary border border-terminal-border">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-caption font-bold text-terminal-text-primary">
                      {alert.title}
                    </span>
                    {!alert.seen && (
                      <span className="w-2 h-2 bg-terminal-accent" />
                    )}
                    <span className={`px-1.5 py-0.5 text-micro uppercase ${
                      alert.priority === 'high'
                        ? 'bg-terminal-negative/20 text-terminal-negative'
                        : alert.priority === 'medium'
                          ? 'bg-terminal-warning/20 text-terminal-warning'
                          : 'bg-terminal-bg-tertiary text-terminal-text-muted'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-caption text-terminal-text-secondary mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-micro text-terminal-text-muted">
                      {formatTime(alert.timestamp)}
                    </span>
                    {alert.expiresAt && (
                      <span className="text-micro text-terminal-warning">
                        Expires in {Math.floor((alert.expiresAt - Date.now()) / 60000)}m
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {alert.actionable && (
                  <button
                    onClick={() => handleAction(alert)}
                    className="flex items-center gap-2 px-3 py-2 bg-terminal-accent text-white text-micro font-bold hover:opacity-90"
                  >
                    <Zap size={12} />
                    {alert.action}
                  </button>
                )}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-terminal-border text-terminal-text-muted text-micro hover:text-terminal-text-primary"
                >
                  <X size={12} />
                  DISMISS
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="flex items-center justify-center h-48 text-terminal-text-muted">
            <span className="text-caption">NO ALERTS</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Alert Badge for Status Bar
export function AlertBadge({ onClick }: { onClick: () => void }) {
  const unreadCount = smartAlerts.filter(a => !a.seen).length;
  const hasHighPriority = smartAlerts.some(a => a.priority === 'high' && !a.seen);

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 border ${
        hasHighPriority
          ? 'border-terminal-negative text-terminal-negative animate-pulse'
          : unreadCount > 0
            ? 'border-terminal-accent text-terminal-accent'
            : 'border-terminal-border text-terminal-text-muted hover:text-terminal-text-primary'
      }`}
    >
      <Bell size={14} />
      <span className="text-micro">{unreadCount}</span>
    </button>
  );
}
