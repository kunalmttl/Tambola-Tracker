import { create } from 'zustand';
import { getTickets, addTicket, updateTicket as updateTicketDb, deleteTicket } from '../utils/db';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  isLoading: false,
  
  loadTickets: async () => {
    set({ isLoading: true });
    const tickets = await getTickets();
    set({ tickets, isLoading: false });
  },
  
  addTicket: async (ticket) => {
    await addTicket(ticket);
    set((state) => ({ tickets: [...state.tickets, ticket] }));
  },
  
  updateTicket: async (id, patch) => {
    const updated = await updateTicketDb(id, patch);
    set((state) => ({
      tickets: state.tickets.map(t => t.id === id ? updated : t)
    }));
  },
  
  removeTicket: async (id) => {
    await deleteTicket(id);
    set((state) => ({ tickets: state.tickets.filter(t => t.id !== id) }));
  }
}));
