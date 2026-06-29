import * as THREE from "three";
import { earthLandRings } from "./earth-map-data";

const textureWidth = 2048;
const textureHeight = 1024;

const oceanBoundaryLines: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [
    [-168, 66],
    [-168, 50],
    [-154, 28],
    [-140, 8],
    [-126, -20],
    [-76, -56]
  ],
  [
    [-68, -56],
    [-52, -45],
    [-36, -23],
    [-24, 0],
    [-18, 24],
    [-22, 64]
  ],
  [
    [20, -55],
    [20, -34],
    [32, -18],
    [45, 0],
    [62, 20]
  ],
  [
    [147, -48],
    [140, -24],
    [128, -9],
    [120, 4],
    [112, 18]
  ],
  [
    [-180, 66.5],
    [-120, 66.5],
    [-60, 66.5],
    [0, 66.5],
    [60, 66.5],
    [120, 66.5],
    [180, 66.5]
  ]
];

function project(lon: number, lat: number): [number, number] {
  return [((lon + 180) / 360) * textureWidth, ((90 - lat) / 180) * textureHeight];
}

function drawProjectedPath(context: CanvasRenderingContext2D, points: ReadonlyArray<readonly [number, number]>, closePath: boolean) {
  for (const wrap of [-360, 0, 360]) {
    context.beginPath();
    points.forEach(([lon, lat], index) => {
      const [x, y] = project(lon + wrap, lat);
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    if (closePath) {
      context.closePath();
    }
    context.fill();
    context.stroke();
  }
}

export function createEarthSurfaceTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = textureWidth;
  canvas.height = textureHeight;

  let context: CanvasRenderingContext2D | null = null;
  try {
    context = canvas.getContext("2d");
  } catch {
    return null;
  }

  if (!context) {
    return null;
  }

  const oceanGradient = context.createLinearGradient(0, 0, textureWidth, textureHeight);
  oceanGradient.addColorStop(0, "#043073");
  oceanGradient.addColorStop(0.46, "#087fc2");
  oceanGradient.addColorStop(1, "#052d77");
  context.fillStyle = oceanGradient;
  context.fillRect(0, 0, textureWidth, textureHeight);

  context.globalAlpha = 0.42;
  context.strokeStyle = "rgba(178, 233, 255, 0.18)";
  context.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const [x] = project(lon, 0);
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, textureHeight);
    context.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project(0, lat);
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(textureWidth, y);
    context.stroke();
  }
  context.globalAlpha = 1;

  context.fillStyle = "#4d9b4f";
  context.strokeStyle = "rgba(16, 44, 22, 0.96)";
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = 1.7;
  for (const ring of earthLandRings) {
    drawProjectedPath(context, ring, true);
  }

  context.strokeStyle = "rgba(244, 255, 252, 0.88)";
  context.setLineDash([14, 10]);
  context.lineWidth = 2.1;
  context.fillStyle = "transparent";
  for (const line of oceanBoundaryLines) {
    drawProjectedPath(context, line, false);
  }
  context.setLineDash([]);

  context.fillStyle = "rgba(237, 251, 252, 0.9)";
  context.fillRect(0, 0, textureWidth, Math.round(textureHeight * 0.07));
  context.fillRect(0, Math.round(textureHeight * 0.92), textureWidth, Math.round(textureHeight * 0.08));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
