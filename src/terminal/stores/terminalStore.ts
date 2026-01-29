import { create } from 'zustand';
import { apps, positions, portfolio, markets, transactions, type App, type Position, type Market, type Transaction } from '../mock/terminalData';

export type PanelType = 'trading' | 'positions' | 'markets' | 'chart' | 'orderbook';
export type ModalType = 'command' | 'deposit' | 'withdraw' | 'help' | null;
export type ViewType = 'dashboard' | 'opportunities' | 'strategies' | 'risk' | 'whales' | 'alerts';

interface Panel {
  id: string;
  type: PanelType;
  appId?: string;
  marketId?: string;
}

interface TerminalState {
  // Navigation
  activeAppId: string | null;
  activeMarketId: string | null;
  activeView: ViewType;

  // Modal state
  activeModal: ModalType;
  commandInput: string;

  // Panel state
  panels: Panel[];

  // Data
  apps: App[];
  positions: Position[];
  markets: Market[];
  transactions: Transaction[];
  portfolio: typeof portfolio;

  // UI State
  dockCollapsed: boolean;
  commandHistory: string[];

  // Actions
  setActiveApp: (appId: string | null) => void;
  setActiveMarket: (marketId: string | null) => void;
  setActiveView: (view: ViewType) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setCommandInput: (input: string) => void;
  executeCommand: (command: string) => void;
  toggleDock: () => void;
  addPanel: (panel: Omit<Panel, 'id'>) => void;
  removePanel: (panelId: string) => void;
  closePosition: (positionId: string) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  // Initial Navigation
  activeAppId: null,
  activeMarketId: null,
  activeView: 'dashboard',

  // Initial Modal State
  activeModal: null,
  commandInput: '',

  // Initial Panels
  panels: [
    { id: 'panel-1', type: 'positions' },
  ],

  // Data from mock
  apps,
  positions,
  markets,
  transactions,
  portfolio: { ...portfolio },

  // UI State
  dockCollapsed: false,
  commandHistory: [],

  // Actions
  setActiveApp: (appId) => set({ activeAppId: appId, activeMarketId: null, activeView: 'dashboard' }),

  setActiveMarket: (marketId) => set({ activeMarketId: marketId }),

  setActiveView: (view) => set({ activeView: view, activeAppId: null }),

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null, commandInput: '' }),

  setCommandInput: (input) => set({ commandInput: input }),

  executeCommand: (command) => {
    const state = get();
    const trimmedCommand = command.trim().toLowerCase();

    // Add to history
    set({
      commandHistory: [...state.commandHistory, command],
      commandInput: '',
    });

    // Parse command
    if (trimmedCommand.startsWith('/positions') || trimmedCommand.startsWith('/dashboard')) {
      set({ activeModal: null, activeAppId: null, activeView: 'dashboard' });
    } else if (trimmedCommand.startsWith('/opportunities') || trimmedCommand.startsWith('/arb')) {
      set({ activeModal: null, activeAppId: null, activeView: 'opportunities' });
    } else if (trimmedCommand.startsWith('/strategies') || trimmedCommand.startsWith('/strat')) {
      set({ activeModal: null, activeAppId: null, activeView: 'strategies' });
    } else if (trimmedCommand.startsWith('/risk')) {
      set({ activeModal: null, activeAppId: null, activeView: 'risk' });
    } else if (trimmedCommand.startsWith('/whales') || trimmedCommand.startsWith('/whale')) {
      set({ activeModal: null, activeAppId: null, activeView: 'whales' });
    } else if (trimmedCommand.startsWith('/alerts')) {
      set({ activeModal: null, activeAppId: null, activeView: 'alerts' });
    } else if (trimmedCommand.startsWith('/balance')) {
      set({ activeModal: null });
    } else if (trimmedCommand.startsWith('/deposit')) {
      set({ activeModal: 'deposit' });
    } else if (trimmedCommand.startsWith('/withdraw')) {
      set({ activeModal: 'withdraw' });
    } else if (trimmedCommand.startsWith('/help')) {
      set({ activeModal: 'help' });
    } else if (trimmedCommand.startsWith('/trade')) {
      const parts = trimmedCommand.split(' ');
      if (parts.length >= 2) {
        const appName = parts[1];
        const app = state.apps.find(a =>
          a.id.toLowerCase().includes(appName) ||
          a.name.toLowerCase().includes(appName)
        );
        if (app) {
          set({ activeAppId: app.id, activeModal: null, activeView: 'dashboard' });
        }
      }
    } else if (trimmedCommand.startsWith('/close ')) {
      const positionId = trimmedCommand.replace('/close ', '').trim();
      get().closePosition(positionId);
    } else if (trimmedCommand.startsWith('/closeall')) {
      const parts = trimmedCommand.split(' ');
      const appFilter = parts[1];
      set(state => ({
        positions: appFilter
          ? state.positions.filter(p => !p.appId.toLowerCase().includes(appFilter))
          : [],
        activeModal: null,
      }));
    }

    set({ activeModal: null });
  },

  toggleDock: () => set(state => ({ dockCollapsed: !state.dockCollapsed })),

  addPanel: (panel) => set(state => ({
    panels: [...state.panels, { ...panel, id: `panel-${Date.now()}` }],
  })),

  removePanel: (panelId) => set(state => ({
    panels: state.panels.filter(p => p.id !== panelId),
  })),

  closePosition: (positionId) => {
    set(state => {
      const position = state.positions.find(p => p.id === positionId);
      if (!position) return state;

      return {
        positions: state.positions.filter(p => p.id !== positionId),
        portfolio: {
          ...state.portfolio,
          availableBalance: state.portfolio.availableBalance + position.size + position.pnl,
          totalPnl: state.portfolio.totalPnl - position.pnl,
        },
        transactions: [
          {
            id: `tx-${Date.now()}`,
            appId: position.appId,
            type: 'close' as const,
            market: position.market,
            amount: position.size + position.pnl,
            timestamp: Date.now(),
            status: 'confirmed' as const,
          },
          ...state.transactions,
        ],
      };
    });
  },

  deposit: (amount) => {
    set(state => ({
      portfolio: {
        ...state.portfolio,
        totalValue: state.portfolio.totalValue + amount,
        availableBalance: state.portfolio.availableBalance + amount,
        depositedValue: state.portfolio.depositedValue + amount,
      },
      transactions: [
        {
          id: `tx-${Date.now()}`,
          appId: 'system',
          type: 'deposit' as const,
          amount,
          timestamp: Date.now(),
          status: 'confirmed' as const,
        },
        ...state.transactions,
      ],
      activeModal: null,
    }));
  },

  withdraw: (amount) => {
    set(state => {
      if (amount > state.portfolio.availableBalance) return state;

      return {
        portfolio: {
          ...state.portfolio,
          totalValue: state.portfolio.totalValue - amount,
          availableBalance: state.portfolio.availableBalance - amount,
        },
        transactions: [
          {
            id: `tx-${Date.now()}`,
            appId: 'system',
            type: 'withdraw' as const,
            amount,
            timestamp: Date.now(),
            status: 'confirmed' as const,
          },
          ...state.transactions,
        ],
        activeModal: null,
      };
    });
  },
}));
