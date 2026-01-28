import { X, Command } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import { commands } from '../mock/terminalData';

export function HelpModal() {
  const { activeModal, closeModal } = useTerminalStore();

  if (activeModal !== 'help') return null;

  const shortcuts = [
    { keys: ['Cmd/Ctrl', 'K'], description: 'Open command palette' },
    { keys: ['1-8'], description: 'Switch to app by number' },
    { keys: ['Esc'], description: 'Return to dashboard / close modal' },
    { keys: ['Cmd/Ctrl', '\\'], description: 'Split panel' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl border border-terminal-border bg-terminal-bg-secondary max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border">
          <div className="flex items-center gap-2">
            <Command size={16} className="text-terminal-accent" />
            <h2 className="text-title font-bold text-terminal-text-primary font-display uppercase">
              COMMAND REFERENCE
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-terminal-bg-tertiary"
          >
            <X size={16} className="text-terminal-text-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Keyboard Shortcuts */}
          <div className="p-4 border-b border-terminal-border">
            <h3 className="text-caption font-bold text-terminal-text-primary uppercase mb-3">
              KEYBOARD SHORTCUTS
            </h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, j) => (
                      <span key={j} className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-terminal-bg-tertiary border border-terminal-border text-micro">
                          {key}
                        </kbd>
                        {j < shortcut.keys.length - 1 && (
                          <span className="text-terminal-text-muted">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="text-caption text-terminal-text-secondary">
                    {shortcut.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Commands */}
          <div className="p-4">
            <h3 className="text-caption font-bold text-terminal-text-primary uppercase mb-3">
              COMMANDS
            </h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="py-2 text-left text-micro text-terminal-text-muted uppercase">
                    COMMAND
                  </th>
                  <th className="py-2 text-left text-micro text-terminal-text-muted uppercase">
                    DESCRIPTION
                  </th>
                  <th className="py-2 text-left text-micro text-terminal-text-muted uppercase">
                    EXAMPLE
                  </th>
                </tr>
              </thead>
              <tbody>
                {commands.map((cmd, i) => (
                  <tr key={i} className="border-b border-terminal-border">
                    <td className="py-3">
                      <code className="text-caption text-terminal-accent">
                        {cmd.command}
                      </code>
                    </td>
                    <td className="py-3 text-caption text-terminal-text-secondary">
                      {cmd.description}
                    </td>
                    <td className="py-3">
                      <code className="text-micro text-terminal-text-muted">
                        {cmd.example}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-terminal-border bg-terminal-bg-tertiary">
          <div className="text-micro text-terminal-text-muted text-center">
            Press <kbd className="px-1.5 py-0.5 bg-terminal-bg-secondary border border-terminal-border">ESC</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}
