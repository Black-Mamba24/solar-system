"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import React, { useMemo } from "react";
import * as THREE from "three";
import { useImageTexture } from "@/components/solar-system/procedural-models/useImageTexture";
import { assetSources } from "@/data/assets";
import { bodies } from "@/data/bodies";
import {
  getEclipseTangentGeometry,
  getGroundEclipseAppearance,
  getShadowTrackGeometry,
  getSpaceShadowProjectionGeometry,
  getSpaceMoonPosition,
  type GroundMode,
  type EclipseTangentGeometry,
  type EclipseView,
  type ShadowPoint,
  type SolarEclipseState,
  spaceEarth,
  spaceMoon,
  spaceMoonOrbitInclinationRad,
  spaceSun
} from "@/lib/solar-eclipse";
import type { AssetSource, CelestialBody, Locale } from "@/types/domain";

export interface SolarEclipseCanvasProps {
  locale: Locale;
  state: SolarEclipseState;
  view: EclipseView;
  onShadowPointSelect: (point: ShadowPoint, groundMode: GroundMode) => void;
}

const sunPosition = new THREE.Vector3(spaceSun.x, spaceSun.y, 0);
const earthPosition = new THREE.Vector3(spaceEarth.x, spaceEarth.y, 0);
const earthRadius = spaceEarth.radius;
const penumbraHotZoneRadius = 0.74;
const umbraHotZoneRadius = 0.2;
const centralShadowTrackWidthScale = 0.18;
const minCentralShadowTrackHalfWidth = 0.002;

export interface EarthShadowSurfacePoint {
  local: {
    x: number;
    y: number;
    z: number;
  };
  world: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ShadowAxisGeometry {
  start: THREE.Vector3;
  direction: THREE.Vector3;
  axisEnd: THREE.Vector3;
  intersectsEarth: boolean;
}

export function getCentralShadowTrackHalfWidth(centralBandScaleY: number): number {
  return Math.max(minCentralShadowTrackHalfWidth, centralBandScaleY * centralShadowTrackWidthScale);
}

export function getEarthSurfaceTrackModel(model: EclipseTangentGeometry["model"]): EclipseTangentGeometry["model"] {
  return model === "annular" ? "total" : model;
}

interface EarthSurfaceLocalPoint {
  x: number;
  y: number;
  z: number;
}

function getBody(bodyId: string): CelestialBody {
  const body = bodies.find((candidate) => candidate.id === bodyId);

  if (!body) {
    throw new Error(`Missing body: ${bodyId}`);
  }

  return body;
}

function getSurfaceAsset(bodyId: string): AssetSource | undefined {
  return assetSources.find((source) => source.bodyId === bodyId && source.purpose === "surface");
}

function EclipseBody({ bodyId, radius }: { bodyId: string; radius: number }) {
  const body = getBody(bodyId);
  const asset = getSurfaceAsset(bodyId);
  const texture = useImageTexture(asset?.localPath);
  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 160, 96), [radius]);
  const fallbackColor = bodyId === "sun" ? "#fff2a8" : bodyId === "earth" ? "#0b82cc" : "#c7c5bf";

  return (
    <mesh name={`${body.id}-surface`} geometry={surfaceGeometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }}>
      {bodyId === "sun" ? (
        <meshBasicMaterial map={texture ?? undefined} color={texture ? "#fff2a8" : fallbackColor} toneMapped={false} />
      ) : (
        <meshStandardMaterial
          map={texture ?? undefined}
          bumpMap={texture ?? undefined}
          bumpScale={bodyId === "moon" ? radius * 0.045 : radius * 0.012}
          color={texture ? "#ffffff" : fallbackColor}
          roughness={bodyId === "earth" ? 0.72 : 1}
          metalness={0.01}
          emissive={bodyId === "earth" ? "#021428" : "#010101"}
          emissiveIntensity={bodyId === "earth" ? 0.012 : 0.004}
        />
      )}
    </mesh>
  );
}

