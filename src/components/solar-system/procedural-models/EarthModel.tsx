import React, { useMemo } from "react";
import * as THREE from "three";
import { assetSources } from "@/data/assets";
import { earthOceanBoundaries } from "./profiles";
import { AtmosphereShell, SphericalPolyline } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

export function EarthModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const cloudAsset = assetSources.find((source) => source.bodyId === "earth" && source.purpose === "clouds");
  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 192, 112), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);
  const cloudTexture = useImageTexture(cloudAsset?.localPath);
  const subduedOceanBoundaries = useMemo(
    () =>
      earthOceanBoundaries.map((line) => ({
        ...line,
        opacity: (line.opacity ?? 0.72) * 0.34
      })),
    []
  );

  return (
    <group name="earth-image-based-blue-marble-model" scale={selected ? 1.08 : 1}>
      <mesh name="earth-surface" geometry={surfaceGeometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshPhysicalMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.012}
          color={surfaceTexture ? "#ffffff" : "#0b82cc"}
          roughness={0.72}
          metalness={0.01}
          clearcoat={0.2}
          clearcoatRoughness={0.36}
          emissive="#02224d"
          emissiveIntensity={selected ? 0.055 : 0.018}
        />
      </mesh>
      <group name="earth-ocean-boundaries">
        {subduedOceanBoundaries.map((line) => <SphericalPolyline key={line.name} line={line} radius={radius} height={1.012} />)}
      </group>
      <mesh name="earth-real-cloud-layer" scale={1.018}>
        <sphereGeometry args={[radius, 160, 96]} />
        <meshStandardMaterial map={cloudTexture ?? undefined} color="#f7fbff" roughness={0.9} transparent opacity={0.62} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <AtmosphereShell name="earth-atmosphere" radius={radius} color="#72c9ff" opacity={0.08} scale={1.08} />
    </group>
  );
}
