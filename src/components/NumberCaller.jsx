import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMatchStore } from '../store/useMatchStore';
import { useTicketStore } from '../store/useTicketStore';
import { checkAllRules } from '../utils/tambola';
import { triggerWinAlert } from './WinAlert';
import { CheckCircle2, Undo2 } from 'lucide-react';
import CalledNumbersBoard from './CalledNumbersBoard';

export default function NumberCaller() {
  const [numInput, setNumInput] = useState('');

  const { rules, activeTickets, matchState, callNumber, undoLastNumber, addWins, resetWins } = useMatchStore();
  const allTickets = useTicketStore(state => state.tickets);
  const ticketsObj = allTickets.filter(t => activeTickets.includes(t.id));

  const handleCall = (e) => {
    e.preventDefault();
    const val = parseInt(numInput, 10);

    if (isNaN(val) || val < 1 || val > 90) {
      toast.error('Number must be between 1 and 90!');
      setNumInput('');
      return;
    }

    if (ticketsObj.length === 0) {
      toast.error('No tickets in match');
      setNumInput('');
      return;
    }

    const success = callNumber(val);
    if (!success) {
      toast.error(`Number ${val} already called!`);
      setNumInput('');
      return;
    }

    const newCalled = [...matchState.calledNumbers, val];
    const newWins = checkAllRules(ticketsObj, newCalled, rules, matchState.wins);

    if (newWins.length > 0) {
      addWins(newWins);
      newWins.forEach(win => {
        triggerWinAlert(win);
      });
    }

    setNumInput('');
  };

  const handleUndo = () => {
    if (matchState.calledNumbers.length === 0) return;
    undoLastNumber();
    const newCalled = matchState.calledNumbers.slice(0, -1);
    const recalculatedWins = checkAllRules(ticketsObj, newCalled, rules, []);

    if (recalculatedWins.length < matchState.wins.length) {
      toast.error('Warning: A win was reversed. Please verify manually.');
    } else {
      toast.success('Last number undone.');
    }

    resetWins();
    addWins(recalculatedWins);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto gap-4">
      {/* BIG NUMBER INPUT */}
      <div className="bg-elevated rounded-lg border border-overlay p-5 space-y-4">
        <form onSubmit={handleCall} className="space-y-3">
          <input
            type="number"
            min="1"
            max="90"
            value={numInput}
            onChange={(e) => setNumInput(e.target.value)}
            aria-label="Enter number to call"
            className="w-full bg-surface border-2 border-overlay rounded-lg h-20 text-center font-mono text-[56px] font-[800] text-amber placeholder:text-text-muted focus:border-amber focus:outline-none focus:ring-4 focus:ring-amber/20 transition"
            placeholder="--"
            autoFocus
          />

          <button
            type="submit"
            aria-label="Call Number"
            className="btn btn-amber w-full h-12 text-[15px] font-bold"
          >
            <CheckCircle2 size={18} />
            Call Number
          </button>
        </form>

        <button
          onClick={handleUndo}
          disabled={matchState.calledNumbers.length === 0}
          aria-label="Undo Last Number"
          className="btn btn-danger-ghost w-full h-9 text-[13px]"
        >
          <Undo2 size={14} />
          Undo Last Number
        </button>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-overlay" />

      <CalledNumbersBoard />
    </div>
  );
}
