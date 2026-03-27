import { Minus, Plus } from 'lucide-react';

const RULES = [
  { id: 'EARLY_5', name: 'Early Five', description: 'First 5 numbers marked on any ticket' },
  { id: 'TOP_ROW', name: 'Top Row', description: 'All 5 numbers in the top row' },
  { id: 'MIDDLE_ROW', name: 'Middle Row', description: 'All 5 numbers in the middle row' },
  { id: 'BOTTOM_ROW', name: 'Bottom Row', description: 'All 5 numbers in the bottom row' },
  { id: 'FULL_HOUSE', name: 'Full House', description: 'All 15 numbers on a ticket' },
  { id: 'CORNERS', name: 'Corners', description: 'First and last numbers of top and bottom rows' },
  { id: 'HINDUSTAN', name: 'Hindustan', description: 'Top row 1-5 and bottom row 6-9' },
  { id: 'PAKISTAN', name: 'Pakistan', description: 'Top row 6-9 and bottom row 1-5' },
  { id: 'ANY_ROW', name: 'Any Row', description: 'Any completed row (up to 10 claims)' },
  { id: 'HALF_HOUSE', name: 'Half House', description: 'Any 7 or 8 numbers marked' },
  { id: 'STAR', name: 'Star', description: 'Center number of middle row + 4 corners' },
];

export default function RulesPanel({ config, onChange }) {
  const toggleRule = (ruleId) => {
    const newConfig = { ...config };
    if (newConfig[ruleId]) {
      delete newConfig[ruleId];
    } else {
      newConfig[ruleId] = { enabled: true, multiplier: 1 };
    }
    onChange(newConfig);
  };

  const updateMultiplier = (ruleId, delta) => {
    const newConfig = { ...config };
    if (!newConfig[ruleId]) return;
    
    // Any Row can be up to 10, others up to 5
    const max = ruleId === 'ANY_ROW' ? 10 : 5;
    const current = newConfig[ruleId].multiplier || 1;
    const nextValue = Math.max(1, Math.min(max, current + delta));
    
    newConfig[ruleId] = { ...newConfig[ruleId], multiplier: nextValue };
    onChange(newConfig);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {RULES.map((rule) => {
          const isEnabled = config[rule.id]?.enabled;
          const multiplier = config[rule.id]?.multiplier || 1;
          const maxMultiplier = rule.id === 'ANY_ROW' ? 10 : 5;

          return (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isEnabled
                  ? 'bg-surface border-amber/40 shadow-glow-amber/5'
                  : 'bg-surface/40 border-overlay hover:border-overlay-hover'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => toggleRule(rule.id)}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-amber animate-pulse' : 'bg-text-muted/30'}`} />
                    <h4 className={`font-semibold transition-colors ${isEnabled ? 'text-amber' : 'text-text-secondary'}`}>
                      {rule.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${
                      isEnabled ? 'bg-amber' : 'bg-base-lighter'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                        isEnabled ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>

                  <div className={`flex items-center gap-2 bg-base px-2 py-1 rounded-lg border border-overlay transition-opacity ${isEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                      onClick={() => updateMultiplier(rule.id, -1)}
                      className="p-1 hover:text-amber transition-colors disabled:opacity-30"
                      disabled={multiplier <= 1}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-[11px] font-mono min-w-[2ch] text-center">
                      x{multiplier}
                    </span>
                    <button
                      onClick={() => updateMultiplier(rule.id, 1)}
                      className="p-1 hover:text-amber transition-colors disabled:opacity-30"
                      disabled={multiplier >= maxMultiplier}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
