import React, { useMemo } from "react";
import * as THREE from "three";
import { AtmosphereShell } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

export function MarsModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 176, 104), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);

  return (
    <group name="mars-image-based-red-planet-model" scale={selected ? 1.08 : 1}>
      <mesh name="mars-surface" geometry={surfaceGeometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.05}
          color={surfaceTexture ? "#c96c43" : "#a84d32"}
          roughness={0.98}
          metalness={0.015}
          emissive={selected ? "#5d2319" : "#120604"}
          emissiveIntensity={selected ? 0.055 : 0.01}
        />
      </mesh>
      <mesh name="mars-dust-haze-shell" scale={1.018}>
        <sphereGeometry args={[radius, 96, 56]} />
        <meshStandardMaterial color="#d88958" roughness={1} transparent opacity={0.11} depthWrite={false} side={THREE.DoubleSide} emissive="#3b140b" emissiveIntensity={0.018} />
      </mesh>
      <AtmosphereShell name="mars-thin-atmosphere" radius={radius} color="#d58a5b" opacity={0.055} scale={1.07} />
    </group>
  );
}
