import React, { useMemo } from "react";
import * as THREE from "three";
import { buildBandTorusGeometry, buildSphericalEllipseGeometry, buildSphericalPolygonGeometry, buildSphericalPolylineGeometry } from "./geometry";
import type { BandSpec, PatchSpec, SphericalPolygonSpec, SphericalPolylineSpec } from "./types";

export function SphericalPatch({
  patch,
  radius,
  height = 1.01,
  emissive = "#000000",
  emissiveIntensity = 0
}: {
  patch: PatchSpec;
  radius: number;
  height?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  const geometry = useMemo(
    () => buildSphericalEllipseGeometry({ radius, lat: patch.lat, lon: patch.lon, latRadius: patch.latRadius, lonRadius: patch.lonRadius, height }),
    [height, patch.lat, patch.latRadius, patch.lon, patch.lonRadius, radius]
  );
  const transparent = patch.opacity !== undefined;

  return (
    <mesh name={patch.name} geometry={geometry}>
      <meshStandardMaterial color={patch.color} roughness={0.82} transparent={transparent} opacity={patch.opacity ?? 1} side={THREE.DoubleSide} emissive={emissive} emissiveIntensity={emissiveIntensity} depthWrite={!transparent} />
    </mesh>
  );
}

export function CloudPatch({ patch, radius }: { patch: PatchSpec; radius: number }) {
  const geometry = useMemo(
    () => buildSphericalEllipseGeometry({ radius, lat: patch.lat, lon: patch.lon, latRadius: patch.latRadius, lonRadius: patch.lonRadius, height: 1.035, segments: 52 }),
    [patch.lat, patch.latRadius, patch.lon, patch.lonRadius, radius]
  );

  return (
    <mesh name={patch.name} geometry={geometry}>
      <meshStandardMaterial color={patch.color} roughness={0.68} transparent opacity={patch.opacity ?? 0.35} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function AtmosphereShell({ name, radius, color, opacity, scale = 1.08 }: { name: string; radius: number; color: string; opacity: number; scale?: number }) {
  return (
    <mesh name={name} scale={scale}>
      <sphereGeometry args={[radius, 64, 40]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

export function SphericalPolygonPatch({
  patch,
  radius,
  height = 1.014,
  emissive = "#000000",
  emissiveIntensity = 0
}: {
  patch: SphericalPolygonSpec;
  radius: number;
  height?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  const geometry = useMemo(() => buildSphericalPolygonGeometry({ radius, patch, height }), [height, patch, radius]);

  return (
    <mesh name={patch.name} geometry={geometry}>
      <meshStandardMaterial color={patch.color} roughness={0.82} transparent={patch.opacity !== undefined} opacity={patch.opacity ?? 1} side={THREE.DoubleSide} emissive={emissive} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
}

export function SphericalPolyline({
  line,
  radius,
  height = 1.025
}: {
  line: SphericalPolylineSpec;
  radius: number;
  height?: number;
}) {
  const geometry = useMemo(() => buildSphericalPolylineGeometry({ radius, line, height }), [height, line, radius]);

  return (
    <line name={line.name}>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial attach="material" color={line.color} transparent opacity={line.opacity ?? 0.72} depthWrite={false} />
    </line>
  );
}

export function LatitudeBand({ band, radius, opacity = 0.45 }: { band: BandSpec; radius: number; opacity?: number }) {
  const geometry = useMemo(() => buildBandTorusGeometry(radius * 1.012, band.lat, band.width), [band.lat, band.width, radius]);

  return (
    <mesh name={band.name} geometry={geometry}>
      <meshStandardMaterial color={band.color} roughness={0.76} transparent opacity={band.opacity ?? opacity} depthWrite={false} />
    </mesh>
  );
}
