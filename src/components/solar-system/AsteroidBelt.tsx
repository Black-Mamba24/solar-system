import React, { useMemo } from "react";

const asteroidCount = 900;
const innerRadius = 22.8;
const outerRadius = 27.2;

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function AsteroidBelt() {
  const positions = useMemo(() => {
    const points = new Float32Array(asteroidCount * 3);

    for (let index = 0; index < asteroidCount; index += 1) {
      const angle = pseudoRandom(index + 1) * Math.PI * 2;
      const radius = innerRadius + pseudoRandom(index + 11) * (outerRadius - innerRadius);
      const verticalOffset = (pseudoRandom(index + 23) - 0.5) * 0.34;

      points[index * 3] = Math.cos(angle) * radius;
      points[index * 3 + 1] = verticalOffset;
      points[index * 3 + 2] = Math.sin(angle) * radius;
    }

    return points;
  }, []);

  return (
    <points name="asteroid-belt">
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#b7aa91" size={0.045} sizeAttenuation transparent opacity={0.72} />
    </points>
  );
}
