import { assetSources } from "@/data/assets";
import {
  getLunarEclipseGeometry,
  getLunarEclipseMoonAppearance,
  getLunarEclipsePenumbraRadiusAtX,
  getLunarEclipseUmbraRadiusAtX,
  lunarEclipseEarth,
  lunarEclipseMoon,
  lunarEclipseSun,
  type LunarEclipseState
} from "@/lib/lunar-eclipse";

export interface GroundShadowProjection {
  moonRadius: number;
  penumbraRadius: number;
  umbraRadius: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  penumbraOpacity: number;
  umbraOpacity: number;
  redOpacity: number;
}

export const groundMoonRadius = 1.22;
export const spaceMoonDiscRadius = lunarEclipseMoon.radius;
const groundMoonBaseAssetId = "moon-lunar-eclipse-earth-view-svs";

export interface SpaceMoonShadowProjection {
  moonRadius: number;
  penumbraRadius: number;
  umbraRadius: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  penumbraOpacity: number;
  umbraOpacity: number;
  redOpacity: number;
}

export interface LunarEclipseTangentLine {
  kind: "umbra" | "penumbra";
  plane: "y" | "z";
  start: {
    x: number;
    y: number;
    z: number;
  };
  through: {
    x: number;
    y: number;
    z: number;
  };
  end: {
    x: number;
    y: number;
    z: number;
  };
}

export interface LunarEclipseSunRayLine {
  kind: "umbra-boundary" | "penumbra-boundary";
  plane: "y" | "z";
  start: {
    x: number;
    y: number;
    z: number;
  };
  end: {
    x: number;
    y: number;
    z: number;
  };
}

export interface LunarEclipseShadowConeProfile {
  axisStartX: number;
  axisEndX: number;
  umbraStartRadius: number;
  umbraEndRadius: number;
  penumbraStartRadius: number;
  penumbraEndRadius: number;
}

export interface SpaceMoonSurfaceEffect {
  shadowCenterY: number;
  shadowCenterZ: number;
  penumbraRadius: number;
  umbraRadius: number;
  penumbraCoverage: number;
  umbraCoverage: number;
  totality: boolean;
  usesProjectedOverlay: false;
}

export interface GroundMoonRenderModel {
  moonRadius: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  penumbraRadius: number;
  umbraRadius: number;
  penumbraCoverage: number;
  umbraCoverage: number;
  totality: boolean;
  totalCase: boolean;
}

export interface GroundEarthViewShadowDisc {
  centerX: number;
  centerY: number;
  radius: number;
  opacity: number;
  motionAxis: "x";
  boundaryShape: "circular";
  direction: "left-to-right";
}

export function getGroundMoonBaseTexturePath(): string {
  return assetSources.find((asset) => asset.id === groundMoonBaseAssetId)?.localPath ?? "/textures/moon.jpg";
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));

  return t * t * (3 - 2 * t);
}

export function getGroundEarthViewShadowDisc(state: LunarEclipseState, moonRadius: number): GroundEarthViewShadowDisc | null {
  const startsAt = 0.24;
  const endsAt = 0.72;
  const progress = smoothstep(startsAt, endsAt, state.time);

  if (progress <= 0 || progress >= 1) {
    return null;
  }

  const shadowRadius = state.eclipseCase === "total" ? moonRadius * 1.36 : moonRadius * 1.08;
  const centerY = state.eclipseCase === "total" ? 0 : moonRadius * 0.92;
  const travelStart = -moonRadius - shadowRadius;
  const travelEnd = moonRadius + shadowRadius;
  const centerX = travelStart + (travelEnd - travelStart) * progress;

  return {
    centerX,
    centerY,
    radius: shadowRadius,
    opacity: state.eclipseCase === "total" ? 0.9 : 0.94,
    motionAxis: "x",
    boundaryShape: "circular",
    direction: "left-to-right"
  };
}

export function getGroundShadowProjection(state: LunarEclipseState): GroundShadowProjection {
  const geometry = getLunarEclipseGeometry(state);
  const appearance = getLunarEclipseMoonAppearance(state);
  const moonSurfaceScale = groundMoonRadius / geometry.moon.radius;

  return {
    moonRadius: groundMoonRadius,
    penumbraRadius: geometry.penumbraRadiusAtMoon * moonSurfaceScale,
    umbraRadius: geometry.umbraBoundaryArcRadius * moonSurfaceScale,
    shadowOffsetX: geometry.groundShadowCenter.x * moonSurfaceScale,
    shadowOffsetY: geometry.groundShadowCenter.y * moonSurfaceScale,
    penumbraOpacity: 0.08 + appearance.penumbralDimming * 0.9,
    umbraOpacity: state.eclipseCase === "total" && geometry.umbraCoversWholeMoon ? 0.52 : 0.18 + geometry.umbraCoverage * 0.48,
    redOpacity: appearance.redAtmosphericLight * 0.72
  };
}

export function getSpaceMoonShadowProjection(state: LunarEclipseState): SpaceMoonShadowProjection {
  const geometry = getLunarEclipseGeometry(state);
  const appearance = getLunarEclipseMoonAppearance(state);
  const moonSurfaceScale = spaceMoonDiscRadius / geometry.moon.radius;

  return {
    moonRadius: spaceMoonDiscRadius,
    penumbraRadius: geometry.penumbraRadiusAtMoon * moonSurfaceScale,
    umbraRadius: geometry.umbraBoundaryArcRadius * moonSurfaceScale,
    shadowOffsetX: geometry.groundShadowCenter.x * moonSurfaceScale,
    shadowOffsetY: geometry.groundShadowCenter.y * moonSurfaceScale,
    penumbraOpacity: 0.1 + appearance.penumbralDimming * 1.1,
    umbraOpacity: state.eclipseCase === "total" && geometry.umbraCoversWholeMoon ? 0.94 : 0.76 + geometry.umbraCoverage * 0.16,
    redOpacity: geometry.umbraCoversWholeMoon ? 0.56 : geometry.umbraCoverage * 0.08
  };
}

