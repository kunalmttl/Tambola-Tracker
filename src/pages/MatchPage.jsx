import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '../store/useMatchStore';
import NumberCaller from '../components/NumberCaller';
import TicketGrid from '../components/TicketGrid';
import RulesPanel from '../components/RulesPanel';
import { LogOut, Ticket, Settings2, Trophy, AlertOctagon } from 'lucide-react';

export default function MatchPage() {
  const navigate = useNavigate();
  const { matchState, rules, endMatch } = useMatchStore();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const allRulesClaimed = rules.every(r => {
    if (!r.enabled) return true;
    const claims = matchState.wins.filter(w => w.ruleId === r.id).length;
    return claims >= (r.multiplier || 1);
  });
  const anyRulesEnabled = rules.some(r => r.enabled);
  const isAllComplete = allRulesClaimed && anyRulesEnabled;
  const is90ButUnclaimed = matchState.calledNumbers.length === 90 && !allRulesClaimed;

  useEffect(() => {
    if (!matchState.active) {
      navigate('/', { replace: true });
    }
  }, [matchState.active, navigate]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowExitModal(false);
        setShowRulesModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!matchState.active) return null;

  const handleExitConfirm = () => {
    endMatch();
    navigate('/');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-base">

      {/* HEADER BAR — 60px */}
      <header className="flex-shrink-0 bg-elevated border-b border-overlay h-[60px] z-10 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="font-heading font-[700] text-lg text-text-primary flex items-center gap-2">
            <Ticket className="text-amber" size={18} />
            Match Live
          </h1>
          <span className="pill-badge" aria-live="polite">
            {matchState.calledNumbers.length} called
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRulesModal(true)}
            aria-label="Manage Rules"
            className="btn btn-ghost text-xs px-3 py-2"
          >
            <Settings2 size={14} />
            <span className="hidden sm:inline">Rules</span>
          </button>
          <button
            onClick={() => setShowExitModal(true)}
            aria-label="Exit Match"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-danger text-sm font-medium hover:bg-danger/10 transition"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* BANNERS */}
      {isAllComplete && (
        <div className="bg-hit/15 text-hit text-center py-2.5 px-4 font-heading font-[700] text-sm uppercase tracking-wide flex justify-center items-center gap-2 border-b border-hit/20">
          <Trophy size={16} fill="currentColor" />
          Match Complete! All prizes claimed.
        </div>
      )}
      {is90ButUnclaimed && (
        <div className="bg-danger/10 text-danger text-center py-2.5 px-4 font-heading font-[700] text-sm uppercase tracking-wide flex justify-center items-center gap-2 border-b border-danger/20">
          <AlertOctagon size={16} />
          All 90 numbers called — unclaimed rules remain!
        </div>
      )}

      {/* TWO PANEL LAYOUT */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL — Number Caller (fixed 320px on desktop) */}
        <div className="flex-shrink-0 lg:w-[320px] lg:border-r lg:border-overlay p-5">
          <NumberCaller />
        </div>
        {/* RIGHT PANEL — Tickets (flex-1 scrollable) */}
        <div className="flex-1 min-w-0 overflow-y-auto p-4">
          <TicketGrid />
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-elevated border border-danger/20 rounded-xl p-7 max-w-[360px] w-full mx-auto animate-toast-in">
            <div className="flex flex-col items-center text-center">
              <LogOut size={32} className="text-danger mb-3" />
              <h2 className="font-heading font-[700] text-xl text-text-primary mb-2">Exit Match?</h2>
              <p className="text-text-secondary text-sm mb-6">
                All progress will be lost.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowExitModal(false)}
                  aria-label="Cancel Exit"
                  autoFocus
                  className="btn btn-ghost flex-1 h-11"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExitConfirm}
                  aria-label="Confirm Exit"
                  className="btn btn-danger flex-1 h-11 font-bold"
                >
                  Exit Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Manager Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-16 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl mx-auto animate-toast-in">
            <button
              onClick={() => setShowRulesModal(false)}
              aria-label="Close Rules Manager"
              autoFocus
              className="absolute -top-3 -right-3 z-10 w-7 h-7 rounded-full bg-surface border border-overlay text-text-secondary hover:text-text-primary hover:bg-overlay flex items-center justify-center text-sm font-bold transition"
            >
              ×
            </button>
            <RulesPanel />
          </div>
        </div>
      )}
    </div>
  );
}
