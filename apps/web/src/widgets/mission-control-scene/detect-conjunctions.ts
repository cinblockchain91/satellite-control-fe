import { computeOrbitPosition } from "@satellite-control/entity-satellite";
import type { SatelliteOrbit } from "@satellite-control/entity-satellite";

/** Minimum approach distance (scene units) that triggers a conjunction warning. */
export const CONJUNCTION_THRESHOLD = 0.5;

interface OrbitingBody {
  id: string;
  orbit: SatelliteOrbit;
}

/**
 * Returns pairs of satellite IDs whose computed positions at time `t` are
 * closer than `threshold` scene units.  Pure function — safe to call in
 * a throttled useFrame without side effects.
 */
export function detectConjunctions(
  satellites: readonly OrbitingBody[],
  t: number,
  threshold = CONJUNCTION_THRESHOLD,
): [string, string][] {
  const result: [string, string][] = [];
  for (let i = 0; i < satellites.length; i++) {
    for (let j = i + 1; j < satellites.length; j++) {
      const [x1, y1, z1] = computeOrbitPosition(satellites[i]!.orbit, t);
      const [x2, y2, z2] = computeOrbitPosition(satellites[j]!.orbit, t);
      const d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
      if (d < threshold) {
        result.push([satellites[i]!.id, satellites[j]!.id]);
      }
    }
  }
  return result;
}
