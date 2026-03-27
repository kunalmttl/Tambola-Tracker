import { Minus, Plus, SlidersHorizontal, Zap, Star, AlignJustify, LayoutGrid } from 'lucide-react';
import { useMatchStore } from '../store/useMatchStore';

const ruleIcons = {
  'EARLY_5': Zap,
  'TOP_ROW': AlignJustify,
  'MIDDLE_ROW': AlignJustify,
  'BOTTOM_ROW': AlignJustify,
  'ANY_ROW': AlignJustify,
  'CORNERS': LayoutGrid,
  'FULL_HOUSE': Star,
};

export default function RulesPanel() {
  const { rules, toggleRule, setRuleMultiplier } = useMatchStore();

  return (
    <div className="card">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-overlay">
        <SlidersHorizontal size={18} className="text-amber" />
        <h2 className="font-heading font-[700] text-lg text-text-primary">Configure Rules</h2>
      </div>

      <div className="p-4 sm:p-5 space-y-2">
        {rules.map((rule) => {
          const nameParts = rule.name.split(' / ');
          const mainName = nameParts[0];
          const aliases = nameParts.slice(1).join(', ');
          const IconComp = ruleIcons[rule.id] || Star;

          return (
            <div
              key={rule.id}
              role="checkbox"
              aria-checked={rule.enabled}
              aria-label={`Toggle rule ${mainName}`}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border transition-all cursor-pointer select-none
                ${rule.enabled
                  ? 'bg-amber/5 border-amber/20'
                  : 'bg-transparent border-overlay hover:border-text-muted/30'
                }`}
              onClick={(e) => {
                if (e.target.closest('button.spinner')) return;
                toggleRule(rule.id);
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <IconComp size={16} className={`mt-0.5 shrink-0 ${rule.enabled ? 'text-amber' : 'text-text-muted'}`} />

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-body font-semibold text-sm text-text-primary">
                      {mainName}
                    </span>
                    {aliases && (
                      <span className="alias-chip">{aliases}</span>
                    )}
                  </div>
                  <span className="text-xs text-text-secondary mt-0.5">
                    {rule.description}
                  </span>
                </div>
              </div>

              {/* TOGGLE SWITCH */}
              <div
                className={`toggle-switch ${rule.enabled ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleRule(rule.id); }}
              />

              {/* MULTIPLIER SPINNER */}
              {['FULL_HOUSE', 'TOP_ROW', 'MIDDLE_ROW', 'BOTTOM_ROW', 'ANY_ROW'].includes(rule.id) && rule.enabled && (
                <div className="flex flex-col sm:items-end gap-1.5 ml-7 sm:ml-0" onClick={e => e.stopPropagation()}>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Claims</span>
                  <div className="flex items-center gap-1 bg-surface border border-overlay rounded-md p-0.5">
                    <button
                      className="spinner p-1 hover:bg-overlay rounded transition text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-amber"
                      aria-label="Decrease claims count"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRuleMultiplier(rule.id, Math.max(1, rule.multiplier - 1));
                      }}
                      disabled={rule.multiplier <= 1}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center font-mono text-sm font-bold text-amber" aria-live="polite">
                      {rule.multiplier || 1}
                    </span>
                    <button
                      className="spinner p-1 hover:bg-overlay rounded transition text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-amber"
                      aria-label="Increase claims count"
                      onClick={(e) => {
                        e.stopPropagation();
                        const maxClaims = rule.id === 'ANY_ROW' ? 10 : 5;
                        setRuleMultiplier(rule.id, Math.min(maxClaims, rule.multiplier + 1));
                      }}
                      disabled={rule.multiplier >= (rule.id === 'ANY_ROW' ? 10 : 5)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
