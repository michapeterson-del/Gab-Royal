export type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  durationMin: number;
  priceFrom: number;
};

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h} Std. ${m} Min.`;
}
