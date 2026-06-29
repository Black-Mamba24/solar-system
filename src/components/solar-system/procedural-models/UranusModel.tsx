import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { buildRingParticlePositions } from "./geometry";
import { AtmosphereShell } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

function createUranusAtmosphereTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) {
    return undefined;
  }

  const latitudeGradient = context.createLinearGradient(0, 0, 0, canvas.height);
  latitudeGradient.addColorStop(0, "rgba(205, 255, 241, 0.28)");
  latitudeGradient.addColorStop(0.16, "rgba(170, 239, 229, 0.18)");
  latitudeGradient.addColorStop(0.5, "rgba(95, 191, 212, 0.08)");
  latitudeGradient.addColorStop(0.84, "rgba(165, 236, 224, 0.18)");
  latitudeGradient.addColorStop(1, "rgba(216, 255, 244, 0.3)");
  context.fillStyle = latitudeGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 26; index += 1) {
    const x = ((index * 379) % canvas.width) + 28;
    const y = index % 2 === 0 ? 144 + ((index * 43) % 170) : 710 + ((index * 31) % 150);
    const width = 130 + ((index * 23) % 210);
    const height = 12 + ((index * 11) % 28);
    const cloud = context.createRadialGradient(x, y, 2, x, y, width * 0.58);
    cloud.addColorStop(0, "rgba(238, 255, 247, 0.22)");
    cloud.addColorStop(0.45, "rgba(178, 245, 238, 0.1)");
    cloud.addColorStop(1, "rgba(178, 245, 238, 0)");
    context.fillStyle = cloud;
    context.beginPath();
    context.ellipse(x, y, width, height, ((index % 5) - 2) * 0.08, 0, Math.PI * 2);
    context.fill();
  }
  context.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function createUranusRingTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) {
    return undefined;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  const rings = [
    { start: 0.08, end: 0.12, alpha: 0.1 },
    { start: 0.22, end: 0.24, alpha: 0.14 },
    { start: 0.36, end: 0.39, alpha: 0.09 },
    { start: 0.54, end: 0.57, alpha: 0.16 },
    { start: 0.74, end: 0.79, alpha: 0.12 },
    { start: 0.9, end: 0.93, alpha: 0.18 }
  ];

  for (const ring of rings) {
    const x = ring.start * canvas.width;
    const width = (ring.end - ring.start) * canvas.width;
    const gradient = context.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, "rgba(25, 29, 32, 0)");
    gradient.addColorStop(0.48, `rgba(48, 45, 41, ${ring.alpha})`);
    gradient.addColorStop(1, "rgba(25, 29, 32, 0)");
    context.fillStyle = gradient;
    context.fillRect(x, 0, width, canvas.height);
  }

  for (let index = 0; index < 240; index += 1) {
    const x = (index * 131) % canvas.width;
    const y = (index * 47) % canvas.height;
    const alpha = 0.012 + ((index * 17) % 24) / 1000;
    context.fillStyle = `rgba(120, 118, 112, ${alpha})`;
    context.fillRect(x, y, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function buildUranusEpsilonRingClumps(radius: number): Float32Array {
  const count = 180;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const cluster = index % 3;
    const baseAngle = [-0.82, 0.36, 1.74][cluster];
    const spread = ((index * 37) % 100) / 100 - 0.5;
    const angle = baseAngle + spread * 0.28;
    const radial = radius * (1.86 + (((index * 19) % 100) / 100 - 0.5) * 0.06);
    positions[index * 3] = Math.cos(angle) * radial;
    positions[index * 3 + 1] = Math.sin(angle) * radial;
    positions[index * 3 + 2] = ((((index * 29) % 100) / 100) - 0.5) * radius * 0.012;
  }
  return positions;
}

export function UranusModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const geometry = useMemo(() => {
    const sphere = new THREE.SphereGeometry(radius, 176, 104);
    sphere.scale(1, 0.982, 1);
    return sphere;
  }, [radius]);
  const ringGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.33, radius * 2.02, 260), [radius]);
  const sunlitRingArcGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.45, radius * 1.94, 140, 1, -0.42, 1.16), [radius]);
  const shadowRingScatterGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.38, radius * 1.98, 150, 1, Math.PI + 0.34, 1.02), [radius]);
  const particlePositions = useMemo(() => buildRingParticlePositions({ innerRadius: radius * 1.34, outerRadius: radius * 2.01, count: 760, seed: 77, verticalScale: radius * 0.018 }), [radius]);
  const epsilonClumpPositions = useMemo(() => buildUranusEpsilonRingClumps(radius), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);
  const atmosphereTexture = useMemo(() => createUranusAtmosphereTexture(), []);
  const ringTexture = useMemo(() => createUranusRingTexture(), []);

  useEffect(
    () => () => {
      atmosphereTexture?.dispose();
      ringTexture?.dispose();
    },
    [atmosphereTexture, ringTexture]
  );

  return (
    <group name="uranus-image-based-ice-giant-model" scale={selected ? 1.08 : 1}>
      <mesh name="uranus-surface" geometry={geometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.005}
          color={surfaceTexture ? "#a9e9e5" : "#8bd3d5"}
          roughness={0.9}
          metalness={0.004}
          emissive={selected ? "#2b878c" : "#020809"}
          emissiveIntensity={selected ? 0.045 : 0.006}
        />
      </mesh>
      <mesh name="uranus-seasonal-methane-cloud-layer" geometry={geometry} scale={1.008}>
        <meshStandardMaterial map={atmosphereTexture ?? undefined} color="#d6fff4" transparent opacity={0.34} blending={THREE.AdditiveBlending} roughness={0.96} depthWrite={false} />
      </mesh>
      <mesh name="uranus-polar-haze-cap" position={[0, radius * 0.966, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.36, 64]} />
        <meshStandardMaterial color="#e0fff6" transparent opacity={0.18} roughness={0.96} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <AtmosphereShell name="uranus-cold-methane-atmosphere" radius={radius} color="#9ee9ed" opacity={0.07} scale={1.07} />
      <group name="uranus-dark-ring-system" rotation={[Math.PI / 2, 0, 0]}>
        <mesh name="uranus-textured-ring-plane" geometry={ringGeometry}>
          <meshStandardMaterial map={ringTexture ?? undefined} color="#2b2824" transparent opacity={0.28} side={THREE.DoubleSide} roughness={0.96} metalness={0.01} depthWrite={false} />
        </mesh>
        <mesh name="uranus-ring-sunlit-edge-highlight" geometry={sunlitRingArcGeometry}>
          <meshStandardMaterial color="#746f64" transparent opacity={0.1} side={THREE.DoubleSide} roughness={0.88} metalness={0.01} depthWrite={false} />
        </mesh>
        <mesh name="uranus-ring-shadow-side-scatter" geometry={shadowRingScatterGeometry}>
          <meshStandardMaterial color="#1d221f" transparent opacity={0.055} side={THREE.DoubleSide} roughness={0.98} metalness={0} depthWrite={false} />
        </mesh>
        <points name="uranus-epsilon-ring-density-clumps">
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[epsilonClumpPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#8a877f" size={0.012} sizeAttenuation transparent opacity={0.18} />
        </points>
        <points name="uranus-dark-ring-dust">
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#6a6760" size={0.01} sizeAttenuation transparent opacity={0.12} />
        </points>
      </group>
    </group>
  );
}
