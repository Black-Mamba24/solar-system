import { Html, useTexture } from "@react-three/drei";
import React from "react";
import * as THREE from "three";
import { assetSources } from "@/data/assets";
import { getBodyPosition } from "@/lib/orbits";
import type { CelestialBody, Locale } from "@/types/domain";

interface CelestialBodyMeshProps {
  body: CelestialBody;
  locale: Locale;
  elapsedDays: number;
  showLabel: boolean;
  selected: boolean;
  onSelectBody: (bodyId: string) => void;
}

export function CelestialBodyMesh({ body, locale, elapsedDays, showLabel, selected, onSelectBody }: CelestialBodyMeshProps) {
  const asset = assetSources.find((source) => source.id === body.textureAssetId);
  const texture = useTexture(asset?.localPath ?? "/textures/missing.jpg") as THREE.Texture | null;
  const position = body.orbit ? getBodyPosition(body.orbit, elapsedDays) : ([0, 0, 0] as [number, number, number]);
  const radius = body.orbit?.displayRadius ?? 2.2;
  const isSun = body.id === "sun";

  return (
    <group position={position}>
      <mesh scale={selected ? 1.08 : 1} onClick={() => onSelectBody(body.id)}>
        <sphereGeometry args={[radius, 64, 64]} />
        {isSun ? (
          <meshBasicMaterial map={texture} color="#f8c45c" />
        ) : (
          <meshStandardMaterial
            map={texture}
            color={texture ? "#ffffff" : body.orbit?.color ?? "#f8c45c"}
            roughness={0.72}
            metalness={0.02}
            emissive={selected ? body.orbit?.color ?? "#f8c45c" : "#000000"}
            emissiveIntensity={selected ? 0.18 : 0}
          />
        )}
      </mesh>
      {body.id === "saturn" ? (
        <mesh rotation={[Math.PI / 2.7, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 2.2, 96]} />
          <meshStandardMaterial color="#d8c48a" transparent opacity={0.72} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
      {showLabel ? (
        <Html center distanceFactor={10}>
          <span className="rounded-ui bg-black/55 px-2 py-1 text-xs text-white">{body.name[locale]}</span>
        </Html>
      ) : null}
    </group>
  );
}
