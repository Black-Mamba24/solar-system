"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useImageTexture } from "@/components/solar-system/procedural-models/useImageTexture";
import { assetSources } from "@/data/assets";
import { withBasePath } from "@/lib/base-path";
import {
  getLunarEclipseGeometry,
  lunarEclipseEarth,
  lunarEclipseMoon,
  lunarEclipseSun,
  type LunarEclipseState
} from "@/lib/lunar-eclipse";
import { getGroundEarthViewShadowDisc, getGroundMoonBaseTexturePath, getGroundMoonRenderModel, getLunarEclipseShadowConeProfile, getLunarEclipseSunRayLines, getLunarEclipseTangentLines, getSpaceMoonSurfaceEffect, type GroundEarthViewShadowDisc } from "./lunar-eclipse-visual";

interface LunarEclipseCanvasProps {
  state: LunarEclipseState;
}

function getSurfacePath(bodyId: string): string | undefined {
  return assetSources.find((asset) => asset.bodyId === bodyId && asset.purpose === "surface")?.localPath;
}

function TexturedBody({ bodyId, radius, emissive = "#000000", color = "#ffffff" }: { bodyId: string; radius: number; emissive?: string; color?: string }) {
  const texture = useImageTexture(getSurfacePath(bodyId));
  const geometry = useMemo(() => new THREE.SphereGeometry(radius, 128, 72), [radius]);

  if (bodyId === "sun") {
    return (
      <mesh name="lunar-eclipse-sun-surface" geometry={geometry}>
        <meshBasicMaterial map={texture ?? undefined} color={texture ? "#fff2a8" : "#fbbf24"} toneMapped={false} />
      </mesh>
    );
  }

  return (
    <mesh name={`lunar-eclipse-${bodyId}-surface`} geometry={geometry}>
      <meshStandardMaterial map={texture ?? undefined} bumpMap={texture ?? undefined} bumpScale={radius * 0.035} color={texture ? color : color} roughness={0.92} metalness={0.01} emissive={emissive} emissiveIntensity={0.12} />
    </mesh>
  );
}

function ConeVolume({ name, start, end, startRadius, endRadius, color, opacity }: { name: string; start: THREE.Vector3; end: THREE.Vector3; startRadius: number; endRadius: number; color: string; opacity: number }) {
  const { center, length, quaternion } = useMemo(() => {
    const axis = end.clone().sub(start);
    const lengthValue = axis.length();
    const direction = lengthValue > 0 ? axis.clone().normalize() : new THREE.Vector3(1, 0, 0);

    return {
      center: start.clone().add(end).multiplyScalar(0.5),
      length: lengthValue,
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
    };
  }, [end, start]);

  return (
    <mesh name={name} position={center.toArray()} quaternion={quaternion}>
      <cylinderGeometry args={[endRadius, startRadius, length, 96, 4, true]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} wireframe depthWrite={false} />
    </mesh>
  );
}

function AxisLine({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints([start, end]), [end, start]);

  return (
    <line name="lunar-eclipse-shadow-axis">
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial attach="material" color="#93c5fd" transparent opacity={0.56} />
    </line>
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

function SunRayLine({ name, start, end, kind }: { name: string; start: THREE.Vector3; end: THREE.Vector3; kind: "umbra-boundary" | "penumbra-boundary" }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints([start, end]), [end, start]);

  return (
    <line name={name}>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial attach="material" color={kind === "umbra-boundary" ? "#f8fafc" : "#fde68a"} transparent opacity={kind === "umbra-boundary" ? 0.62 : 0.5} />
    </line>
  );
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));

  return t * t * (3 - 2 * t);
}

function useLoadedImage(path: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let cancelled = false;
    const nextImage = new Image();
    nextImage.onload = () => {
      if (!cancelled) {
        setImage(nextImage);
      }
    };
    nextImage.src = withBasePath(path);

    return () => {
      cancelled = true;
    };
  }, [path]);

  return image;
}