function ShadowConicVolume({
  name,
  start,
  end,
  startRadius,
  endRadius,
  color,
  opacity,
  renderOrder = 0
}: {
  name: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  startRadius: number;
  endRadius: number;
  color: string;
  opacity: number;
  renderOrder?: number;
}) {
  const { center, length, quaternion } = useMemo(() => {
    const axis = end.clone().sub(start);
    const axisLength = axis.length();
    const direction = axisLength > 0 ? axis.clone().normalize() : new THREE.Vector3(1, 0, 0);

    return {
      center: start.clone().add(end).multiplyScalar(0.5),
      length: axisLength,
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
    };
  }, [end, start]);

  return (
    <mesh name={name} position={center.toArray()} quaternion={quaternion} renderOrder={renderOrder}>
      <cylinderGeometry args={[endRadius, startRadius, length, 96, 5, true]} />
      <meshBasicMaterial name={`${name}-wireframe-material`} color={color} transparent opacity={opacity} wireframe depthWrite={false} depthTest />
    </mesh>
  );
}

function TangentLine({ name, points, color, opacity }: { name: string; points: THREE.Vector3[]; color: string; opacity: number }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line name={name}>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial attach="material" color={color} transparent opacity={opacity} />
    </line>
  );
}

function MoonOrbitGuide({ orbitRadius }: { orbitRadius: number }) {
  return (
    <group name="eclipse-moon-earth-orbit-guide" position={earthPosition.toArray()} rotation={[Math.PI / 2 - spaceMoonOrbitInclinationRad, 0, 0]}>
      <mesh name="eclipse-moon-orbit-ring">
        <torusGeometry args={[orbitRadius, 0.006, 8, 160]} />
        <meshBasicMaterial color="#9fb8d8" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

export function getShadowPointFromLocalPoint(point: Pick<THREE.Vector3, "x" | "y">, radius: number): ShadowPoint {
  const normalized = {
    x: Math.max(-1, Math.min(1, point.x / radius)),
    y: Math.max(-1, Math.min(1, point.y / radius))
  };

  return {
    x: Number(normalized.x.toFixed(2)),
    y: Number(normalized.y.toFixed(2))
  };
}

function getClickPoint(event: ThreeEvent<MouseEvent>, radius: number): ShadowPoint {
  event.stopPropagation();

  if (!event.object || !event.point || typeof event.object.worldToLocal !== "function") {
    return radius > umbraHotZoneRadius ? { x: 0.72, y: 0.42 } : { x: 0.04, y: 0.02 };
  }

  return getShadowPointFromLocalPoint(event.object.worldToLocal(event.point.clone()), radius);
}

function clampVisual(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getShadowAxisGeometry(progress: number, model: EclipseTangentGeometry["model"]): ShadowAxisGeometry {
  const clampedProgress = clampVisual(progress, 0, 1);
  const moon = getSpaceMoonPosition(clampedProgress, model);
  const start = new THREE.Vector3(moon.x, moon.y, moon.z);
  const direction = start.clone().sub(sunPosition).normalize();
  const moonToEarth = earthPosition.clone().sub(start);
  const closestAxisDistance = moonToEarth.dot(direction);
  const closestAxisPoint = start.clone().add(direction.clone().multiplyScalar(closestAxisDistance));
  const closestLocal = closestAxisPoint.clone().sub(earthPosition);
  const closestLocalLength = closestLocal.length();
  const intersectsEarth = closestAxisDistance >= 0 && closestLocalLength < earthRadius;
  let axisEnd = closestAxisPoint;

  if (intersectsEarth) {
    const entryOffset = Math.sqrt(Math.max(0, earthRadius ** 2 - closestLocalLength ** 2));
    axisEnd = closestAxisPoint.clone().sub(direction.clone().multiplyScalar(entryOffset));
  }

  return {
    start,
    direction,
    axisEnd,
    intersectsEarth
  };
}

export function getEarthShadowSurfacePoint(progress: number, model: EclipseTangentGeometry["model"]): EarthShadowSurfacePoint {
  const clampedProgress = clampVisual(progress, 0, 1);
  const axisGeometry = getShadowAxisGeometry(clampedProgress, model);
  const closestLocal = axisGeometry.axisEnd.clone().sub(earthPosition);
  const closestLocalLength = closestLocal.length();
  let local: THREE.Vector3;

  if (closestLocalLength < 0.0001) {
    local = axisGeometry.direction.clone().multiplyScalar(-earthRadius);
  } else if (closestLocalLength < earthRadius) {
    local = axisGeometry.axisEnd.clone().sub(earthPosition);
  } else {
    local = closestLocal.normalize().multiplyScalar(earthRadius);
  }

  const localPoint = {
    x: local.x,
    y: local.y,
    z: local.z
  };

  return {
    local: localPoint,
    world: {
      x: earthPosition.x + localPoint.x,
      y: earthPosition.y + localPoint.y,
      z: localPoint.z
    }
  };
}

export function getPenumbraShadowVolumeAxisEndPoint(progress: number, model: EclipseTangentGeometry["model"]): THREE.Vector3 {
  const tangentGeometry = getEclipseTangentGeometry(progress, model);
  const shadowProjection = getSpaceShadowProjectionGeometry(tangentGeometry);

  return new THREE.Vector3(shadowProjection.centerAtEarth.x, shadowProjection.centerAtEarth.y, shadowProjection.centerAtEarth.z);
}

export function getShadowTrackPointAtProgress(progress: number, model: EclipseTangentGeometry["model"]): EarthSurfaceLocalPoint | null {
  if (!getShadowAxisGeometry(progress, model).intersectsEarth) {
    return null;
  }

  return getEarthShadowSurfacePoint(progress, model).local;
}

export function getSweptShadowTrackPoints(progress: number, model: EclipseTangentGeometry["model"]): EarthSurfaceLocalPoint[] {
  const clampedProgress = clampVisual(progress, 0, 1);
  const sampleCount = Math.ceil(clampedProgress * 18) + 1;

  return Array.from({ length: sampleCount }, (_, index) => {
    const sampleProgress = sampleCount <= 1 ? 0 : (clampedProgress * index) / (sampleCount - 1);

    return getShadowTrackPointAtProgress(sampleProgress, model);
  }).filter((point): point is EarthSurfaceLocalPoint => point !== null);
}

function getCurrentShadowTrackPoints(progress: number, model: EclipseTangentGeometry["model"]): EarthSurfaceLocalPoint[] {
  const startProgress = clampVisual(progress - 0.025, 0, 1);
  const endProgress = clampVisual(progress + 0.025, 0, 1);
  const sampleCount = startProgress === endProgress ? 1 : 5;

  return Array.from({ length: sampleCount }, (_, index) => {
    const sampleProgress = sampleCount === 1 ? startProgress : startProgress + ((endProgress - startProgress) * index) / (sampleCount - 1);

    return getShadowTrackPointAtProgress(sampleProgress, model);
  }).filter((point): point is EarthSurfaceLocalPoint => point !== null);
}

function createEarthSurfaceTrackGeometry(points: EarthSurfaceLocalPoint[], halfWidth: number, zLift: number): THREE.BufferGeometry {
  const vertices: number[] = [];
  const indices: number[] = [];

  points.forEach((point) => {
    for (const side of [-1, 1]) {
      const surfacePoint = new THREE.Vector3(point.x, point.y + side * halfWidth, point.z);
      const normalizedSurfacePoint = surfacePoint.length() > 0 ? surfacePoint.normalize().multiplyScalar(earthRadius + zLift) : new THREE.Vector3(-earthRadius - zLift, 0, 0);

      vertices.push(normalizedSurfacePoint.x, normalizedSurfacePoint.y, normalizedSurfacePoint.z);
    }
  });

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = index * 2;
    const next = current + 2;

    indices.push(current, next, current + 1);
    indices.push(current + 1, next, next + 1);
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function EarthSurfaceTrackBand({
  name,
  points,
  halfWidth,
  zLift,
  color,
  opacity,
  visible = true,
  onClick
}: {
  name: string;
  points: EarthSurfaceLocalPoint[];
  halfWidth: number;
  zLift: number;
  color: string;
  opacity: number;
  visible?: boolean;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}) {
  const geometry = useMemo(() => createEarthSurfaceTrackGeometry(points, halfWidth, zLift), [halfWidth, points, zLift]);

  if (points.length < 2) {
    return null;
  }

  return (
    <mesh name={name} geometry={geometry} visible={visible} onClick={onClick}>
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function EarthShadowBands({
  tangentGeometry,
  time,
  onShadowPointSelect
}: {
  tangentGeometry: EclipseTangentGeometry;
  time: number;
  onShadowPointSelect: SolarEclipseCanvasProps["onShadowPointSelect"];
}) {
  const surfaceTrackModel = getEarthSurfaceTrackModel(tangentGeometry.model);
  const surfaceTrackGeometry = getEclipseTangentGeometry(time, surfaceTrackModel);
  const track = getShadowTrackGeometry(surfaceTrackGeometry);
  const sweptTrackPoints = useMemo(() => getSweptShadowTrackPoints(time, surfaceTrackModel), [surfaceTrackModel, time]);
  const currentTrackPoints = useMemo(() => getCurrentShadowTrackPoints(time, surfaceTrackModel), [surfaceTrackModel, time]);

  return (
    <group name="earth-eclipse-shadow-band-layer" position={earthPosition.toArray()}>
      <EarthSurfaceTrackBand name="earth-partial-eclipse-band" points={sweptTrackPoints} halfWidth={track.partialBandScaleY * 0.2} zLift={0.012} color="#1d4ed8" opacity={0.2} />
      <EarthSurfaceTrackBand name="earth-total-eclipse-band" points={sweptTrackPoints} halfWidth={getCentralShadowTrackHalfWidth(track.centralBandScaleY)} zLift={0.024} color="#020617" opacity={0.42} visible={tangentGeometry.model === "total"} />
      {tangentGeometry.model === "annular" ? (
        <EarthSurfaceTrackBand name="earth-annular-eclipse-band" points={sweptTrackPoints} halfWidth={getCentralShadowTrackHalfWidth(track.centralBandScaleY)} zLift={0.036} color="#020617" opacity={0.38} />
      ) : null}
      <EarthSurfaceTrackBand name="earth-penumbra-click-target" points={currentTrackPoints} halfWidth={penumbraHotZoneRadius * 0.22} zLift={0.048} color="#ffffff" opacity={0} onClick={(event) => onShadowPointSelect(getClickPoint(event, penumbraHotZoneRadius), "partial")} />
      <EarthSurfaceTrackBand name="earth-umbra-click-target" points={currentTrackPoints} halfWidth={umbraHotZoneRadius * 0.22} zLift={0.06} color="#ffffff" opacity={0} onClick={(event) => onShadowPointSelect(getClickPoint(event, umbraHotZoneRadius), "total")} />
      {tangentGeometry.model === "annular" ? (
        <EarthSurfaceTrackBand name="earth-antumbra-click-target" points={currentTrackPoints} halfWidth={umbraHotZoneRadius * 0.22} zLift={0.072} color="#ffffff" opacity={0} onClick={(event) => onShadowPointSelect(getClickPoint(event, umbraHotZoneRadius), "annular")} />
      ) : null}
    </group>
  );
}

function GroundCoronaGlow({ innerRadius, outerRadius, opacity }: { innerRadius: number; outerRadius: number; opacity: number }) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") {
      return null;
    }

    const size = 512;
    const center = size / 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    const inner = (innerRadius / outerRadius) * center;
    const gradient = context.createRadialGradient(center, center, inner, center, center, center);
    gradient.addColorStop(0, "rgba(219, 234, 254, 0)");
    gradient.addColorStop(0.04, "rgba(219, 234, 254, 0.78)");
    gradient.addColorStop(0.34, "rgba(147, 197, 253, 0.34)");
    gradient.addColorStop(0.68, "rgba(125, 211, 252, 0.13)");
    gradient.addColorStop(1, "rgba(219, 234, 254, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const coronaTexture = new THREE.CanvasTexture(canvas);
    coronaTexture.colorSpace = THREE.SRGBColorSpace;
    coronaTexture.needsUpdate = true;

    return coronaTexture;
  }, [innerRadius, outerRadius]);

  return (
    <mesh name="ground-solar-corona" position={[0, 0, -0.03]} renderOrder={0}>
      <planeGeometry args={[outerRadius * 2, outerRadius * 2]} />
      <meshBasicMaterial name="ground-solar-corona-material" map={texture ?? undefined} transparent opacity={opacity} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

function SpaceEclipseScene({ state, onShadowPointSelect }: { state: SolarEclipseState; onShadowPointSelect: SolarEclipseCanvasProps["onShadowPointSelect"] }) {
  const tangentGeometry = getEclipseTangentGeometry(state.time, state.eclipseModel);
  const shadowProjection = getSpaceShadowProjectionGeometry(tangentGeometry);
  const moon = tangentGeometry.moon;
  const moonRadius = tangentGeometry.moonRadius;
  const moonPosition = new THREE.Vector3(moon.x, moon.y, moon.z);
  const axisGeometry = getShadowAxisGeometry(state.time, tangentGeometry.model);
  const shadowSurfacePoint = getEarthShadowSurfacePoint(state.time, tangentGeometry.model);
  const shadowFar = new THREE.Vector3(shadowSurfacePoint.world.x, shadowSurfacePoint.world.y, shadowSurfacePoint.world.z);
  const moonShadowStart = new THREE.Vector3(moon.x, moon.y, moon.z);
  const surfaceStopProgress = clampVisual(axisGeometry.axisEnd.distanceTo(moonShadowStart) / Math.max(0.0001, shadowFar.distanceTo(moonShadowStart)), 0, 1);
  const penumbraSurfaceRadius = Math.max(0.18, shadowProjection.penumbraRadiusAtEarth);
  const centralSurfaceRadius = Math.max(0.025, moonRadius * 0.96 + (shadowProjection.centralRadiusAtEarth - moonRadius * 0.96) * surfaceStopProgress);
  const penumbraStartRadius = moonRadius * 0.92;
  const centralStartRadius = moonRadius * 0.96;
  const penumbraFillEnd = getPenumbraShadowVolumeAxisEndPoint(state.time, tangentGeometry.model);
  const penumbraFarRadius = penumbraSurfaceRadius;
  const umbraEnd =
    state.eclipseModel === "annular"
      ? new THREE.Vector3(shadowProjection.umbraTip.x, shadowProjection.umbraTip.y, shadowProjection.umbraTip.z)
      : axisGeometry.axisEnd;
  const antumbraStart = new THREE.Vector3(shadowProjection.umbraTip.x, shadowProjection.umbraTip.y, shadowProjection.umbraTip.z);
  const antumbraFillEnd = axisGeometry.axisEnd;
  const antumbraFarRadius = Math.max(0.026, getCentralShadowTrackHalfWidth(getShadowTrackGeometry(getEclipseTangentGeometry(state.time, "total")).centralBandScaleY));
  const penumbraFrontEarthZ = shadowProjection.centerAtEarth.z - shadowProjection.penumbraRadiusAtEarth;
  const penumbraBackEarthZ = shadowProjection.centerAtEarth.z + shadowProjection.penumbraRadiusAtEarth;
  const umbraFrontEarthZ = shadowProjection.centerAtEarth.z + shadowProjection.centralRadiusAtEarth;
  const umbraBackEarthZ = shadowProjection.centerAtEarth.z - shadowProjection.centralRadiusAtEarth;
  const umbraYUpperEnd =
    state.eclipseModel === "annular"
      ? antumbraStart
      : new THREE.Vector3(earthPosition.x, tangentGeometry.umbra.upperEarthY, shadowProjection.centerAtEarth.z);
  const umbraYLowerEnd =
    state.eclipseModel === "annular"
      ? antumbraStart
      : new THREE.Vector3(earthPosition.x, tangentGeometry.umbra.lowerEarthY, shadowProjection.centerAtEarth.z);
  const umbraZFrontEnd =
    state.eclipseModel === "annular"
      ? antumbraStart
      : new THREE.Vector3(earthPosition.x, shadowProjection.centerAtEarth.y, umbraFrontEarthZ);
  const umbraZBackEnd =
    state.eclipseModel === "annular"
      ? antumbraStart
      : new THREE.Vector3(earthPosition.x, shadowProjection.centerAtEarth.y, umbraBackEarthZ);
  const antumbraYUpperEnd = axisGeometry.axisEnd.clone().add(new THREE.Vector3(0, antumbraFarRadius, 0));
  const antumbraYLowerEnd = axisGeometry.axisEnd.clone().add(new THREE.Vector3(0, -antumbraFarRadius, 0));
  const antumbraZFrontEnd = axisGeometry.axisEnd.clone().add(new THREE.Vector3(0, 0, antumbraFarRadius));
  const antumbraZBackEnd = axisGeometry.axisEnd.clone().add(new THREE.Vector3(0, 0, -antumbraFarRadius));

  return (
    <>
      <ambientLight intensity={0.16} />
      <pointLight position={sunPosition.toArray()} intensity={840} color="#ffd36a" />
      <group name="eclipse-sun-body" position={sunPosition.toArray()}>
        <EclipseBody bodyId="sun" radius={0.68} />
      </group>
      <MoonOrbitGuide orbitRadius={Math.hypot(moon.x - earthPosition.x, moon.y - earthPosition.y, moon.z)} />
      <group name="eclipse-moon-body" position={moonPosition.toArray()}>
        <EclipseBody bodyId="moon" radius={moonRadius} />
      </group>
      <group name="eclipse-shadow-tangent-boundaries">
        <TangentLine name="eclipse-penumbra-y-upper-tangent" points={[new THREE.Vector3(sunPosition.x, spaceSun.radius, 0), new THREE.Vector3(moon.x, moon.y - moonRadius, moon.z), new THREE.Vector3(earthPosition.x, tangentGeometry.penumbra.upperEarthY, shadowProjection.centerAtEarth.z)]} color="#94a3b8" opacity={0.42} />
        <TangentLine name="eclipse-penumbra-y-lower-tangent" points={[new THREE.Vector3(sunPosition.x, -spaceSun.radius, 0), new THREE.Vector3(moon.x, moon.y + moonRadius, moon.z), new THREE.Vector3(earthPosition.x, tangentGeometry.penumbra.lowerEarthY, shadowProjection.centerAtEarth.z)]} color="#94a3b8" opacity={0.42} />
        <TangentLine name="eclipse-umbra-y-upper-tangent" points={[new THREE.Vector3(sunPosition.x, spaceSun.radius, 0), new THREE.Vector3(moon.x, moon.y + moonRadius, moon.z), umbraYUpperEnd]} color="#f8fafc" opacity={0.68} />
        <TangentLine name="eclipse-umbra-y-lower-tangent" points={[new THREE.Vector3(sunPosition.x, -spaceSun.radius, 0), new THREE.Vector3(moon.x, moon.y - moonRadius, moon.z), umbraYLowerEnd]} color="#f8fafc" opacity={0.68} />
        <TangentLine name="eclipse-penumbra-z-front-tangent" points={[new THREE.Vector3(sunPosition.x, 0, spaceSun.radius), new THREE.Vector3(moon.x, moon.y, moon.z - moonRadius), new THREE.Vector3(earthPosition.x, shadowProjection.centerAtEarth.y, penumbraFrontEarthZ)]} color="#94a3b8" opacity={0.36} />
        <TangentLine name="eclipse-penumbra-z-back-tangent" points={[new THREE.Vector3(sunPosition.x, 0, -spaceSun.radius), new THREE.Vector3(moon.x, moon.y, moon.z + moonRadius), new THREE.Vector3(earthPosition.x, shadowProjection.centerAtEarth.y, penumbraBackEarthZ)]} color="#94a3b8" opacity={0.36} />
        <TangentLine name="eclipse-umbra-z-front-tangent" points={[new THREE.Vector3(sunPosition.x, 0, spaceSun.radius), new THREE.Vector3(moon.x, moon.y, moon.z + moonRadius), umbraZFrontEnd]} color="#f8fafc" opacity={0.6} />
        <TangentLine name="eclipse-umbra-z-back-tangent" points={[new THREE.Vector3(sunPosition.x, 0, -spaceSun.radius), new THREE.Vector3(moon.x, moon.y, moon.z - moonRadius), umbraZBackEnd]} color="#f8fafc" opacity={0.6} />
        {state.eclipseModel === "annular" ? (
          <>
            <TangentLine name="eclipse-antumbra-y-upper-tangent" points={[antumbraStart, antumbraYUpperEnd]} color="#f8fafc" opacity={0.44} />
            <TangentLine name="eclipse-antumbra-y-lower-tangent" points={[antumbraStart, antumbraYLowerEnd]} color="#f8fafc" opacity={0.44} />
            <TangentLine name="eclipse-antumbra-z-front-tangent" points={[antumbraStart, antumbraZFrontEnd]} color="#f8fafc" opacity={0.38} />
            <TangentLine name="eclipse-antumbra-z-back-tangent" points={[antumbraStart, antumbraZBackEnd]} color="#f8fafc" opacity={0.38} />
          </>
        ) : null}
        <TangentLine name="eclipse-shadow-axis-surface-contact" points={[new THREE.Vector3(moon.x, moon.y, moon.z), axisGeometry.axisEnd]} color="#60a5fa" opacity={0.5} />
        <ShadowConicVolume name="eclipse-penumbra-volume" start={moonShadowStart} end={penumbraFillEnd} startRadius={penumbraStartRadius} endRadius={penumbraFarRadius} color="#3b82f6" opacity={0.11} renderOrder={1} />
        <ShadowConicVolume name="eclipse-umbra-volume" start={moonShadowStart} end={umbraEnd} startRadius={moonRadius * 0.96} endRadius={state.eclipseModel === "annular" ? 0.012 : centralSurfaceRadius} color="#020617" opacity={0.24} renderOrder={2} />
        {state.eclipseModel === "annular" ? (
          <ShadowConicVolume name="eclipse-antumbra-volume" start={antumbraStart} end={antumbraFillEnd} startRadius={0.018} endRadius={antumbraFarRadius} color="#020617" opacity={0.18} renderOrder={3} />
        ) : null}
      </group>
      <group name="eclipse-earth-body" position={earthPosition.toArray()} rotation={[0, 1.75, 0]}>
        <EclipseBody bodyId="earth" radius={earthRadius} />
      </group>
      <EarthShadowBands tangentGeometry={tangentGeometry} time={state.time} onShadowPointSelect={onShadowPointSelect} />
    </>
  );
}

function GroundEclipseScene({ state }: { state: SolarEclipseState }) {
  const appearance = getGroundEclipseAppearance(state);
  const sunAsset = getSurfaceAsset("sun");
  const sunTexture = useImageTexture(sunAsset?.localPath);
  const coronaInnerRadius = Math.max(appearance.sunRadius * 1.02, appearance.moonRadius * 1.01);

  return (
    <group name="ground-eclipse-disc-view">
      <GroundCoronaGlow innerRadius={coronaInnerRadius} outerRadius={appearance.sunRadius * 1.58} opacity={appearance.coronaOpacity} />
      <mesh name="ground-sun-disc" position={[0, 0, 0]} renderOrder={1}>
        <circleGeometry args={[appearance.sunRadius, 192]} />
        <meshBasicMaterial name="ground-sun-disc-material" map={sunTexture ?? undefined} color={sunTexture ? "#fff2a8" : "#ff8a20"} toneMapped={false} />
      </mesh>
      <mesh name="ground-annular-light-ring" position={[0, 0, 0.02]} renderOrder={2}>
        <ringGeometry args={[Math.min(appearance.moonRadius, appearance.sunRadius * 0.98), appearance.sunRadius, 192]} />
        <meshBasicMaterial name="ground-annular-light-ring-material" color="#fff3b0" transparent opacity={appearance.ringOpacity} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh name="ground-moon-occluder" position={[appearance.moonOffset.x, appearance.moonOffset.y, 0.04]} renderOrder={3}>
        <circleGeometry args={[appearance.moonRadius, 192]} />
        <meshBasicMaterial name="ground-moon-occluder-material" color="#020617" />
      </mesh>
    </group>
  );
}

export function SolarEclipseCanvas({ state, view, onShadowPointSelect }: SolarEclipseCanvasProps) {
  const isSpaceView = view === "space";
  const cameraPosition: [number, number, number] = isSpaceView ? [0.05, 1.45, 6.45] : [0, 0, 6.2];

  return (
    <section className="relative h-[min(72vh,760px)] min-h-[560px] bg-[#03050b]">
      <Canvas camera={{ position: cameraPosition, fov: isSpaceView ? 50 : 38 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
        <color attach="background" args={["#03050b"]} />
        {isSpaceView ? <SpaceEclipseScene state={state} onShadowPointSelect={onShadowPointSelect} /> : <GroundEclipseScene state={state} />}
        <OrbitControls
          enableDamping={isSpaceView}
          dampingFactor={0.08}
          enableRotate={isSpaceView}
          enablePan={false}
          enableZoom={isSpaceView}
          minDistance={2.4}
          maxDistance={6.4}
          target={[0, 0, 0]}
        />
      </Canvas>
    </section>
  );
}
