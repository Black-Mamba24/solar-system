import React, { useMemo } from "react";

const STAR_COUNT = 700;

function seededUnit(index: number): number {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function Stars() {
  const positions = useMemo(() => {
    const values: number[] = [];

    for (let index = 0; index < STAR_COUNT; index += 1) {
      values.push(
        (seededUnit(index * 3 + 1) - 0.5) * 180,
        (seededUnit(index * 3 + 2) - 0.5) * 90,
        (seededUnit(index * 3 + 3) - 0.5) * 180
      );
    }

    return new Float32Array(values);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.08} sizeAttenuation transparent opacity={0.72} />
    </points>
  );
}
