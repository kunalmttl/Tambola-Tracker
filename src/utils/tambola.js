/**
 * @typedef {Object} TICKET
 * @property {string} id - uuid
 * @property {string} label - e.g., "Ticket #3" or custom name
 * @property {number[][]} grid - 3 rows, 9 cols; 0 = blank, else actual number
 * // Rules: col 0 → 1-9, col 1 → 10-19, ..., col 8 → 80-90
 * // Exactly 5 non-zero values per row (15 total per ticket)
 * @property {number} createdAt - timestamp
 */

/**
 * @typedef {Object} RULE
 * @property {string} id
 * @property {string} name
 * @property {boolean} enabled
 * @property {boolean} claimed
 * @property {string|null} claimedByTicketId
 * @property {number} [multiplier] - optional, specifies how many times a rule can be claimed
 * @property {function(TICKET, number[]): boolean} checkFn - pure function
 */

/**
 * @typedef {Object} MATCH_STATE
 * @property {boolean} active
 * @property {number[]} calledNumbers - ordered list of numbers called so far
 * @property {Array<{ruleId: string, ticketId: string, ticketLabel: string, calledAt: number}>} wins
 * @property {number|null} startedAt - timestamp | null
 */

/**
 * Checks all tickets against all rules and returns an array of new wins.
 * 
 * @param {TICKET[]} tickets 
 * @param {number[]} calledNumbers 
 * @param {RULE[]} rules 
 * @param {Array<{ruleId: string, ticketId: string}>} existingWins 
 * @returns {Array<{ruleId: string, ruleName: string, ticketId: string, ticketLabel: string}>}
 */
export function checkAllRules(tickets, calledNumbers, rules, existingWins) {
  const newWins = [];
  
  // Create a fast lookup for existing wins
  const existingWinsSet = new Set(existingWins.map(w => `${w.ruleId}-${w.ticketId}`));

  for (const rule of rules) {
    if (!rule.enabled) continue;

    // Determine how many times this rule has been claimed globally across all tickets
    // This looks at both existing wins and new wins found in this iteration
    let currentClaimCount = existingWins.filter(w => w.ruleId === rule.id).length;
    
    // For normal rules, multiplier is 1. For specialized Full House, it might be > 1.
    const maxClaims = rule.multiplier || 1;

    // Check if the rule is completely exhausted
    if (rule.claimed || currentClaimCount >= maxClaims) {
      continue;
    }

    for (const ticket of tickets) {
      const winKey = `${rule.id}-${ticket.id}`;
      
      // Skip if this ticket has already claimed this specific rule
      if (existingWinsSet.has(winKey) || newWins.some(nw => nw.ruleId === rule.id && nw.ticketId === ticket.id)) {
        continue;
      }

      // Check the winning condition
      if (rule.checkFn(ticket, calledNumbers)) {
        newWins.push({
          ruleId: rule.id,
          ruleName: rule.name,
          ticketId: ticket.id,
          ticketLabel: ticket.label
        });
        
        currentClaimCount++;
        // If the rule has reached its allowed claim limit, stop checking other tickets for it
        if (currentClaimCount >= maxClaims) {
          break;
        }
      }
    }
  }

  return newWins;
}
