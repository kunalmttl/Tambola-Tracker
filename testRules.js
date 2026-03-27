import { RULES } from './src/constants/rules.js';

const TICKET = {
  id: 'test-1',
  grid: [
    [5, 0, 23, 0, 45, 0, 67, 0, 89],
    [0, 12, 0, 34, 0, 56, 0, 78, 90],
    [8, 15, 29, 0, 0, 59, 68, 0, 0]
  ]
};

// EARLY_5 should need 5 numbers
// TOP_ROW needs 5, 23, 45, 67, 89
// MIDDLE_ROW needs 12, 34, 56, 78, 90
// BOTTOM_ROW needs 8, 15, 29, 59, 68
// CORNERS needs 5, 89, 8, 68
// FULL_HOUSE needs all 15

function runTests() {
  let passed = 0;
  let total = 0;
  
  const assert = (condition, msg) => {
    total++;
    if (condition) {
      console.log(`✅ ${msg}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${msg}`);
    }
  };

  const calledNumbersEarly5 = [5, 23, 12, 8, 90];
  const early5Rule = RULES.find(r => r.id === 'EARLY_5');
  assert(early5Rule.checkFn(TICKET, calledNumbersEarly5) === true, 'EARLY_5 logic triggers correctly');

  const calledTopRow = [5, 23, 45, 67, 89, 1, 2, 3];
  const topRowRule = RULES.find(r => r.id === 'TOP_ROW');
  assert(topRowRule.checkFn(TICKET, calledTopRow) === true, 'TOP_ROW logic triggers correctly');

  const calledMiddleRow = [12, 34, 56, 78, 90, 4, 5];
  const middleRowRule = RULES.find(r => r.id === 'MIDDLE_ROW');
  assert(middleRowRule.checkFn(TICKET, calledMiddleRow) === true, 'MIDDLE_ROW logic triggers correctly');

  const calledBottomRow = [8, 15, 29, 59, 68];
  const bottomRowRule = RULES.find(r => r.id === 'BOTTOM_ROW');
  assert(bottomRowRule.checkFn(TICKET, calledBottomRow) === true, 'BOTTOM_ROW logic triggers correctly');

  const calledCorners = [5, 89, 8, 68, 1, 2];
  const cornersRule = RULES.find(r => r.id === 'CORNERS');
  assert(cornersRule.checkFn(TICKET, calledCorners) === true, 'CORNERS logic triggers correctly');

  const calledFullHouse = [5, 23, 45, 67, 89, 12, 34, 56, 78, 90, 8, 15, 29, 59, 68];
  const fullHouseRule = RULES.find(r => r.id === 'FULL_HOUSE');
  assert(fullHouseRule.checkFn(TICKET, calledFullHouse) === true, 'FULL_HOUSE logic triggers correctly');

  // Hindustan - 1 to 49 marked. 
  // Ticket has 1..49: 5, 23, 45, 12, 34, 8, 15, 29 (8 numbers)
  const calledHindustan = [5, 23, 45, 12, 34, 8, 15, 29, 50, 60];
  const hindustanRule = RULES.find(r => r.id === 'HINDUSTAN');
  const hRes = hindustanRule.checkFn(TICKET, calledHindustan);
  assert(hRes === true, 'HINDUSTAN logic triggers correctly');

  // Pakistan - 50 to 90 marked.
  // Ticket has 50..90: 67, 89, 56, 78, 90, 59, 68 (7 numbers)
  const calledPakistan = [67, 89, 56, 78, 90, 59, 68, 10, 20];
  const pakistanRule = RULES.find(r => r.id === 'PAKISTAN');
  assert(pakistanRule.checkFn(TICKET, calledPakistan) === true, 'PAKISTAN logic triggers correctly');

  // Any Row - if any row is fully marked
  const anyRowRule = RULES.find(r => r.id === 'ANY_ROW');
  assert(anyRowRule.checkFn(TICKET, calledTopRow) === true, 'ANY_ROW logic triggers correctly for top row');

  console.log(`\nResults: ${passed}/${total} checks passed.`);
}

runTests();
