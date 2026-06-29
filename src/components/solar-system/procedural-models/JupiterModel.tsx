import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { AtmosphereShell, SphericalPatch } from "./ModelPrimitives";
import type { ProceduralBodyModelProps } from "./types";
import { useImageTexture } from "./useImageTexture";

const jupiterFlattenY = 0.965;
const polarCyclones = [
  { name: "jupiter-polar-cyclone-north-0", lat: 66, lon: -36, latRadius: 5, lonRadius: 9, color: "#f3ddc4", opacity: 0.24 },
  { name: "jupiter-polar-cyclone-north-1", lat: 72, lon: 44, latRadius: 4, lonRadius: 8, color: "#d49b78", opacity: 0.2 },
  { name: "jupiter-polar-cyclone-north-2", lat: 62, lon: 118, latRadius: 4, lonRadius: 8, color: "#fff0d2", opacity: 0.18 },
  { name: "jupiter-polar-cyclone-south-0", lat: -64, lon: -70, latRadius: 5, lonRadius: 9, color: "#e1a77f", opacity: 0.22 },
  { name: "jupiter-polar-cyclone-south-1", lat: -71, lon: 18, latRadius: 4, lonRadius: 8, color: "#fff0d1", opacity: 0.2 },
  { name: "jupiter-polar-cyclone-south-2", lat: -62, lon: 136, latRadius: 4, lonRadius: 8, color: "#c77d5e", opacity: 0.18 }
];

