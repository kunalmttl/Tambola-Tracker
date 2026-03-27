import toast from 'react-hot-toast';
import { Trophy } from 'lucide-react';

export function triggerWinAlert(win) {
  toast.custom((t) => (
    <div
      className={`min-w-[280px] max-w-md w-full rounded-lg border-[1.5px] border-[var(--win-gold)] px-5 py-4 flex items-start gap-4 animate-toast-in
        ${t.visible ? '' : 'opacity-0'}
      `}
      style={{
        background: 'linear-gradient(135deg, #1C2A1E, #1A2A1A)',
        boxShadow: '0 8px 32px rgba(255,215,0,0.25)',
      }}
    >
      <div className="shrink-0 pt-0.5">
        <Trophy size={28} className="text-[var(--win-gold)] animate-pulse" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-heading font-[700] text-base text-text-primary truncate">
          {win.ticketLabel}
        </span>
        <span className="font-body font-semibold text-sm text-[var(--win-gold)]">
          {win.ruleName}
        </span>
        <span className="text-xs text-text-secondary mt-0.5">
          🎉 Claimed!
        </span>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 text-text-muted hover:text-text-primary transition ml-auto text-sm"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  ), {
    duration: 6000,
    position: 'top-center',
  });

  // Play victory sound
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  } catch (e) { /* ignore audio errors */ }
}
