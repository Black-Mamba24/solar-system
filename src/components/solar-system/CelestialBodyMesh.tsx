import { Html } from "@react-three/drei";
import React from "react";
import * as THREE from "three";
import { assetSources } from "@/data/assets";
import type { CelestialBody, Locale } from "@/types/domain";
import { getBodyFallbackColor, getSceneBodyPosition } from "./scene-helpers";

interface CelestialBodyMeshProps {
  body: CelestialBody;
  bodies: CelestialBody[];
  locale: Locale;
  elapsedDays: number;
  showLabel: boolean;
  selected: boolean;
  onSelectBody: (bodyId: string) => void;
}

export function CelestialBodyMesh({ body, bodies, locale, elapsedDays, showLabel, selected, onSelectBody }: CelestialBodyMeshProps) {
  const asset = assetSources.find((source) => source.id === body.textureAssetId);
  const position = getSceneBodyPosition(body, bodies, elapsedDays);
  const radius = body.orbit?.displayRadius ?? 2.2;
  const isSun = body.id === "sun";
  const fallbackColor = getBodyFallbackColor(body);

  return (
    <group position={position}>
      <mesh scale={selected ? 1.08 : 1} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <sphereGeometry args={[radius, 64, 64]} />
        {isSun ? (
          <meshBasicMaterial color={fallbackColor} />
        ) : (
          <meshStandardMaterial
            color={fallbackColor}
            roughness={0.72}
            metalness={0.02}
            emissive={selected ? fallbackColor : "#000000"}
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
        <Html center distanceFactor={10} position={[0, -(radius + 0.52), 0]}>
          <span className="whitespace-nowrap rounded-ui bg-black/55 px-2 py-1 text-xs text-white">{body.name[locale]}</span>
        </Html>
      ) : null}
    </group>
  );
}
