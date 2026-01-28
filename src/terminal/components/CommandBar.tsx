import { useEffect, useRef, useState } from 'react';
import { Search, Command } from 'lucide-react';
import { useTerminalStore } from '../stores/terminalStore';
import { commands } from '../mock/terminalData';

export function CommandBar() {
  const {
    activeModal,
    commandInput,
    setCommandInput,
    executeCommand,
    openModal,
    closeModal,
    apps,
    markets,
  } = useTerminalStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isOpen = activeModal === 'command';

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeModal();
        } else {
          openModal('command');
        }
      }

      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openModal, closeModal]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Generate suggestions based on input
  useEffect(() => {
    if (!commandInput) {
      setSuggestions([]);
      setSelectedIndex(0);
      return;
    }

    const input = commandInput.toLowerCase();
    const newSuggestions: string[] = [];

    // Command suggestions
    if (input.startsWith('/')) {
      commands.forEach(cmd => {
        if (cmd.command.toLowerCase().includes(input)) {
          newSuggestions.push(cmd.command);
        }
      });
    }

    // App suggestions
    apps.forEach(app => {
      if (app.name.toLowerCase().includes(input) || app.id.includes(input)) {
        newSuggestions.push(`/trade ${app.id}`);
      }
    });

    // Market suggestions
    markets.forEach(market => {
      if (market.name.toLowerCase().includes(input)) {
        newSuggestions.push(`/trade ${market.appId} ${market.name}`);
      }
    });

    setSuggestions(newSuggestions.slice(0, 8));
    setSelectedIndex(0);
  }, [commandInput, apps, markets]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && selectedIndex >= 0) {
        executeCommand(suggestions[selectedIndex]);
      } else if (commandInput) {
        executeCommand(commandInput);
      }
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setCommandInput(suggestions[selectedIndex]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => openModal('command')}
        className="flex items-center gap-2 px-3 py-2 border border-terminal-border bg-terminal-bg-secondary text-terminal-text-secondary text-caption hover:text-terminal-text-primary hover:border-terminal-text-muted"
      >
        <Search size={14} />
        <span>SEARCH OR COMMAND</span>
        <div className="flex items-center gap-1 ml-4">
          <kbd className="px-1.5 py-0.5 bg-terminal-bg-tertiary border border-terminal-border text-micro">
            <Command size={10} />
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-terminal-bg-tertiary border border-terminal-border text-micro">
            K
          </kbd>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl border border-terminal-border bg-terminal-bg-secondary">
        {/* Input */}
        <div className="flex items-center border-b border-terminal-border px-4">
          <Search size={16} className="text-terminal-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent px-3 py-4 text-body text-terminal-text-primary placeholder:text-terminal-text-muted outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="px-2 py-1 bg-terminal-bg-tertiary border border-terminal-border text-micro text-terminal-text-muted">
            ESC
          </kbd>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="border-b border-terminal-border">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => executeCommand(suggestion)}
                className={`w-full px-4 py-2 text-left text-body ${
                  index === selectedIndex
                    ? 'bg-terminal-accent text-white'
                    : 'text-terminal-text-primary hover:bg-terminal-bg-tertiary'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Command Reference */}
        <div className="p-4">
          <div className="text-micro text-terminal-text-muted uppercase mb-2">
            QUICK COMMANDS
          </div>
          <div className="grid grid-cols-2 gap-2">
            {commands.slice(0, 6).map(cmd => (
              <button
                key={cmd.command}
                onClick={() => setCommandInput(cmd.command.split(' ')[0])}
                className="flex items-center justify-between px-3 py-2 text-caption text-terminal-text-secondary hover:bg-terminal-bg-tertiary border border-terminal-border"
              >
                <span>{cmd.command.split(' ')[0]}</span>
                <span className="text-terminal-text-muted">{cmd.description.slice(0, 20)}...</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
