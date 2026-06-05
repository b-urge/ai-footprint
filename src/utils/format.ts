export function getDecimalPlaces(value: number): number {
  if (value < 1) return 3;
  if (value < 100) return 2;
  if (value < 1000) return 1;
  return 0;
}

export function formatComparisonValue(value: number): string {
  const dp = value < 1 ? 2 : value < 100 ? 1 : 0;
  return value.toFixed(dp);
}
