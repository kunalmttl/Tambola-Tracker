import { useState, useEffect } from 'react';
import { PlusCircle, Ticket } from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import TicketCard from '../components/TicketCard';
import AddTicketModal from '../components/AddTicketModal';

export default function TicketsPage() {
  const { tickets, loadTickets, removeTicket } = useTicketStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleOpenModal = (ticket = null) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-[800] text-2xl sm:text-[28px] text-text-primary">My Tickets</h1>
        <button
          onClick={() => handleOpenModal()}
          aria-label="Add New Ticket"
          className="btn btn-amber flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Add Ticket</span>
        </button>
      </div>

      {/* FAB for mobile */}
      <button
        onClick={() => handleOpenModal()}
        aria-label="Add New Ticket"
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-amber text-base w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-amber/20"
      >
        <PlusCircle size={24} />
      </button>

      {tickets.length === 0 ? (
        <div className="card flex flex-col items-center justify-center text-center p-12 lg:p-20">
          <div className="mb-4 p-5 bg-amber/10 text-amber rounded-full">
            <Ticket size={44} strokeWidth={1.5} />
          </div>
          <h3 className="font-heading font-[700] text-xl text-text-secondary mb-2">No tickets yet</h3>
          <p className="text-text-muted max-w-sm mb-6 text-sm">
            Add tickets manually or upload a photo to get started.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-amber flex items-center gap-2"
          >
            <PlusCircle size={16} /> Add Your First Ticket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onDelete={removeTicket}
              onEdit={handleOpenModal}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialTicket={editingTicket}
        />
      )}
    </div>
  );
}
