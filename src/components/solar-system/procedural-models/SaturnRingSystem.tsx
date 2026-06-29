import React, { useMemo } from "react";
import * as THREE from "three";
import { buildRingParticlePositions } from "./geometry";
import { useImageTexture } from "./useImageTexture";

const ringInnerRadius = 1.32;
const ringOuterRadius = 2.38;

export function SaturnRingSystem({ radius }: { radius: number }) {
  const ringTexture = useImageTexture("/textures/saturn-rings.png");
  const ringGeometry = useMemo(() => new THREE.RingGeometry(radius * ringInnerRadius, radius * ringOuterRadius, 320), [radius]);
  const cassiniDivisionGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.78, radius * 1.84, 320), [radius]);
  const sunlitEdgeGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.34, radius * 2.34, 220, 1, -0.48, 1.18), [radius]);
  const particlePositions = useMemo(() => buildRingParticlePositions({ innerRadius: radius * 1.35, outerRadius: radius * 2.34, count: 1800, seed: 41, verticalScale: radius * 0.026 }), [radius]);

  return (
    <group name="saturn-ring-system" rotation={[Math.PI / 2, 0, 0]}>
      <mesh name="saturn-textured-ring-plane" geometry={ringGeometry}>
        <meshStandardMaterial map={ringTexture ?? undefined} color={ringTexture ? "#f2e7ca" : "#d8c48a"} transparent opacity={0.82} side={THREE.DoubleSide} roughness={0.72} depthWrite={false} />
      </mesh>
      <mesh name="saturn-cassini-division-shadow" geometry={cassiniDivisionGeometry}>
        <meshStandardMaterial color="#0f0d0a" transparent opacity={0.34} side={THREE.DoubleSide} roughness={1} depthWrite={false} />
      </mesh>
      <mesh name="saturn-ring-sunlit-edge" geometry={sunlitEdgeGeometry}>
        <meshStandardMaterial color="#fff2ca" transparent opacity={0.22} side={THREE.DoubleSide} roughness={0.72} depthWrite={false} />
      </mesh>
      <points name="saturn-ring-particles">
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#f3e6c2" size={0.014} sizeAttenuation transparent opacity={0.38} />
      </points>
    </group>
  );
}
