import { Trash2, Edit, Trophy } from 'lucide-react';

export default function TicketCard({ ticket, onDelete, onEdit, matchMode = false, calledNumbers = [], ticketWins = [] }) {
  const calledSet = new Set(calledNumbers);
  const hasWins = ticketWins.length > 0;

  return (
    <div className={`flex flex-col transition-all group rounded-lg overflow-hidden
                     ${hasWins
                       ? 'border-2 border-[var(--win-gold)] shadow-[0_0_20px_var(--win-gold-border)] animate-win-pulse'
                       : 'border border-ticket-border'
                     }
                     bg-ticket-bg`}>

      {/* HEADER */}
      <div className="px-3 py-2.5 border-b border-overlay flex justify-between items-center">
        <h3 className="font-body font-semibold text-[13px] text-text-primary truncate pr-4">
          {ticket.label}
        </h3>
        <div className="flex items-center gap-2">
          {/* WIN BADGES */}
          {hasWins && matchMode && (
            <div className="flex flex-wrap gap-1">
              {ticketWins.map((win, idx) => (
                <span key={idx} className="win-badge">
                  <Trophy size={10} fill="currentColor" />
                  {win.ruleName}
                </span>
              ))}
            </div>
          )}
          {!matchMode && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button onClick={() => onEdit(ticket)} className="text-text-muted hover:text-text-primary transition-colors" title="Edit ticket" aria-label={`Edit ${ticket.label}`}>
                  <Edit size={14} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(ticket.id)} className="text-text-muted hover:text-danger transition-colors" title="Delete ticket" aria-label={`Delete ${ticket.label}`}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="p-3 grid gap-[2px] mx-auto flex-1 place-content-center">
        {ticket.grid.map((row, r) => (
          <div key={r} className="flex gap-[2px] justify-center">
            {row.map((cell, c) => {
              const isCalled = cell !== 0 && calledSet.has(cell);

              let cellClass = '';
              if (cell === 0) {
                cellClass = 'ticket-cell blank';
              } else if (matchMode && isCalled) {
                cellClass = 'ticket-cell hit';
              } else {
                cellClass = 'ticket-cell unfilled';
              }

              const sizeClass = matchMode ? 'w-7 h-7 sm:w-8 sm:h-8 text-[11px] sm:text-[13px]' : 'w-7 h-7 sm:w-8 sm:h-8 text-xs';

              return (
                <div
                  key={c}
                  aria-label={cell === 0 ? 'Empty Cell' : `Number ${cell} ${isCalled ? 'Called' : ''}`}
                  className={`${cellClass} ${sizeClass} ${isCalled && matchMode ? 'animate-cell-hit' : ''}`}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
