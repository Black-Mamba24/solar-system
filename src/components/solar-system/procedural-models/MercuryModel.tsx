import React, { useMemo } from "react";
import * as THREE from "three";
import { useImageTexture } from "./useImageTexture";
import type { ProceduralBodyModelProps } from "./types";

export function MercuryModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 160, 96), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);

  return (
    <group name="mercury-image-based-barren-model" scale={selected ? 1.08 : 1}>
      <mesh name="mercury-surface" geometry={surfaceGeometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.035}
          color={surfaceTexture ? "#c4c0b9" : "#595650"}
          roughness={0.99}
          metalness={0.01}
          emissive={selected ? "#34312d" : "#020202"}
          emissiveIntensity={selected ? 0.035 : 0.006}
        />
      </mesh>
    </group>
  );
}
