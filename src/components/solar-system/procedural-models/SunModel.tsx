import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

function createSunspotGranulationTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "lighter";
  for (let index = 0; index < 220; index += 1) {
    const x = (index * 83) % canvas.width;
    const y = (index * 47) % canvas.height;
    const radius = 10 + ((index * 19) % 28);
    const granule = context.createRadialGradient(x, y, 1, x, y, radius);
    granule.addColorStop(0, "rgba(255, 238, 150, 0.13)");
    granule.addColorStop(0.55, "rgba(255, 140, 42, 0.055)");
    granule.addColorStop(1, "rgba(255, 90, 12, 0)");
    context.fillStyle = granule;
    context.beginPath();
    context.ellipse(x, y, radius * 1.35, radius * 0.72, ((index % 7) - 3) * 0.18, 0, Math.PI * 2);
    context.fill();
  }

  context.globalCompositeOperation = "source-over";
  const spots = [
    { x: 256, y: 205, radius: 30, alpha: 0.5 },
    { x: 604, y: 278, radius: 24, alpha: 0.42 },
    { x: 742, y: 188, radius: 18, alpha: 0.36 },
    { x: 384, y: 332, radius: 14, alpha: 0.3 }
  ];
  for (const spot of spots) {
    const gradient = context.createRadialGradient(spot.x, spot.y, 2, spot.x, spot.y, spot.radius);
    gradient.addColorStop(0, `rgba(38, 10, 2, ${spot.alpha})`);
    gradient.addColorStop(0.45, `rgba(92, 24, 4, ${spot.alpha * 0.42})`);
    gradient.addColorStop(1, "rgba(92, 24, 4, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(spot.x, spot.y, spot.radius * 1.25, spot.radius * 0.72, 0.18, 0, Math.PI * 2);
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

function seededUnit(seed: number): number {
  return Math.sin(seed * 12.9898 + 78.233) * 43758.5453 % 1 + (Math.sin(seed * 12.9898 + 78.233) * 43758.5453 % 1 < 0 ? 1 : 0);
}

function buildCoronalHazePositions(radius: number): Float32Array {
  const particles = 900;
  const positions = new Float32Array(particles * 3);
  let offset = 0;

  for (let index = 0; index < particles; index += 1) {
    const azimuth = seededUnit(index + 11) * Math.PI * 2;
    const vertical = Math.asin(-0.86 + seededUnit(index + 29) * 1.72);
    const shell = radius * (1.035 + Math.pow(seededUnit(index + 47), 1.85) * 0.42);
    const limbBias = 1 + Math.pow(Math.abs(Math.cos(vertical)), 2.4) * 0.08;
    const distance = shell * limbBias;

    positions[offset] = Math.cos(azimuth) * Math.cos(vertical) * distance;
    positions[offset + 1] = Math.sin(vertical) * distance;
    positions[offset + 2] = Math.sin(azimuth) * Math.cos(vertical) * distance * 0.82;
    offset += 3;
  }

  return positions;
}

interface ProminenceSpec {
  name: string;
  angle: number;
  span: number;
  height: number;
  z: number;
  twist: number;
  tubeRadius: number;
  opacity: number;
}

const prominenceSpecs: ProminenceSpec[] = [
  { name: "0", angle: 0.78, span: 0.42, height: 1.18, z: 0.1, twist: 0.08, tubeRadius: 0.006, opacity: 0.3 },
  { name: "1", angle: 2.78, span: 0.34, height: 1.14, z: 0.04, twist: -0.06, tubeRadius: 0.0048, opacity: 0.24 },
  { name: "2", angle: 4.72, span: 0.38, height: 1.22, z: 0.12, twist: 0.05, tubeRadius: 0.0054, opacity: 0.27 }
];

function surfacePoint(radius: number, angle: number, z: number, scale = 1.012): THREE.Vector3 {
  return new THREE.Vector3(Math.cos(angle), Math.sin(angle), z).normalize().multiplyScalar(radius * scale);
}

function buildProminenceFilamentGeometry(radius: number, spec: ProminenceSpec): THREE.TubeGeometry {
  const start = surfacePoint(radius, spec.angle - spec.span, spec.z);
  const end = surfacePoint(radius, spec.angle + spec.span, spec.z + spec.twist);
  const crest = surfacePoint(radius, spec.angle, spec.z + spec.twist * 0.5, spec.height);
  const shoulderA = start.clone().lerp(crest, 0.45).multiplyScalar(1.025);
  const shoulderB = crest.clone().lerp(end, 0.55).multiplyScalar(1.025);
  const curve = new THREE.CatmullRomCurve3([start, shoulderA, crest, shoulderB, end], false, "centripetal", 0.45);

  return new THREE.TubeGeometry(curve, 56, radius * spec.tubeRadius, 8, false);
}

interface SunModelProps extends ProceduralBodyModelProps {
  animated?: boolean;
  presentation?: "overview" | "hero";
}

const coronaScales = [1.08, 1.18, 1.34];
const coronaBaseOpacity = [0.13, 0.055, 0.018];

function HeroCoronalVeil({ radius }: { radius: number }) {
  return (
    <group name="sun-hero-coronal-veil">
      {[1.44, 1.62].map((scale, index) => (
        <mesh key={scale} name={`sun-hero-coronal-veil-shell-${index}`} scale={scale}>
          <sphereGeometry args={[radius, 96, 48]} />
          <meshBasicMaterial
            color={index === 0 ? "#ffb13b" : "#ff4a16"}
            transparent
            opacity={index === 0 ? 0.022 : 0.012}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SunModel({ body, radius, selected, fallbackColor, asset, onSelectBody, animated = false, presentation = "overview" }: SunModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const photosphereRef = useRef<THREE.Mesh>(null);
  const granulationRef = useRef<THREE.Mesh>(null);
  const hazeRef = useRef<THREE.Points>(null);
  const coronaRefs = useRef<THREE.Mesh[]>([]);
  const coronaMaterialRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const prominenceMaterialRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const surfaceGeometry = useMemo(() => new THREE.SphereGeometry(radius, 192, 112), [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);
  const sunspotTexture = useMemo(() => createSunspotGranulationTexture(), []);
  const coronalHazePositions = useMemo(() => buildCoronalHazePositions(radius), [radius]);
  const prominenceGeometries = useMemo(() => prominenceSpecs.map((spec) => buildProminenceFilamentGeometry(radius, spec)), [radius]);

  useFrame(({ clock }) => {
    if (!animated) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const coronaBreath = Math.sin(elapsed * 0.55) * 0.5 + 0.5;

    if (rootRef.current) {
      rootRef.current.rotation.y = elapsed * 0.026;
    }

    if (surfaceRef.current) {
      surfaceRef.current.rotation.y = elapsed * 0.032;
      surfaceRef.current.rotation.z = Math.sin(elapsed * 0.12) * 0.01;
    }

    if (photosphereRef.current) {
      photosphereRef.current.rotation.y = elapsed * 0.04;
      photosphereRef.current.rotation.x = Math.sin(elapsed * 0.16) * 0.008;
    }

    if (granulationRef.current) {
      granulationRef.current.rotation.y = -elapsed * 0.026;
      granulationRef.current.rotation.z = elapsed * 0.01;
    }

    if (sunspotTexture) {
      sunspotTexture.offset.x = (elapsed * 0.006) % 1;
      sunspotTexture.offset.y = Math.sin(elapsed * 0.12) * 0.003;
      sunspotTexture.needsUpdate = true;
    }

    if (hazeRef.current) {
      hazeRef.current.rotation.z = elapsed * 0.006;
      hazeRef.current.rotation.y = elapsed * 0.004;
      const material = hazeRef.current.material;
      if (material instanceof THREE.PointsMaterial) {
        material.opacity = 0.14 + coronaBreath * 0.025;
        material.size = 0.012 + coronaBreath * 0.0025;
      }
    }

    coronaRefs.current.forEach((mesh, index) => {
      const baseScale = coronaScales[index] ?? 1.18;
      const pulse = Math.sin(elapsed * (0.38 + index * 0.08) + index) * (0.006 + index * 0.003);
      mesh.scale.setScalar(baseScale + pulse);
    });

    coronaMaterialRefs.current.forEach((material, index) => {
      material.opacity = (coronaBaseOpacity[index] ?? 0.04) + coronaBreath * (0.008 + index * 0.003);
    });

    prominenceMaterialRefs.current.forEach((material, index) => {
      const activity = Math.sin(elapsed * (0.32 + index * 0.05) + index * 1.7) * 0.5 + 0.5;
      material.opacity = prominenceSpecs[index].opacity + activity * 0.04;
    });
  });

  useEffect(
    () => () => {
      sunspotTexture?.dispose();
    },
    [sunspotTexture]
  );

  return (
    <group ref={rootRef} name="sun-image-based-active-star-model" scale={selected ? 1.08 : 1}>
      <mesh ref={surfaceRef} name="sun-surface" geometry={surfaceGeometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshBasicMaterial map={surfaceTexture ?? undefined} color={surfaceTexture ? "#fff2a8" : fallbackColor} toneMapped={false} />
      </mesh>
      <mesh ref={photosphereRef} name="sun-boiling-photosphere-glow" geometry={surfaceGeometry} scale={1.006}>
        <meshBasicMaterial map={surfaceTexture ?? undefined} color="#ff7a20" transparent opacity={0.34} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={granulationRef} name="sun-sunspot-and-granulation-layer" geometry={surfaceGeometry} scale={1.012}>
        <meshBasicMaterial map={sunspotTexture ?? undefined} color="#ff9a28" transparent opacity={0.5} blending={THREE.NormalBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <points ref={hazeRef} name="sun-coronal-density-haze">
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[coronalHazePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffe8ad" size={0.012} sizeAttenuation transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {coronaScales.map((scale, index) => (
        <mesh
          key={scale}
          ref={(node) => {
            if (node) {
              coronaRefs.current[index] = node;
            }
          }}
          name={`sun-corona-${index}`}
          scale={scale}
        >
          <sphereGeometry args={[radius, 96, 56]} />
          <meshBasicMaterial
            ref={(node) => {
              if (node) {
                coronaMaterialRefs.current[index] = node;
              }
            }}
            color={index === 0 ? "#fff2a3" : index === 1 ? "#ff9a32" : "#ff4a16"}
            transparent
            opacity={coronaBaseOpacity[index]}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
      {presentation === "overview" ? (
        <group name="sun-prominence-filaments">
          {prominenceSpecs.map((spec, index) => (
            <mesh key={spec.name} name={`sun-prominence-filament-${spec.name}`} geometry={prominenceGeometries[index]}>
              <meshBasicMaterial
                ref={(node) => {
                  if (node) {
                    prominenceMaterialRefs.current[index] = node;
                  }
                }}
                color="#ff7448"
                transparent
                opacity={spec.opacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ) : null}
      {presentation === "hero" ? (
        <group name="sun-hero-presentation-effects">
          <HeroCoronalVeil radius={radius} />
        </group>
      ) : null}
    </group>
  );
}