export function getSpaceMoonSurfaceEffect(state: LunarEclipseState): SpaceMoonSurfaceEffect {
  const geometry = getLunarEclipseGeometry(state);

  return {
    shadowCenterY: geometry.groundShadowCenter.x,
    shadowCenterZ: geometry.groundShadowCenter.y,
    penumbraRadius: geometry.penumbraRadiusAtMoon,
    umbraRadius: geometry.umbraBoundaryArcRadius,
    penumbraCoverage: geometry.penumbraCoverage,
    umbraCoverage: geometry.umbraCoverage,
    totality: geometry.umbraCoversWholeMoon,
    usesProjectedOverlay: false
  };
}

export function getGroundMoonRenderModel(state: LunarEclipseState): GroundMoonRenderModel {
  const geometry = getLunarEclipseGeometry(state);
  const projection = getGroundShadowProjection(state);

  return {
    moonRadius: projection.moonRadius,
    shadowOffsetX: projection.shadowOffsetX,
    shadowOffsetY: projection.shadowOffsetY,
    penumbraRadius: projection.penumbraRadius,
    umbraRadius: projection.umbraRadius,
    penumbraCoverage: geometry.penumbraCoverage,
    umbraCoverage: geometry.umbraCoverage,
    totality: geometry.umbraCoversWholeMoon,
    totalCase: state.eclipseCase === "total"
  };
}

function getLineYAtX(start: { x: number; y: number }, through: { x: number; y: number }, targetX: number): number {
  const progress = (targetX - start.x) / (through.x - start.x);

  return start.y + (through.y - start.y) * progress;
}

function createPointInPlane(x: number, value: number, plane: "y" | "z"): { x: number; y: number; z: number } {
  return plane === "y" ? { x, y: value, z: 0 } : { x, y: 0, z: value };
}

function getLunarEclipseTangentLinesInPlane(plane: "y" | "z"): LunarEclipseTangentLine[] {
  const sunTop = { x: lunarEclipseSun.x, y: lunarEclipseSun.radius, z: 0 };
  const sunBottom = { x: lunarEclipseSun.x, y: -lunarEclipseSun.radius, z: 0 };
  const earthUmbraTop = { x: lunarEclipseEarth.x, y: getLunarEclipseUmbraRadiusAtX(lunarEclipseEarth.x), z: 0 };
  const earthUmbraBottom = { x: lunarEclipseEarth.x, y: -getLunarEclipseUmbraRadiusAtX(lunarEclipseEarth.x), z: 0 };
  const earthPenumbraTop = { x: lunarEclipseEarth.x, y: lunarEclipseEarth.radius, z: 0 };
  const earthPenumbraBottom = { x: lunarEclipseEarth.x, y: -lunarEclipseEarth.radius, z: 0 };
  const endX = lunarEclipseMoon.x + 0.65;

  return [
    {
      kind: "umbra",
      plane,
      start: createPointInPlane(sunTop.x, sunTop.y, plane),
      through: createPointInPlane(earthUmbraTop.x, earthUmbraTop.y, plane),
      end: createPointInPlane(endX, getLineYAtX(sunTop, earthUmbraTop, endX), plane)
    },
    {
      kind: "umbra",
      plane,
      start: createPointInPlane(sunBottom.x, sunBottom.y, plane),
      through: createPointInPlane(earthUmbraBottom.x, earthUmbraBottom.y, plane),
      end: createPointInPlane(endX, getLineYAtX(sunBottom, earthUmbraBottom, endX), plane)
    },
    {
      kind: "penumbra",
      plane,
      start: createPointInPlane(sunTop.x, sunTop.y, plane),
      through: createPointInPlane(earthPenumbraBottom.x, earthPenumbraBottom.y, plane),
      end: createPointInPlane(endX, getLineYAtX(sunTop, earthPenumbraBottom, endX), plane)
    },
    {
      kind: "penumbra",
      plane,
      start: createPointInPlane(sunBottom.x, sunBottom.y, plane),
      through: createPointInPlane(earthPenumbraTop.x, earthPenumbraTop.y, plane),
      end: createPointInPlane(endX, getLineYAtX(sunBottom, earthPenumbraTop, endX), plane)
    }
  ];
}

export function getLunarEclipseTangentLines(): LunarEclipseTangentLine[] {
  return [...getLunarEclipseTangentLinesInPlane("y"), ...getLunarEclipseTangentLinesInPlane("z")];
}

export function getLunarEclipseSunRayLines(): LunarEclipseSunRayLine[] {
  return getLunarEclipseTangentLines().map((line) => ({
    kind: line.kind === "umbra" ? "umbra-boundary" : "penumbra-boundary",
    plane: line.plane,
    start: line.start,
    end: line.end
  }));
}

export function getLunarEclipseShadowConeProfile(): LunarEclipseShadowConeProfile {
  const axisEndX = lunarEclipseMoon.x + 0.65;

  return {
    axisStartX: lunarEclipseEarth.x,
    axisEndX,
    umbraStartRadius: getLunarEclipseUmbraRadiusAtX(lunarEclipseEarth.x),
    umbraEndRadius: getLunarEclipseUmbraRadiusAtX(axisEndX),
    penumbraStartRadius: lunarEclipseEarth.radius,
    penumbraEndRadius: getLunarEclipsePenumbraRadiusAtX(axisEndX)
  };
}
