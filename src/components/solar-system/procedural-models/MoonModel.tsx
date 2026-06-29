import React, { useMemo } from "react";
import * as THREE from "three";
import { useImageTexture } from "./useImageTexture";
import type { ProceduralBodyModelProps } from "./types";

export function MoonModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 192, 112), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);

  return (
    <group name="moon-image-based-cratered-model" scale={selected ? 1.08 : 1}>
      <mesh name="moon-surface" geometry={surfaceGeometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.045}
          color={surfaceTexture ? "#c7c5bf" : "#8b8984"}
          roughness={1}
          metalness={0.006}
          emissive={selected ? "#3c3b38" : "#010101"}
          emissiveIntensity={selected ? 0.035 : 0.004}
        />
      </mesh>
      <mesh name="moon-regolith-contrast-sheen" geometry={surfaceGeometry} scale={1.004}>
        <meshStandardMaterial map={surfaceTexture ?? undefined} color="#f1f0ea" transparent opacity={0.08} blending={THREE.AdditiveBlending} roughness={1} depthWrite={false} />
      </mesh>
    </group>
  );
}
