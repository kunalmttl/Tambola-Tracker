import { create } from 'zustand';
import { RULES } from '../constants/rules';
import { saveMatchConfig, getMatchConfig } from '../utils/db';

export const useMatchStore = create((set, get) => ({
  rules: RULES.map(r => ({ 
    ...r, 
    enabled: r.defaultEnabled,
    multiplier: 1 // Default to 1; FULL_HOUSE spinner modifies this
  })),
  activeTickets: [],
  matchState: {
    active: false,
    calledNumbers: [],
    wins: [],
    startedAt: null
  },

  loadMatchConfig: async () => {
    const config = await getMatchConfig();
    if (config && config.rules) {
      set({ rules: config.rules });
    }
  },

  toggleRule: (id) => {
    set((state) => ({
      rules: state.rules.map(r => 
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    }));
    saveMatchConfig({ rules: get().rules });
  },

  setRuleMultiplier: (id, multiplier) => {
    set((state) => ({
      rules: state.rules.map(r => 
        r.id === id ? { ...r, multiplier: Math.max(1, Math.min(5, multiplier)) } : r
      )
    }));
    saveMatchConfig({ rules: get().rules });
  },

  setActiveTickets: (ticketIds) => set({ activeTickets: ticketIds }),

  startMatch: () => set({
    matchState: {
      active: true,
      calledNumbers: [],
      wins: [],
      startedAt: Date.now()
    }
  }),

  // Phase 5 methods
  callNumber: (num) => {
    const state = get();
    if (state.matchState.calledNumbers.includes(num)) {
      return false; // Already called
    }
    set({
      matchState: {
        ...state.matchState,
        calledNumbers: [...state.matchState.calledNumbers, num]
      }
    });
    return true;
  },

  addWins: (newWins) => set((state) => ({
    matchState: {
      ...state.matchState,
      wins: [...state.matchState.wins, ...newWins]
    }
  })),

  undoLastNumber: () => set((state) => {
    const newCalled = [...state.matchState.calledNumbers];
    newCalled.pop();
    return {
      matchState: {
        ...state.matchState,
        calledNumbers: newCalled
      }
    };
  }),

  resetWins: () => set((state) => ({
    matchState: {
      ...state.matchState,
      wins: []
    }
  })),

  endMatch: () => set((state) => ({
    matchState: { ...state.matchState, active: false, calledNumbers: [], wins: [], startedAt: null },
    activeTickets: [] // clear selected tickets as well
  }))
}));
