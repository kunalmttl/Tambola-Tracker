import { useMatchStore } from '../store/useMatchStore';

export default function CalledNumbersBoard() {
  const { matchState } = useMatchStore();
  const calledSet = new Set(matchState.calledNumbers);
  const latestNum = matchState.calledNumbers.length > 0
    ? matchState.calledNumbers[matchState.calledNumbers.length - 1]
    : null;

  const cols = 9;
  const rows = 10;

  const columns = Array.from({ length: cols }, (_, c) => {
    return Array.from({ length: rows }, (_, r) => c * 10 + r + 1);
  });

  return (
    <div>
      <p className="text-text-secondary text-[13px] font-medium mb-2">Called Numbers</p>
      <div className="flex justify-between w-full gap-[3px]">
        {columns.map((colData, cIdx) => (
          <div key={`col-${cIdx}`} className="flex flex-col gap-[3px] w-full">
            {colData.map(num => {
              const called = calledSet.has(num);
              const isLatest = num === latestNum;

              return (
                <div
                  key={num}
                  aria-label={`Number ${num} - ${called ? 'Called' : 'Not Called'}`}
                  className={`
                    board-cell w-full h-auto aspect-square
                    ${called ? 'called' : 'uncalled'}
                    ${isLatest ? 'animate-number-pop ring-2 ring-hit/40' : ''}
                  `}
                  style={{
                    fontSize: 'clamp(0.55rem, 1.2vw, 0.7rem)'
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
