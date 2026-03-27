import { useState, useEffect, useMemo } from 'react';
import { X, Upload, Edit3, Save, AlertCircle } from 'lucide-react';
import { useTicketStore } from '../store/useTicketStore';
import OCRUpload from './OCRUpload';
import toast from 'react-hot-toast';

const COL_LIMITS = [
  { min: 1, max: 9 }, { min: 10, max: 19 }, { min: 20, max: 29 },
  { min: 30, max: 39 }, { min: 40, max: 49 }, { min: 50, max: 59 },
  { min: 60, max: 69 }, { min: 70, max: 79 }, { min: 80, max: 90 }
];

export default function AddTicketModal({ isOpen, onClose, initialTicket }) {
  const { tickets, addTicket, updateTicket } = useTicketStore();
  const [mode, setMode] = useState('manual');
  const [label, setLabel] = useState('');
  const [grid, setGrid] = useState(Array(3).fill().map(() => Array(9).fill('')));

  useEffect(() => {
    if (isOpen) {
      if (initialTicket) {
        setLabel(initialTicket.label);
        setGrid(initialTicket.grid.map(row => row.map(cell => cell === 0 ? '' : cell.toString())));
        setMode('manual');
      } else {
        setLabel(`Ticket #${tickets.length + 1}`);
        setGrid(Array(3).fill().map(() => Array(9).fill('')));
        setMode('manual');
      }
    }
  }, [isOpen, initialTicket, tickets.length]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCellChange = (r, c, val) => {
    if (val !== '' && !/^\d+$/.test(val)) return;
    const newGrid = [...grid];
    newGrid[r] = [...grid[r]];
    newGrid[r][c] = val;
    setGrid(newGrid);
  };

  const validateCell = (r, c, val) => {
    if (val === '') return null;
    const num = parseInt(val, 10);
    if (num < 1 || num > 90) return 'Must be 1-90';
    const limit = COL_LIMITS[c];
    if (num < limit.min || num > limit.max) return `Number ${num} cannot be in column ${c + 1} (Valid range: ${limit.min}-${limit.max})`;
    let seenCount = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === val && grid[row][col] !== '') seenCount++;
      }
    }
    if (seenCount > 1) return 'Duplicate number';
    return null;
  };

  const getRowCounts = () => grid.map(row => row.filter(val => val !== '').length);
  const rowCounts = getRowCounts();
  const globalErrors = [];

  const totalNumbers = rowCounts.reduce((a, b) => a + b, 0);
  if (totalNumbers === 0) {
    globalErrors.push('Ticket must have exactly 15 numbers');
  } else if (totalNumbers !== 15) {
    globalErrors.push(`Ticket has ${totalNumbers} numbers (needs exactly 15)`);
  }
  rowCounts.forEach((count, i) => {
    if (count !== 5) globalErrors.push(`Row ${i + 1} has ${count} numbers (needs exactly 5)`);
  });

  const isGridValid = useMemo(() => {
    if (globalErrors.length > 0) return false;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 9; c++) {
        if (validateCell(r, c, grid[r][c]) !== null) return false;
      }
    }
    return true;
  }, [grid, globalErrors.length]);

  const handleSave = async () => {
    if (!isGridValid) return;
    const finalGrid = grid.map(row => row.map(val => val === '' ? 0 : parseInt(val, 10)));
    const ticket = {
      id: initialTicket ? initialTicket.id : crypto.randomUUID(),
      label: label.trim() || `Ticket #${tickets.length + 1}`,
      grid: finalGrid,
      createdAt: initialTicket ? initialTicket.createdAt : Date.now()
    };
    try {
      if (initialTicket) {
        await updateTicket(ticket.id, ticket);
        toast.success('Ticket updated!');
      } else {
        await addTicket(ticket);
        toast.success('Ticket saved!');
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save ticket to DB');
    }
  };

  const handleOcrData = (parsedGrid) => {
    setGrid(parsedGrid.map(row => row.map(cell => cell === 0 ? '' : cell.toString())));
    setMode('manual');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-elevated border border-overlay rounded-xl w-full max-w-[600px] max-h-[90vh] flex flex-col animate-toast-in"
           style={{ padding: '28px' }}>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-[700] text-[22px] text-text-primary">
            {initialTicket ? 'Edit Ticket' : 'Add Ticket'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-text-secondary hover:text-danger transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-5">
          {/* TAB SWITCHER */}
          <div className="flex bg-surface rounded-full p-1">
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 text-[13px] font-semibold transition-all
                ${mode === 'manual' ? 'bg-amber text-[#0C0F1A]' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Edit3 size={14} /> Manual
            </button>
            <button
              onClick={() => setMode('ocr')}
              className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 text-[13px] font-semibold transition-all
                ${mode === 'ocr' ? 'bg-amber text-[#0C0F1A]' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Upload size={14} /> OCR Upload
            </button>
          </div>

          {/* LABEL */}
          <div>
            <label htmlFor="ticketLabel" className="block text-[13px] font-medium text-text-secondary mb-2">Ticket Name</label>
            <input
              id="ticketLabel"
              type="text"
              autoFocus
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="input-dark h-[42px]"
              placeholder="e.g. Kunal's Lucky Ticket"
            />
          </div>

          {mode === 'ocr' ? (
            <OCRUpload onParsedGrid={handleOcrData} />
          ) : (
            <div className="space-y-4">
              {/* GRID */}
              <div className="p-3 bg-ticket-bg rounded-lg border border-ticket-border overflow-x-auto">
                <div className="min-w-max grid gap-[3px]">
                  {grid.map((row, r) => (
                    <div key={r} className="flex gap-[3px]">
                      {row.map((val, c) => {
                        const err = validateCell(r, c, val);
                        return (
                          <div key={c} className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0">
                            <input
                              type="text"
                              maxLength={2}
                              value={val}
                              onChange={(e) => handleCellChange(r, c, e.target.value)}
                              aria-label={`Row ${r + 1} Column ${c + 1}`}
                              className={`w-full h-full text-center font-mono font-bold text-sm rounded-md border outline-none transition-all
                                ${val !== '' ? 'bg-cell-unfilled text-text-primary' : 'bg-cell-blank text-text-muted'}
                                ${err ? 'border-danger bg-danger/10' : 'border-[var(--ticket-grid)] focus:border-amber focus:ring-2 focus:ring-amber/20'}
                              `}
                              title={err || `Col ${c + 1}: ${COL_LIMITS[c].min}-${COL_LIMITS[c].max}`}
                            />
                            {err && (
                              <div className="absolute -top-1 -right-1 bg-danger text-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow group" title={err}>
                                <AlertCircle size={8} />
                                <span className="absolute hidden group-hover:block bottom-full mb-1 w-max max-w-xs bg-elevated text-text-primary text-[10px] rounded px-2 py-1 shadow-lg z-50 border border-overlay">
                                  {err}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* VALIDATION SUMMARY */}
              <div className="flex flex-wrap gap-2">
                {rowCounts.map((count, i) => (
                  <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full ${count === 5 ? 'bg-hit/10 text-hit' : 'bg-surface text-text-secondary'}`}>
                    Row {i + 1}: {count}/5 {count === 5 ? '✓' : ''}
                  </span>
                ))}
              </div>

              {globalErrors.length > 0 && (
                <div className="text-danger text-xs font-medium space-y-1 bg-danger/10 p-4 rounded-lg border-l-2 border-danger">
                  {globalErrors.map((err, i) => <div key={i} className="flex items-center gap-2"><AlertCircle size={12} /> {err}</div>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-5 mt-5 border-t border-overlay flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost text-text-secondary hover:text-danger">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isGridValid || mode === 'ocr'}
            aria-label="Save Ticket"
            className="btn btn-amber flex items-center gap-2"
          >
            <Save size={16} /> Save Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
