import React, { useMemo } from "react";
import * as THREE from "three";
import { degToRad } from "@/lib/orbits";
import type { Vector3Tuple } from "@/lib/orbits";
import type { OrbitData } from "@/types/domain";

interface OrbitLineProps {
  orbit: OrbitData;
  center?: Vector3Tuple;
}

export function OrbitLine({ orbit, center = [0, 0, 0] }: OrbitLineProps) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const inclination = degToRad(orbit.inclinationDeg);

    for (let step = 0; step <= 160; step += 1) {
      const angle = (step / 160) * Math.PI * 2;
      const x = Math.cos(angle) * orbit.displayDistance;
      const flatZ = Math.sin(angle) * orbit.displayDistance;
      points.push(new THREE.Vector3(center[0] + x, center[1] + Math.sin(inclination) * flatZ, center[2] + Math.cos(inclination) * flatZ));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [center, orbit]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial attach="material" color={orbit.color} transparent opacity={0.45} />
    </line>
  );
}
