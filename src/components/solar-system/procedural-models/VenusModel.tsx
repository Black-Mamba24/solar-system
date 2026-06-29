import React, { useMemo } from "react";
import * as THREE from "three";
import { assetSources } from "@/data/assets";
import { AtmosphereShell } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

export function VenusModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const atmosphereAsset = assetSources.find((source) => source.bodyId === "venus" && source.purpose === "clouds");
  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 160, 96), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);
  const atmosphereTexture = useImageTexture(atmosphereAsset?.localPath);

  return (
    <group name="venus-image-based-volcanic-model" scale={selected ? 1.08 : 1}>
      <mesh name="venus-surface" geometry={surfaceGeometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.04}
          color={surfaceTexture ? "#b85f2f" : "#6a301a"}
          roughness={0.96}
          metalness={0.01}
          transparent
          opacity={0.72}
          emissive={selected ? "#4e180f" : "#100503"}
          emissiveIntensity={selected ? 0.035 : 0.008}
        />
      </mesh>
      <mesh name="venus-dense-cloud-shell" scale={1.022}>
        <sphereGeometry args={[radius, 80, 48]} />
        <meshStandardMaterial
          map={atmosphereTexture ?? undefined}
          color={atmosphereTexture ? "#d79a55" : "#a66b37"}
          roughness={0.98}
          transparent
          opacity={0.64}
          depthWrite={false}
          side={THREE.DoubleSide}
          emissive="#241006"
          emissiveIntensity={0.04}
        />
      </mesh>
      <AtmosphereShell name="venus-haze-atmosphere" radius={radius} color="#9c552e" opacity={0.14} scale={1.14} />
    </group>
  );
}
