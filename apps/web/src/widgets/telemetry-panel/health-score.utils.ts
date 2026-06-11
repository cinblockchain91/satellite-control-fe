export interface HealthScoreVariant {
  text: string;
  bar: string;
}

export function healthScoreVariant(score: number): HealthScoreVariant {
  if (score >= 70) return { text: "text-green-400", bar: "bg-green-500" };
  if (score >= 40) return { text: "text-yellow-400", bar: "bg-yellow-500" };
  return { text: "text-red-400", bar: "bg-red-500" };
}
