import type { SatelliteOrbit } from "./satellite.entity";

/**
 * Computes the 3D position of a satellite on a circular orbit at time t.
 *
 * Coordinate system (Three.js Y-up):
 *   - XZ plane = equatorial plane
 *   - Y axis   = polar axis (positive = north)
 *
 * Predicted position: call with t + predictionWindow (e.g. t + 300).
 * The prediction window constant lives in the widget layer, not here.
 */
export function computeOrbitPosition(
  orbit: SatelliteOrbit,
  t: number,
): [number, number, number] {
  const θ = orbit.initialAngle + orbit.speed * t;
  const inc = (orbit.inclination * Math.PI) / 180;
  const raan = (orbit.raan * Math.PI) / 180;

  const cosθ = Math.cos(θ);
  const sinθ = Math.sin(θ);
  const cosI = Math.cos(inc);
  const sinI = Math.sin(inc);
  const cosR = Math.cos(raan);
  const sinR = Math.sin(raan);

  return [
    orbit.radius * (cosθ * cosR + sinθ * cosI * sinR),
    orbit.radius * (-sinθ * sinI),
    orbit.radius * (-cosθ * sinR + sinθ * cosI * cosR),
  ];
}
