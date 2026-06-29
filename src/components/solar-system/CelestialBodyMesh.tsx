import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";
import { assetSources } from "@/data/assets";
import { degToRad } from "@/lib/orbits";
import type { AssetSource, CelestialBody, Locale } from "@/types/domain";
import { CelestialBodyProceduralModel } from "./procedural-models/CelestialBodyProceduralModel";
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

function getBodyDiffuseAsset(body: CelestialBody): AssetSource | undefined {
  return assetSources.find((source) => source.bodyId === body.id && source.purpose === "surface") ?? assetSources.find((source) => source.id === body.textureAssetId && source.purpose === "diffuse");
}

function createRotationAxisGeometry(radius: number): THREE.BufferGeometry {
  const halfLength = radius * 1.75;
  return new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -halfLength, 0), new THREE.Vector3(0, halfLength, 0)]);
}

export function CelestialBodyMesh({ body, bodies, locale, elapsedDays, showLabel, selected, onSelectBody }: CelestialBodyMeshProps) {
  const asset = getBodyDiffuseAsset(body);
  const position = getSceneBodyPosition(body, bodies, elapsedDays);
  const radius = body.orbit?.displayRadius ?? 2.2;
  const fallbackColor = getBodyFallbackColor(body);
  const axialTilt = degToRad(body.axialTiltDeg ?? 0);
  const rotationAxisGeometry = useMemo(() => createRotationAxisGeometry(radius), [radius]);

  return (
    <group position={position}>
      <group name={`${body.id}-axial-tilt`} rotation={[0, 0, axialTilt]} userData={{ axialTiltDeg: body.axialTiltDeg ?? 0 }}>
        <CelestialBodyProceduralModel body={body} radius={radius} selected={selected} fallbackColor={fallbackColor} asset={asset} onSelectBody={onSelectBody} />
        {body.id !== "sun" ? (
          <line name={`${body.id}-rotation-axis`}>
            <primitive object={rotationAxisGeometry} attach="geometry" />
            <lineBasicMaterial attach="material" color="#e0f7ff" transparent opacity={selected ? 0.95 : 0.56} />
          </line>
        ) : null}
      </group>
      {showLabel ? (
        <Html center distanceFactor={10} position={[0, -(radius + 0.52), 0]}>
          <span className="whitespace-nowrap rounded-ui bg-black/55 px-2 py-1 text-xs text-white">{body.name[locale]}</span>
        </Html>
      ) : null}
    </group>
  );
}
