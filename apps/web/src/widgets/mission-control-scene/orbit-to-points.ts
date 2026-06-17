import { computeOrbitPosition } from "@satellite-control/entity-satellite";
import type { SatelliteOrbit } from "@satellite-control/entity-satellite";

export const ORBIT_SEGMENTS = 128;

/**
 * Returns ORBIT_SEGMENTS evenly-spaced points along a circular orbit.
 * Does not include a repeated closing point — callers that need a closed
 * line should append pts[0] themselves (or use a lineLoop primitive).
 */
export function orbitToPoints(
  orbit: SatelliteOrbit,
  segments = ORBIT_SEGMENTS,
): [number, number, number][] {
  const period = (2 * Math.PI) / orbit.speed;
  return Array.from({ length: segments }, (_, i) =>
    computeOrbitPosition(orbit, (i / segments) * period),
  );
}