function createCanvasTexture(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    return undefined;
  }

  context.clearRect(0, 0, width, height);
  draw(context);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function drawSoftEllipse(context: CanvasRenderingContext2D, x: number, y: number, radiusX: number, radiusY: number, angle: number, stops: Array<[number, string]>) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.scale(radiusX, radiusY);
  const gradient = context.createRadialGradient(0, 0, 0.02, 0, 0, 1);
  for (const [offset, color] of stops) {
    gradient.addColorStop(offset, color);
  }
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function createJupiterCloudBandTexture(): THREE.CanvasTexture | undefined {
  return createCanvasTexture(2048, 1024, (context) => {
    const { width, height } = context.canvas;

    const bands = [
      { y: 180, height: 18, alpha: 0.075, color: "244, 218, 180" },
      { y: 278, height: 16, alpha: 0.09, color: "255, 238, 204" },
      { y: 384, height: 22, alpha: 0.06, color: "173, 101, 66" },
      { y: 502, height: 20, alpha: 0.08, color: "255, 229, 190" },
      { y: 662, height: 18, alpha: 0.07, color: "194, 118, 75" },
      { y: 776, height: 16, alpha: 0.065, color: "248, 221, 184" }
    ];

    context.globalCompositeOperation = "screen";
    for (const band of bands) {
      const gradient = context.createLinearGradient(0, band.y, width, band.y);
      gradient.addColorStop(0, `rgba(${band.color}, 0)`);
      gradient.addColorStop(0.18, `rgba(${band.color}, ${band.alpha * 0.55})`);
      gradient.addColorStop(0.48, `rgba(${band.color}, ${band.alpha})`);
      gradient.addColorStop(0.82, `rgba(${band.color}, ${band.alpha * 0.52})`);
      gradient.addColorStop(1, `rgba(${band.color}, 0)`);
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(width / 2, band.y, width * 0.66, band.height, 0.008, 0, Math.PI * 2);
      context.fill();
    }

    for (let index = 0; index < 34; index += 1) {
      const y = 150 + ((index * 79) % 700);
      const x = (index * 173) % width;
      const length = 160 + ((index * 47) % 260);
      const alpha = 0.025 + ((index * 11) % 20) / 1000;
      const gradient = context.createLinearGradient(x - length, y, x + length, y);
      gradient.addColorStop(0, "rgba(255, 244, 217, 0)");
      gradient.addColorStop(0.5, `rgba(255, 244, 217, ${alpha})`);
      gradient.addColorStop(1, "rgba(255, 244, 217, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(x, y, length, 4 + (index % 4), ((index % 7) - 3) * 0.01, 0, Math.PI * 2);
      context.fill();
    }

    context.globalCompositeOperation = "source-over";
  });
}

function createJupiterGreatRedSpotTexture(): THREE.CanvasTexture | undefined {
  return createCanvasTexture(2048, 1024, (context) => {
    const spotX = 1240;
    const spotY = 637;

    context.globalCompositeOperation = "source-over";
    drawSoftEllipse(context, spotX + 42, spotY + 6, 238, 58, -0.045, [
      [0, "rgba(250, 224, 189, 0.24)"],
      [0.46, "rgba(235, 177, 125, 0.13)"],
      [1, "rgba(235, 177, 125, 0)"]
    ]);
    drawSoftEllipse(context, spotX, spotY, 146, 72, -0.075, [
      [0, "rgba(139, 43, 26, 0.46)"],
      [0.32, "rgba(187, 80, 45, 0.36)"],
      [0.68, "rgba(219, 135, 78, 0.18)"],
      [1, "rgba(219, 135, 78, 0)"]
    ]);
    drawSoftEllipse(context, spotX - 12, spotY - 4, 74, 34, -0.18, [
      [0, "rgba(82, 21, 16, 0.34)"],
      [0.48, "rgba(122, 42, 27, 0.2)"],
      [1, "rgba(122, 42, 27, 0)"]
    ]);

    context.globalCompositeOperation = "screen";
    const wisps = [
      { x: spotX + 154, y: spotY - 38, width: 220, height: 14, alpha: 0.36, angle: -0.16 },
      { x: spotX + 126, y: spotY + 48, width: 255, height: 15, alpha: 0.28, angle: 0.1 },
      { x: spotX - 114, y: spotY - 42, width: 150, height: 11, alpha: 0.2, angle: -0.1 },
      { x: spotX - 72, y: spotY + 56, width: 166, height: 12, alpha: 0.18, angle: 0.12 }
    ];
    for (const wisp of wisps) {
      drawSoftEllipse(context, wisp.x, wisp.y, wisp.width, wisp.height, wisp.angle, [
        [0, `rgba(255, 241, 210, ${wisp.alpha})`],
        [0.5, `rgba(255, 232, 194, ${wisp.alpha * 0.32})`],
        [1, "rgba(255, 232, 194, 0)"]
      ]);
    }

    context.globalCompositeOperation = "source-over";
    context.lineCap = "round";
    context.lineJoin = "round";
    const arcs = [
      { rx: 108, ry: 50, start: 0.08, end: 1.15, alpha: 0.18, color: "255, 218, 178", width: 2.6 },
      { rx: 94, ry: 42, start: 1.28, end: 2.45, alpha: 0.13, color: "93, 30, 21", width: 2.1 },
      { rx: 126, ry: 58, start: 3.25, end: 4.7, alpha: 0.11, color: "255, 234, 203", width: 2.4 },
      { rx: 70, ry: 30, start: 4.9, end: 6.08, alpha: 0.12, color: "107, 35, 25", width: 1.8 }
    ];
    context.save();
    context.translate(spotX, spotY);
    context.rotate(-0.075);
    for (const arc of arcs) {
      context.strokeStyle = `rgba(${arc.color}, ${arc.alpha})`;
      context.lineWidth = arc.width;
      context.beginPath();
      context.ellipse(0, 0, arc.rx, arc.ry, 0, arc.start, arc.end);
      context.stroke();
    }
    context.restore();
  });
}

export function JupiterModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const geometry = useMemo(() => {
    const sphere = new THREE.SphereGeometry(radius, 192, 112);
    sphere.scale(1, jupiterFlattenY, 1);
    return sphere;
  }, [radius]);
  const surfaceTexture = useImageTexture(asset?.localPath);
  const cloudBandTexture = useMemo(() => createJupiterCloudBandTexture(), []);
  const greatRedSpotTexture = useMemo(() => createJupiterGreatRedSpotTexture(), []);

  useEffect(
    () => () => {
      cloudBandTexture?.dispose();
      greatRedSpotTexture?.dispose();
    },
    [cloudBandTexture, greatRedSpotTexture]
  );

  return (
    <group name="jupiter-image-based-storm-model" scale={selected ? 1.08 : 1}>
      <mesh name="jupiter-surface" geometry={geometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial
          map={surfaceTexture ?? undefined}
          bumpMap={surfaceTexture ?? undefined}
          bumpScale={radius * 0.018}
          color={surfaceTexture ? "#e6c7a2" : "#c99b72"}
          roughness={0.84}
          metalness={0.006}
          emissive={selected ? "#6f3d27" : "#060302"}
          emissiveIntensity={selected ? 0.045 : 0.006}
        />
      </mesh>
      <mesh name="jupiter-upper-cloud-sheen" geometry={geometry} scale={1.006}>
        <meshStandardMaterial map={cloudBandTexture ?? undefined} color="#f2e2c8" roughness={0.92} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh name="jupiter-prograde-cloud-drift-layer" geometry={geometry} scale={1.011} rotation={[0, 0.045, 0]}>
        <meshStandardMaterial map={cloudBandTexture ?? undefined} color="#fff2d7" roughness={0.94} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh name="jupiter-retrograde-cloud-drift-layer" geometry={geometry} scale={1.015} rotation={[0, -0.035, 0]}>
        <meshStandardMaterial map={cloudBandTexture ?? undefined} color="#c9825d" roughness={0.96} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh name="jupiter-great-red-spot-vortex" geometry={geometry} scale={1.012} renderOrder={2}>
        <meshStandardMaterial map={greatRedSpotTexture ?? undefined} color="#ffffff" roughness={0.96} transparent opacity={greatRedSpotTexture ? 0.68 : 0} blending={THREE.NormalBlending} depthWrite={false} depthTest />
      </mesh>
      <group name="jupiter-polar-cyclone-layer" scale={[1, jupiterFlattenY, 1]}>
        {polarCyclones.map((patch) => (
          <SphericalPatch key={patch.name} patch={patch} radius={radius} height={1.022} />
        ))}
      </group>
      <AtmosphereShell name="jupiter-storm-haze-atmosphere" radius={radius} color="#d6a77e" opacity={0.055} scale={1.055} />
    </group>
  );
}
