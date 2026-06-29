import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { buildRingParticlePositions } from "./geometry";
import { AtmosphereShell, SphericalPatch } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

function createNeptuneStormTexture(): THREE.CanvasTexture | undefined {
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

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "screen";

  const jetBands = [
    { y: 248, height: 20, alpha: 0.08 },
    { y: 366, height: 14, alpha: 0.1 },
    { y: 612, height: 18, alpha: 0.09 },
    { y: 748, height: 16, alpha: 0.08 }
  ];
  for (const band of jetBands) {
    const gradient = context.createLinearGradient(0, band.y, canvas.width, band.y);
    gradient.addColorStop(0, "rgba(91, 153, 255, 0)");
    gradient.addColorStop(0.22, `rgba(141, 195, 255, ${band.alpha})`);
    gradient.addColorStop(0.5, "rgba(225, 242, 255, 0.05)");
    gradient.addColorStop(0.78, `rgba(98, 166, 255, ${band.alpha})`);
    gradient.addColorStop(1, "rgba(91, 153, 255, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(canvas.width / 2, band.y, canvas.width * 0.58, band.height, 0.018, 0, Math.PI * 2);
    context.fill();
  }

  const darkSpotX = 750;
  const darkSpotY = 632;
  context.globalCompositeOperation = "source-over";
  const spot = context.createRadialGradient(darkSpotX, darkSpotY, 12, darkSpotX, darkSpotY, 180);
  spot.addColorStop(0, "rgba(2, 8, 31, 0.92)");
  spot.addColorStop(0.48, "rgba(7, 21, 74, 0.76)");
  spot.addColorStop(0.78, "rgba(17, 54, 126, 0.28)");
  spot.addColorStop(1, "rgba(17, 54, 126, 0)");
  context.fillStyle = spot;
  context.beginPath();
  context.ellipse(darkSpotX, darkSpotY, 170, 86, -0.08, 0, Math.PI * 2);
  context.fill();

  context.globalCompositeOperation = "screen";
  const cloudSpecs = [
    { x: darkSpotX + 126, y: darkSpotY - 58, width: 170, height: 18, alpha: 0.5, angle: -0.18 },
    { x: darkSpotX + 88, y: darkSpotY + 76, width: 210, height: 18, alpha: 0.42, angle: 0.13 },
    { x: darkSpotX - 126, y: darkSpotY - 74, width: 120, height: 12, alpha: 0.25, angle: -0.12 },
    { x: 1290, y: 284, width: 260, height: 16, alpha: 0.22, angle: 0.07 },
    { x: 1490, y: 692, width: 190, height: 14, alpha: 0.18, angle: -0.08 }
  ];

  for (const cloud of cloudSpecs) {
    const gradient = context.createRadialGradient(cloud.x, cloud.y, 2, cloud.x, cloud.y, cloud.width * 0.55);
    gradient.addColorStop(0, `rgba(242, 250, 255, ${cloud.alpha})`);
    gradient.addColorStop(0.46, `rgba(202, 235, 255, ${cloud.alpha * 0.38})`);
    gradient.addColorStop(1, "rgba(202, 235, 255, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(cloud.x, cloud.y, cloud.width, cloud.height, cloud.angle, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function createNeptuneRingTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 90;
  const context = canvas.getContext("2d");
  if (!context) {
    return undefined;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  const bands = [
    { start: 0.1, end: 0.13, alpha: 0.055 },
    { start: 0.36, end: 0.39, alpha: 0.07 },
    { start: 0.62, end: 0.66, alpha: 0.06 },
    { start: 0.86, end: 0.9, alpha: 0.08 }
  ];

  for (const band of bands) {
    const x = band.start * canvas.width;
    const width = (band.end - band.start) * canvas.width;
    const gradient = context.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, "rgba(20, 24, 29, 0)");
    gradient.addColorStop(0.42, `rgba(45, 43, 39, ${band.alpha})`);
    gradient.addColorStop(1, "rgba(20, 24, 29, 0)");
    context.fillStyle = gradient;
    context.fillRect(x, 0, width, canvas.height);
  }

  for (let index = 0; index < 180; index += 1) {
    const x = (index * 173) % canvas.width;
    const y = (index * 59) % canvas.height;
    context.fillStyle = `rgba(105, 107, 106, ${0.01 + ((index * 13) % 22) / 1000})`;
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

function buildAdamsArcDensityParticles({
  radius,
  startAngle,
  length,
  count,
  seed
}: {
  radius: number;
  startAngle: number;
  length: number;
  count: number;
  seed: number;
}): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const t = ((index * 37 + seed * 11) % 1000) / 1000;
    const angle = startAngle + t * length;
    const radial = radius * (2.02 + ((((index * 53 + seed) % 100) / 100) - 0.5) * 0.1);
    positions[index * 3] = Math.cos(angle) * radial;
    positions[index * 3 + 1] = Math.sin(angle) * radial;
    positions[index * 3 + 2] = ((((index * 29 + seed) % 100) / 100) - 0.5) * radius * 0.012;
  }
  return positions;
}

const scooterCloud = { name: "neptune-scooter-cloud-highlight", lat: -36, lon: 78, latRadius: 3, lonRadius: 18, color: "#e7f6ff", opacity: 0.32 };

export function NeptuneModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const geometry = useMemo(() => {
    const sphere = new THREE.SphereGeometry(radius, 184, 108);
    sphere.scale(1, 0.982, 1);
    return sphere;
  }, [radius]);
  const ringGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.42, radius * 2.08, 260), [radius]);
  const sunlitRingArcGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.54, radius * 2.02, 130, 1, -0.24, 0.96), [radius]);
  const shadowRingScatterGeometry = useMemo(() => new THREE.RingGeometry(radius * 1.48, radius * 2.05, 120, 1, Math.PI + 0.46, 0.9), [radius]);
  const adamsArcGeometries = useMemo(
    () => [
      { name: "neptune-adams-ring-arc-liberte", densityName: "neptune-adams-ring-arc-density-liberte", geometry: new THREE.RingGeometry(radius * 1.96, radius * 2.09, 58, 1, 0.48, 0.26), opacity: 0.25, particles: buildAdamsArcDensityParticles({ radius, startAngle: 0.48, length: 0.26, count: 58, seed: 11 }) },
      { name: "neptune-adams-ring-arc-egalite", densityName: "neptune-adams-ring-arc-density-egalite", geometry: new THREE.RingGeometry(radius * 1.96, radius * 2.09, 64, 1, 0.86, 0.31), opacity: 0.3, particles: buildAdamsArcDensityParticles({ radius, startAngle: 0.86, length: 0.31, count: 86, seed: 17 }) },
      { name: "neptune-adams-ring-arc-fraternite", densityName: "neptune-adams-ring-arc-density-fraternite", geometry: new THREE.RingGeometry(radius * 1.96, radius * 2.09, 52, 1, 1.28, 0.22), opacity: 0.22, particles: buildAdamsArcDensityParticles({ radius, startAngle: 1.28, length: 0.22, count: 42, seed: 23 }) },
      { name: "neptune-adams-ring-arc-courage", densityName: "neptune-adams-ring-arc-density-courage", geometry: new THREE.RingGeometry(radius * 1.96, radius * 2.09, 42, 1, 1.62, 0.16), opacity: 0.18, particles: buildAdamsArcDensityParticles({ radius, startAngle: 1.62, length: 0.16, count: 26, seed: 29 }) }
    ],
    [radius]
  );
  const particlePositions = useMemo(() => buildRingParticlePositions({ innerRadius: radius * 1.44, outerRadius: radius * 2.06, count: 680, seed: 83, verticalScale: radius * 0.016 }), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);
  const stormTexture = useMemo(() => createNeptuneStormTexture(), []);
  const ringTexture = useMemo(() => createNeptuneRingTexture(), []);

  useEffect(
    () => () => {
      stormTexture?.dispose();
      ringTexture?.dispose();
    },
    [stormTexture, ringTexture]
  );

  return (
    <group name="neptune-image-based-storm-ice-giant-model" scale={selected ? 1.08 : 1}>
      <mesh name="neptune-surface" geometry={geometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.006}
          color={surfaceTexture ? "#255fd8" : "#1f53c6"}
          roughness={0.86}
          metalness={0.004}
          emissive={selected ? "#143c9d" : "#01030c"}
          emissiveIntensity={selected ? 0.06 : 0.008}
        />
      </mesh>
      <mesh name="neptune-great-dark-spot-and-methane-clouds" geometry={geometry} scale={1.01}>
        <meshStandardMaterial map={stormTexture ?? undefined} color="#ffffff" transparent opacity={0.72} blending={THREE.NormalBlending} roughness={0.96} depthWrite={false} />
      </mesh>
      <mesh name="neptune-supersonic-jet-sheen" geometry={geometry} scale={1.014}>
        <meshStandardMaterial map={stormTexture ?? undefined} color="#95c9ff" transparent opacity={0.16} blending={THREE.AdditiveBlending} roughness={0.94} depthWrite={false} />
      </mesh>
      <SphericalPatch patch={scooterCloud} radius={radius} height={1.022} emissive="#5fa8ff" emissiveIntensity={0.022} />
      <AtmosphereShell name="neptune-deep-blue-methane-atmosphere" radius={radius} color="#2b78ff" opacity={0.085} scale={1.075} />
      <group name="neptune-faint-ring-system" rotation={[Math.PI / 2, 0, 0]}>
        <mesh name="neptune-textured-ring-plane" geometry={ringGeometry}>
          <meshStandardMaterial map={ringTexture ?? undefined} color="#241f1c" transparent opacity={0.24} side={THREE.DoubleSide} roughness={0.98} metalness={0.01} depthWrite={false} />
        </mesh>
        <mesh name="neptune-ring-sunlit-side-highlight" geometry={sunlitRingArcGeometry}>
          <meshStandardMaterial color="#5d5b55" transparent opacity={0.085} side={THREE.DoubleSide} roughness={0.9} metalness={0.01} depthWrite={false} />
        </mesh>
        <mesh name="neptune-ring-shadow-side-scatter" geometry={shadowRingScatterGeometry}>
          <meshStandardMaterial color="#171c20" transparent opacity={0.05} side={THREE.DoubleSide} roughness={0.98} metalness={0} depthWrite={false} />
        </mesh>
        <group name="neptune-adams-discontinuous-ring-arcs">
          {adamsArcGeometries.map((arc) => (
            <React.Fragment key={arc.name}>
              <mesh name={arc.name} geometry={arc.geometry}>
                <meshStandardMaterial color="#4a4038" transparent opacity={arc.opacity} side={THREE.DoubleSide} roughness={0.94} metalness={0.01} depthWrite={false} />
              </mesh>
              <points name={arc.densityName}>
                <bufferGeometry>
                  <bufferAttribute attach="attributes-position" args={[arc.particles, 3]} />
                </bufferGeometry>
                <pointsMaterial color="#80766b" size={0.01} sizeAttenuation transparent opacity={arc.opacity * 0.78} />
              </points>
            </React.Fragment>
          ))}
        </group>
        <points name="neptune-ring-dust-and-ice">
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#646968" size={0.009} sizeAttenuation transparent opacity={0.1} />
        </points>
      </group>
    </group>
  );
}
