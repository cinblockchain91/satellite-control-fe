export function computeFps(elapsed: number, frameCount: number): number {
  if (elapsed <= 0) return 0;
  return frameCount / elapsed;
}