const spaceMoonVertexShader = `
  varying vec2 vUv;
  varying vec3 vLocalPosition;

  void main() {
    vUv = uv;
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const spaceMoonFragmentShader = `
  uniform sampler2D moonMap;
  uniform vec2 shadowCenter;
  uniform float penumbraRadius;
  uniform float umbraRadius;
  uniform float penumbraCoverage;
  uniform float umbraCoverage;
  uniform float totality;
  varying vec2 vUv;
  varying vec3 vLocalPosition;

  void main() {
    vec3 baseColor = texture2D(moonMap, vUv).rgb;
    float distanceToShadow = length(vec2(vLocalPosition.y, vLocalPosition.z) - shadowCenter);
    float penumbra = 1.0 - smoothstep(penumbraRadius - 0.035, penumbraRadius + 0.035, distanceToShadow);
    float umbra = 1.0 - smoothstep(umbraRadius - 0.015, umbraRadius + 0.015, distanceToShadow);
    vec3 localNormal = normalize(vLocalPosition);
    float earthFacing = smoothstep(0.18, 0.82, dot(localNormal, vec3(-1.0, 0.0, 0.0)) * 0.5 + 0.5);
    float globalPenumbraDimming = penumbraCoverage * 0.18;
    float umbralDarkening = mix(0.97, 0.98, totality);
    float brightness = max(0.018, 1.0 - globalPenumbraDimming - penumbra * 0.06 - umbra * umbralDarkening);
    vec3 darkenedMoon = baseColor * brightness;
    vec3 atmosphericRed = vec3(0.58, 0.058, 0.018) + baseColor * 0.04;
    float redMix = umbra * earthFacing * totality * 0.92;

    gl_FragColor = vec4(mix(darkenedMoon, atmosphericRed, redMix), 1.0);
  }
`;

const totalityMoonFragmentShader = `
  varying vec3 vLocalPosition;

  void main() {
    vec3 localNormal = normalize(vLocalPosition);
    float earthFacing = smoothstep(-0.45, 0.35, dot(localNormal, vec3(-1.0, 0.0, 0.0)));
    vec3 darkSide = vec3(0.012, 0.006, 0.005);
    vec3 refractedRed = vec3(0.48, 0.035, 0.018);

    gl_FragColor = vec4(mix(darkSide, refractedRed, earthFacing), 1.0);
  }
`;

function SpaceEclipsedMoon({ state }: { state: LunarEclipseState }) {
  const texture = useImageTexture(getSurfacePath("moon"));
  const geometry = useMemo(() => new THREE.SphereGeometry(lunarEclipseMoon.radius, 128, 72), []);
  const effect = getSpaceMoonSurfaceEffect(state);
  const uniforms = useMemo(
    () => ({
      moonMap: { value: texture },
      shadowCenter: { value: new THREE.Vector2(effect.shadowCenterY, effect.shadowCenterZ) },
      penumbraRadius: { value: effect.penumbraRadius },
      umbraRadius: { value: effect.umbraRadius },
      penumbraCoverage: { value: effect.penumbraCoverage },
      umbraCoverage: { value: effect.umbraCoverage },
      totality: { value: effect.totality ? 1 : 0 }
    }),
    [effect.penumbraCoverage, effect.penumbraRadius, effect.shadowCenterY, effect.shadowCenterZ, effect.totality, effect.umbraCoverage, effect.umbraRadius, texture]
  );

  if (effect.totality) {
    return (
      <mesh name="lunar-eclipse-moon-surface" geometry={geometry}>
        <shaderMaterial vertexShader={spaceMoonVertexShader} fragmentShader={totalityMoonFragmentShader} toneMapped={false} />
      </mesh>
    );
  }

  if (!texture) {
    return (
      <mesh name="lunar-eclipse-moon-surface" geometry={geometry}>
        <meshBasicMaterial color={effect.totality ? "#7f1d1d" : "#6b7280"} toneMapped={false} />
      </mesh>
    );
  }

  return (
    <mesh name="lunar-eclipse-moon-surface" geometry={geometry}>
      <shaderMaterial uniforms={uniforms} vertexShader={spaceMoonVertexShader} fragmentShader={spaceMoonFragmentShader} toneMapped={false} />
    </mesh>
  );
}

function drawNasaMoonDisc(context: CanvasRenderingContext2D, image: HTMLImageElement, center: number, radius: number) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  const sourceSize = Math.min(imageWidth, imageHeight) * 0.88;
  const sourceX = (imageWidth - sourceSize) / 2;
  const sourceY = (imageHeight - sourceSize) / 2;
  const destination = center - radius;

  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, destination, destination, radius * 2, radius * 2);

  const rimGradient = context.createRadialGradient(center, center, radius * 0.7, center, center, radius);
  rimGradient.addColorStop(0, "rgba(255,255,255,0)");
  rimGradient.addColorStop(0.86, "rgba(255,255,255,0.04)");
  rimGradient.addColorStop(1, "rgba(0,0,0,0.32)");
  context.fillStyle = rimGradient;
  context.fillRect(0, 0, center * 2, center * 2);
}

function drawGroundUmbraDisc(context: CanvasRenderingContext2D, center: number, radius: number, shadowDisc: GroundEarthViewShadowDisc | null) {
  if (!shadowDisc) {
    return;
  }

  const boundaryWidth = radius * 0.08;
  const shadowX = center + shadowDisc.centerX;
  const shadowY = center + shadowDisc.centerY;
  const innerRadius = Math.max(0, shadowDisc.radius - boundaryWidth);
  const outerRadius = shadowDisc.radius + boundaryWidth;
  const shadowGradient = context.createRadialGradient(shadowX, shadowY, innerRadius, shadowX, shadowY, outerRadius);
  shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${shadowDisc.opacity})`);
  shadowGradient.addColorStop(0.72, `rgba(0, 0, 0, ${shadowDisc.opacity * 0.92})`);
  shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.fillStyle = shadowGradient;
  context.beginPath();
  context.arc(shadowX, shadowY, outerRadius, 0, Math.PI * 2);
  context.fill();
}

