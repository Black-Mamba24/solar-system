import { getBodyPosition, type Vector3Tuple } from "@/lib/orbits";
import type { CelestialBody } from "@/types/domain";

const BODY_COLORS: Record<string, string> = {
  sun: "#f8c45c",
  mercury: "#9ca3af",
  venus: "#d6b36a",
  earth: "#4fb3d8",
  moon: "#cbd5e1",
  mars: "#c66b4e",
  jupiter: "#d1a16e",
  saturn: "#e0c180",
  uranus: "#85d7df",
  neptune: "#4778d8"
};

function addVectors(a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function getSceneBodyPosition(body: CelestialBody, allBodies: CelestialBody[], elapsedDays: number): Vector3Tuple {
  const localPosition = body.orbit ? getBodyPosition(body.orbit, elapsedDays) : ([0, 0, 0] as Vector3Tuple);
  const parent = body.parentId ? allBodies.find((candidate) => candidate.id === body.parentId) : undefined;

  if (!parent) {
    return localPosition;
  }

  return addVectors(getSceneBodyPosition(parent, allBodies, elapsedDays), localPosition);
}

export function getOrbitCenter(body: CelestialBody, allBodies: CelestialBody[], elapsedDays: number): Vector3Tuple {
  const parent = body.parentId ? allBodies.find((candidate) => candidate.id === body.parentId) : undefined;
  return parent ? getSceneBodyPosition(parent, allBodies, elapsedDays) : ([0, 0, 0] as Vector3Tuple);
}

export function getBodyFallbackColor(body: CelestialBody): string {
  return BODY_COLORS[body.id] ?? body.orbit?.color ?? "#f8c45c";
}
