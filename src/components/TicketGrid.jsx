import { useState } from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { useTicketStore } from '../store/useTicketStore';
import TicketCard from './TicketCard';
import { LayoutGrid, GripHorizontal, Columns } from 'lucide-react';

export default function TicketGrid() {
  const { matchState, activeTickets } = useMatchStore();
  const rawTickets = useTicketStore((state) => state.tickets);

  const ticketsObj = rawTickets.filter(t => activeTickets.includes(t.id));

  const [gridSize, setGridSize] = useState('md');

  const gridClasses = {
    'sm': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'md': 'grid-cols-1 md:grid-cols-2',
    'lg': 'grid-cols-1',
  };

  const sizes = [
    { key: 'sm', icon: LayoutGrid, label: 'Small (3/row)' },
    { key: 'md', icon: Columns, label: 'Medium (2/row)' },
    { key: 'lg', icon: GripHorizontal, label: 'Large (1/row)' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* STICKY TOOLBAR */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-overlay sticky top-0 bg-base/85 backdrop-blur-sm z-10">
        <span className="text-text-secondary text-[13px] font-medium">
          {ticketsObj.length} Tickets
        </span>

        <div className="flex bg-elevated p-1 rounded-full border border-overlay">
          {sizes.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setGridSize(key)}
              aria-label={label}
              className={`p-1.5 rounded-full transition-all ${gridSize === key
                ? 'bg-surface text-amber'
                : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className={`grid gap-4 ${gridClasses[gridSize]}`}>
          {ticketsObj.map(t => {
            const ticketWins = matchState.wins.filter(w => w.ticketId === t.id);
            return (
              <TicketCard
                key={t.id}
                ticket={t}
                matchMode={true}
                calledNumbers={matchState.calledNumbers}
                ticketWins={ticketWins}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
