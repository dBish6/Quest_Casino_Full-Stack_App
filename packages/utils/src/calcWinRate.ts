export function calcWinRate(wins: number, losses: number) {
  if (!wins && !losses) return 0;
  return Math.round((wins / (wins + losses)) * 1000) / 10;
};
