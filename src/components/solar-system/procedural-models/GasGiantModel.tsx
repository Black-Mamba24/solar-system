import React, { useMemo } from "react";
import { buildDisplacedSphereGeometry } from "./geometry";
import { jupiterBands, saturnBands } from "./profiles";
import { LatitudeBand, SphericalPatch } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";

export function GasGiantModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const isJupiter = body.id === "jupiter";
  const bands = isJupiter ? jupiterBands : saturnBands;
  const geometry = useMemo(
    () =>
      buildDisplacedSphereGeometry({
        radius,
        seed: isJupiter ? 31 : 37,
        baseColor: isJupiter ? "#d8b47b" : "#d9b977",
        lightColor: isJupiter ? "#f4dfb8" : "#f1dda7",
        darkColor: isJupiter ? "#7c493a" : "#9c7144",
        displacement: isJupiter ? 0.018 : 0.012,
        widthSegments: 96,
        heightSegments: 64,
        flattenY: isJupiter ? 0.965 : 0.94
      }),
    [isJupiter, radius]
  );

  return (
    <group name={`${body.id}-procedural-gas-giant-model`} scale={selected ? 1.08 : 1}>
      <mesh name={`${body.id}-surface`} geometry={geometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial vertexColors roughness={0.78} metalness={0.01} emissive={selected ? (isJupiter ? "#d99a66" : "#d8ba78") : "#000000"} emissiveIntensity={selected ? 0.07 : 0} />
      </mesh>
      <group name={`${body.id}-cloud-bands`}>
        {bands.map((band) => <LatitudeBand key={band.name} band={band} radius={radius} opacity={isJupiter ? 0.52 : 0.42} />)}
      </group>
      {isJupiter ? (
        <group name="jupiter-great-red-spot">
          <SphericalPatch patch={{ name: "jupiter-great-red-spot-outer", lat: -22, lon: -42, latRadius: 9, lonRadius: 18, color: "#b45539", opacity: 0.88 }} radius={radius} height={1.025} />
          <SphericalPatch patch={{ name: "jupiter-great-red-spot-core", lat: -22, lon: -42, latRadius: 4, lonRadius: 9, color: "#e09063", opacity: 0.8 }} radius={radius} height={1.032} />
        </group>
      ) : null}
    </group>
  );
}
