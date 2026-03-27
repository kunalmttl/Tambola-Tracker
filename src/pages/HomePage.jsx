import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Ticket, Check, SlidersHorizontal } from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import { useMatchStore } from '../store/useMatchStore';
import RulesPanel from '../components/RulesPanel';
import TicketCard from '../components/TicketCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { tickets, loadTickets } = useTicketStore();
  const { rules, activeTickets, setActiveTickets, startMatch } = useMatchStore();

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const enabledRulesCount = rules.filter(r => r.enabled).length;

  const toggleTicket = (id) => {
    if (activeTickets.includes(id)) {
      setActiveTickets(activeTickets.filter(t => t !== id));
    } else {
      setActiveTickets([...activeTickets, id]);
    }
  };

  const handleSelectAll = () => {
    if (activeTickets.length === tickets.length) {
      setActiveTickets([]);
    } else {
      setActiveTickets(tickets.map(t => t.id));
    }
  };

  const canStartMatch = activeTickets.length > 0 && enabledRulesCount > 0;

  const handleStartMatch = () => {
    if (!canStartMatch) return;
    startMatch();
    navigate('/match');
  };

  return (
    <div className="max-w-[900px] mx-auto p-6 space-y-6">

      {/* HEADER + START CTA */}
      <div className="card p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="font-heading font-[800] text-2xl text-text-primary mb-1">Configure Match</h1>
          <p className="text-text-secondary text-sm">
            Set your winning rules, select participating tickets, and launch the game tracker.
          </p>
        </div>
        <button
          onClick={handleStartMatch}
          disabled={!canStartMatch}
          aria-label="Start Match"
          className="btn btn-amber text-base px-8 py-3 h-[52px] font-bold whitespace-nowrap"
        >
          <Play size={18} fill="currentColor" />
          Start Match
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Rules */}
        <div>
          <RulesPanel />
        </div>

        {/* Right Column: Tickets */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-overlay">
              <h2 className="font-heading font-[700] text-lg text-text-primary flex items-center gap-2">
                <Ticket size={18} className="text-amber" />
                Select Tickets
              </h2>
              {tickets.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="pill-badge">
                    {activeTickets.length} of {tickets.length}
                  </span>
                  <button
                    onClick={handleSelectAll}
                    aria-label={activeTickets.length === tickets.length ? "Deselect All" : "Select All"}
                    className="text-xs text-amber underline hover:text-amber/80 font-medium transition"
                  >
                    {activeTickets.length === tickets.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              {tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-overlay rounded-lg min-h-[250px]">
                  <Ticket size={40} className="text-text-muted mb-4" />
                  <h3 className="font-heading font-[700] text-lg text-text-secondary mb-2">No tickets yet</h3>
                  <p className="text-text-muted text-sm mb-6 max-w-sm">Add tickets from the Tickets page to get started.</p>
                  <button
                    onClick={() => navigate('/tickets')}
                    aria-label="Manage Tickets"
                    className="btn btn-ghost text-sm"
                  >
                    Manage Tickets
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tickets.map(ticket => {
                    const isSelected = activeTickets.includes(ticket.id);
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => toggleTicket(ticket.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTicket(ticket.id); }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                        aria-label={`Toggle inclusion of ${ticket.label}`}
                        className={`relative cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] rounded-lg ring-2 focus:outline-none
                          ${isSelected ? 'ring-amber shadow-lg shadow-amber/10' : 'ring-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <TicketCard ticket={ticket} />
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all
                          ${isSelected ? 'bg-amber text-base scale-100' : 'bg-surface border border-overlay text-transparent scale-75'}`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
