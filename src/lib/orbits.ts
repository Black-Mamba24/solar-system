import type { OrbitData } from "@/types/domain";

export type Vector3Tuple = [number, number, number];

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function orbitalAngleDeg(orbit: OrbitData, elapsedDays: number): number {
  const turns = elapsedDays / orbit.orbitalPeriodDays;
  const angle = (orbit.phaseDeg + turns * 360) % 360;
  return angle < 0 ? angle + 360 : angle;
}

export function getBodyPosition(orbit: OrbitData, elapsedDays: number): Vector3Tuple {
  const angle = degToRad(orbitalAngleDeg(orbit, elapsedDays));
  const inclination = degToRad(orbit.inclinationDeg);
  const x = Math.cos(angle) * orbit.displayDistance;
  const flatZ = Math.sin(angle) * orbit.displayDistance;
  const y = Math.sin(inclination) * flatZ;
  const z = Math.cos(inclination) * flatZ;
  return [x, y, z];
}
