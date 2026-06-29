import React, { useMemo } from "react";
import { buildDisplacedSphereGeometry } from "./geometry";
import { neptuneBands, uranusBands } from "./profiles";
import { AtmosphereShell, LatitudeBand, SphericalPatch } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";

export function IceGiantModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const isNeptune = body.id === "neptune";
  const geometry = useMemo(
    () =>
      buildDisplacedSphereGeometry({
        radius,
        seed: isNeptune ? 53 : 47,
        baseColor: isNeptune ? "#295dbb" : "#76c8d2",
        lightColor: isNeptune ? "#6fa4ee" : "#bce8e8",
        darkColor: isNeptune ? "#162866" : "#3f99a9",
        displacement: 0.008,
        widthSegments: 88,
        heightSegments: 56
      }),
    [isNeptune, radius]
  );
  const bands = isNeptune ? neptuneBands : uranusBands;

  return (
    <group name={`${body.id}-procedural-ice-giant-model`} scale={selected ? 1.08 : 1}>
      <mesh name={`${body.id}-surface`} geometry={geometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial vertexColors roughness={0.62} metalness={0.01} emissive={selected ? (isNeptune ? "#306ad6" : "#7ed8df") : "#000000"} emissiveIntensity={selected ? 0.07 : 0} />
      </mesh>
      <group name={`${body.id}-methane-bands`}>
        {bands.map((band) => <LatitudeBand key={band.name} band={band} radius={radius} opacity={band.opacity ?? 0.28} />)}
      </group>
      {isNeptune ? (
        <group name="neptune-dark-spot">
          <SphericalPatch patch={{ name: "neptune-dark-spot-main", lat: -18, lon: -40, latRadius: 8, lonRadius: 15, color: "#111d55", opacity: 0.7 }} radius={radius} height={1.02} />
          <SphericalPatch patch={{ name: "neptune-white-companion-cloud", lat: -10, lon: -23, latRadius: 3, lonRadius: 8, color: "#d8ecff", opacity: 0.64 }} radius={radius} height={1.03} />
        </group>
      ) : (
        <group name="uranus-faint-rings" rotation={[Math.PI / 2, 0, 0]}>
          <mesh name="uranus-ring-epsilon">
            <ringGeometry args={[radius * 1.55, radius * 1.62, 128]} />
            <meshStandardMaterial color="#a5d4da" transparent opacity={0.18} depthWrite={false} />
          </mesh>
        </group>
      )}
      <AtmosphereShell name={`${body.id}-atmosphere`} radius={radius} color={isNeptune ? "#4a8df0" : "#a1e3e7"} opacity={0.08} scale={1.08} />
    </group>
  );
}
