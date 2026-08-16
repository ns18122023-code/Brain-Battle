/**
 * Calculate speed-based score points for a correct answer.
 * Formula: Math.round(maxPoints * (timeRemaining / totalTime))
 * Minimum guaranteed 250 points for correct answer.
 */
export function calculateSpeedPoints(timeRemaining, totalTime = 20, maxPoints = 1000) {
  if (timeRemaining <= 0) return 250;
  const ratio = Math.min(Math.max(timeRemaining / totalTime, 0.1), 1.0);
  const calculated = Math.round(maxPoints * ratio);
  return Math.max(calculated, 250);
}
