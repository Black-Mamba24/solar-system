import React, { useMemo } from "react";
import * as THREE from "three";
import { AtmosphereShell, SphericalPatch } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

const southernStorm = { name: "saturn-southern-storm-brightening", lat: -39, lon: -24, latRadius: 4, lonRadius: 22, color: "#fff0c6", opacity: 0.2 };

export function SaturnModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const geometry = useMemo(() => {
    const sphere = new THREE.SphereGeometry(radius, 176, 104);
    sphere.scale(1, 0.94, 1);
    return sphere;
  }, [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);

  return (
    <group name="saturn-image-based-ringed-storm-model" scale={selected ? 1.08 : 1}>
      <mesh name="saturn-surface" geometry={geometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.012}
          color={surfaceTexture ? "#ecd7a4" : "#d9b977"}
          roughness={0.88}
          metalness={0.006}
          emissive={selected ? "#72522c" : "#050302"}
          emissiveIntensity={selected ? 0.04 : 0.005}
        />
      </mesh>
      <mesh name="saturn-upper-cloud-sheen" geometry={geometry} scale={1.006}>
        <meshStandardMaterial map={surfaceTexture ?? undefined} color="#fff0c7" roughness={0.94} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh name="saturn-north-polar-hexagon" position={[0, radius * 0.925, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <circleGeometry args={[radius * 0.27, 6]} />
        <meshStandardMaterial color="#8f8d82" transparent opacity={0.26} roughness={0.9} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <SphericalPatch patch={southernStorm} radius={radius} height={1.018} emissive="#3b2410" emissiveIntensity={0.018} />
      <mesh name="saturn-ring-shadow-on-globe" rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.84, radius * 0.028, 8, 180]} />
        <meshStandardMaterial color="#2c261d" transparent opacity={0.2} roughness={1} depthWrite={false} />
      </mesh>
      <AtmosphereShell name="saturn-golden-haze-atmosphere" radius={radius} color="#d7b878" opacity={0.045} scale={1.055} />
    </group>
  );
}