function getGroundVisualUmbraCoverage(state: LunarEclipseState, physicalCoverage: number): number {
  if (state.eclipseCase === "partial") {
    return physicalCoverage;
  }

  if (state.time <= 0.5) {
    return smoothstep(0.3, 0.46, state.time);
  }

  return 1 - smoothstep(0.56, 0.72, state.time);
}

function getGroundVisualTotalRed(state: LunarEclipseState, visualCoverage: number): number {
  if (state.eclipseCase !== "total") {
    return 0;
  }

  const enteringRed = smoothstep(0.46, 0.52, state.time);
  const leavingRed = 1 - smoothstep(0.56, 0.66, state.time);

  return Math.min(visualCoverage, enteringRed, leavingRed);
}

function createGroundMoonTexture(state: LunarEclipseState, moonImage: HTMLImageElement | null): THREE.CanvasTexture | null {
  if (typeof document === "undefined") {
    return null;
  }

  if (!moonImage) {
    return null;
  }

  const model = getGroundMoonRenderModel(state);
  const size = 768;
  const center = size / 2;
  const radius = center * 0.92;
  const penumbraDimming = model.penumbraCoverage * 0.2;
  const shadowDisc = getGroundEarthViewShadowDisc(state, radius);
  const visualUmbraCoverage = getGroundVisualUmbraCoverage(state, model.umbraCoverage);
  const totalRed = getGroundVisualTotalRed(state, visualUmbraCoverage);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, size, size);
  context.save();
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.clip();

  drawNasaMoonDisc(context, moonImage, center, radius);

  if (penumbraDimming > 0) {
    context.fillStyle = `rgba(8, 10, 18, ${penumbraDimming})`;
    context.fillRect(0, 0, size, size);
  }

  drawGroundUmbraDisc(context, center, radius, shadowDisc);

  if (model.totalCase && totalRed > 0) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = totalRed * 0.1;
    drawNasaMoonDisc(context, moonImage, center, radius);
    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = `rgba(105, 24, 10, ${0.18 + totalRed * 0.26})`;
    context.fillRect(0, 0, size, size);
    context.globalCompositeOperation = "soft-light";
    context.fillStyle = `rgba(198, 58, 22, ${0.16 + totalRed * 0.14})`;
    context.fillRect(0, 0, size, size);
    context.globalCompositeOperation = "multiply";
    context.fillStyle = `rgba(82, 22, 14, ${0.16 + totalRed * 0.12})`;
    context.fillRect(0, 0, size, size);
    context.globalCompositeOperation = "source-over";
  }

  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function GroundEclipseMoon({ state }: { state: LunarEclipseState }) {
  const moonImage = useLoadedImage(getGroundMoonBaseTexturePath());
  const texture = useMemo(() => createGroundMoonTexture(state, moonImage), [moonImage, state]);

  useEffect(
    () => () => {
      texture?.dispose();
    },
    [texture]
  );

  if (!texture) {
    return null;
  }

  return (
    <mesh name="lunar-eclipse-ground-nasa-moon">
      <planeGeometry args={[2.44, 2.44]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

function SpaceScene({ state }: { state: LunarEclipseState }) {
  const geometry = getLunarEclipseGeometry(state);
  const sunPosition = new THREE.Vector3(lunarEclipseSun.x, lunarEclipseSun.y, lunarEclipseSun.z);
  const earthPosition = new THREE.Vector3(lunarEclipseEarth.x, lunarEclipseEarth.y, lunarEclipseEarth.z);
  const moonPosition = new THREE.Vector3(geometry.moon.x, geometry.moon.y, geometry.moon.z);
  const axisEnd = new THREE.Vector3(geometry.shadowAxis.end.x, geometry.shadowAxis.end.y, geometry.shadowAxis.end.z);
  const tangentLines = getLunarEclipseTangentLines();
  const sunRays = getLunarEclipseSunRayLines();
  const coneProfile = getLunarEclipseShadowConeProfile();

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={sunPosition.toArray()} intensity={680} color="#ffd36a" />
      <group name="lunar-eclipse-sun" position={sunPosition.toArray()}>
        <TexturedBody bodyId="sun" radius={lunarEclipseSun.radius} />
      </group>
      <group name="lunar-eclipse-earth" position={earthPosition.toArray()} rotation={[0, 1.2, 0]}>
        <TexturedBody bodyId="earth" radius={lunarEclipseEarth.radius} color="#dbeafe" emissive="#020617" />
      </group>
      <group name="lunar-eclipse-moon" position={moonPosition.toArray()}>
        <SpaceEclipsedMoon state={state} />
      </group>
      <group name="lunar-eclipse-sun-ray-fan">
        {sunRays.map((line, index) => (
          <SunRayLine
            key={index}
            name={`lunar-eclipse-sun-ray-${index}`}
            start={new THREE.Vector3(line.start.x, line.start.y, line.start.z)}
            end={new THREE.Vector3(line.end.x, line.end.y, line.end.z)}
            kind={line.kind}
          />
        ))}
      </group>
      <group name="lunar-eclipse-sun-earth-tangent-boundaries">
        {tangentLines.map((line, index) => (
          <TangentLine
            key={`${line.kind}-${index}`}
            name={`lunar-eclipse-${line.kind}-tangent-${index}`}
            points={[new THREE.Vector3(line.start.x, line.start.y, line.start.z), new THREE.Vector3(line.through.x, line.through.y, line.through.z), new THREE.Vector3(line.end.x, line.end.y, line.end.z)]}
            color={line.kind === "umbra" ? "#f8fafc" : "#60a5fa"}
            opacity={line.kind === "umbra" ? 0.62 : 0.38}
          />
        ))}
      </group>
      <group name="lunar-eclipse-earth-shadow-cones">
        <ConeVolume name="lunar-eclipse-penumbra-volume" start={earthPosition} end={axisEnd} startRadius={coneProfile.penumbraStartRadius} endRadius={coneProfile.penumbraEndRadius} color="#60a5fa" opacity={0.13} />
        <ConeVolume name="lunar-eclipse-umbra-volume" start={earthPosition} end={axisEnd} startRadius={coneProfile.umbraStartRadius} endRadius={coneProfile.umbraEndRadius} color="#020617" opacity={0.32} />
      </group>
      <AxisLine start={earthPosition} end={axisEnd} />
    </>
  );
}

function GroundScene({ state }: { state: LunarEclipseState }) {
  return (
    <>
      <ambientLight intensity={0.92} />
      <group name="lunar-eclipse-earth-view-moon">
        <GroundEclipseMoon state={state} />
      </group>
    </>
  );
}

export function LunarEclipseCanvas({ state }: LunarEclipseCanvasProps) {
  const cameraPosition: [number, number, number] = state.mainView === "space" ? [0.2, 2.35, 6.4] : [0, 0, 4.8];

  return (
    <Canvas camera={{ position: cameraPosition, fov: state.mainView === "space" ? 45 : 34 }} dpr={[1, 1.8]} gl={{ antialias: true, preserveDrawingBuffer: true }}>
      <color attach="background" args={["#020617"]} />
      {state.mainView === "space" ? <SpaceScene state={state} /> : <GroundScene state={state} />}
      <OrbitControls enablePan={false} enableZoom={state.mainView === "space"} enableRotate={state.mainView === "space"} />
    </Canvas>
  );
}
