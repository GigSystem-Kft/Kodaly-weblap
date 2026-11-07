/**
 * Fisher–Yates shuffling for ear-training rounds.
 * Each interval appears exactly once per round.
 */
export function shuffleEarChallenges<T extends { id: number }>(
  challenges: readonly T[],
  previousLastId?: number,
  random: () => number = Math.random
): T[] {
  const result = [...challenges];
  for (let i = result.length - 1; i > 0; i--) {
    const sample = random();
    const j = Math.min(i, Math.max(0, Math.floor(sample * (i + 1))));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.length > 1 && previousLastId !== undefined && result[0].id === previousLastId) {
    const swapIndex = result.findIndex(item => item.id !== previousLastId);
    [result[0], result[swapIndex]] = [result[swapIndex], result[0]];
  }
  // Even a rare ascending permutation must not reveal the canonical ordering.
  if (result.length > 2 && result.every((item, index) => item.id === challenges[index].id)) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}
