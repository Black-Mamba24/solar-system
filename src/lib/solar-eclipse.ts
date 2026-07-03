export type EclipseModel = "total" | "annular";
export type EclipseCaseType = EclipseModel;
export type GroundMode = "total" | "partial" | "annular";
export type MainView = "space" | "ground";
export type EclipseView = MainView;

export interface ShadowPoint {
  x: number;
  y: number;
}

export interface SolarEclipseState {
  mainView: MainView;
  eclipseModel: EclipseModel;
  groundMode: GroundMode;
  time: number;
  partialOffset: ShadowPoint;
  partialMagnitude: number;
}

export interface GroundEclipseAppearance {
  moonOffset: ShadowPoint;
  moonScale: number;
  coverage: number;
  ringVisible: boolean;
}

export interface SpaceMoonPosition {
  x: number;
  y: number;
  z: number;
  orbitAngleRad: number;
}

export interface ShadowBoundary {
  upperEarthY: number;
  lowerEarthY: number;
}

export interface EclipseTangentGeometry {
  model: EclipseModel;
  moon: SpaceMoonPosition;
  moonRadius: number;
  penumbra: ShadowBoundary;
  umbra: ShadowBoundary;
  antumbra: ShadowBoundary | null;
  umbraTipX: number;
}

export interface ShadowTrackGeometry {
  bandY: number;
  partialBandScaleY: number;
  centralBandScaleY: number;
}

export interface SpaceShadowProjectionGeometry {
  centerAtEarth: {
    x: number;
    y: number;
    z: number;
  };
  umbraTip: {
    x: number;
    y: number;
    z: number;
  };
  penumbraRadiusAtEarth: number;
  centralRadiusAtEarth: number;
}

const defaultPartialOffset = { x: 0.58, y: -0.2 };
const umbraRadius = 0.22;
const penumbraRadius = 1;
const groundSunRadius = 1.35;
export const spaceSun = { x: -3.15, y: 0, radius: 0.68 } as const;
export const spaceEarth = { x: 2.78, y: 0, radius: 0.82 } as const;
export const spaceMoon = { radius: 0.24, orbitRadius: 1.65 } as const;
export const spaceMoonOrbitInclinationRad = 0.16;

const spaceModelConfig = {
  total: {
    moonRadius: 0.24,
    orbitRadius: 1.65
  },
  annular: {
    moonRadius: 0.13,
    orbitRadius: 1.9
  }
} as const satisfies Record<EclipseModel, { moonRadius: number; orbitRadius: number }>;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizePoint(point: ShadowPoint): ShadowPoint {
  const length = Math.hypot(point.x, point.y);

  if (length <= 0.0001) {
    return { x: 1, y: 0 };
  }

  return {
    x: point.x / length,
    y: point.y / length
  };
}

function getPointDistance(point: ShadowPoint): number {
  return Math.hypot(point.x, point.y);
}

function getPartialMagnitude(point: ShadowPoint): number {
  const distance = getPointDistance(point);
  const normalizedDepth = 1 - clamp((distance - umbraRadius) / (penumbraRadius - umbraRadius), 0, 1);

  return clamp(0.18 + normalizedDepth * 0.7, 0.12, 0.88);
}

function roundPoint(point: ShadowPoint): ShadowPoint {
  return {
    x: Number(point.x.toFixed(2)),
    y: Number(point.y.toFixed(2))
  };
}

export function createInitialEclipseState(overrides: Partial<SolarEclipseState> = {}): SolarEclipseState {
  return {
    mainView: "space",
    eclipseModel: "total",
    groundMode: "total",
    time: 0,
    partialOffset: defaultPartialOffset,
    partialMagnitude: getPartialMagnitude(defaultPartialOffset),
    ...overrides
  };
}

export function stepEclipseTime(state: SolarEclipseState, delta: number): SolarEclipseState {
  return {
    ...state,
    time: clamp(state.time + delta, 0, 1)
  };
}

export function selectMainView(state: SolarEclipseState, mainView: MainView): SolarEclipseState {
  return {
    ...state,
    mainView
  };
}

export function selectEclipseModel(state: SolarEclipseState, eclipseModel: EclipseModel): SolarEclipseState {
  return {
    ...state,
    mainView: "space",
    eclipseModel
  };
}

export function selectGroundMode(state: SolarEclipseState, groundMode: GroundMode): SolarEclipseState {
  return {
    ...state,
    mainView: "ground",
    groundMode
  };
}

export function selectViewFromShadowPoint(state: SolarEclipseState, point: ShadowPoint, groundMode: GroundMode): SolarEclipseState {
  if (groundMode !== "partial") {
    return {
      ...state,
      mainView: "ground",
      groundMode
    };
  }

  const direction = normalizePoint(point);

  return {
    ...state,
    mainView: "ground",
    groundMode: "partial",
    partialOffset: direction,
    partialMagnitude: getPartialMagnitude(point)
  };
}

function getTransitOffset(time: number, moonScale: number): number {
  const contactDistance = groundSunRadius + groundSunRadius * moonScale;

  return (0.5 - clamp(time, 0, 1)) * contactDistance * 2;
}

function getDiscOverlapCoverage(distance: number, moonScale: number): number {
  const sunRadius = groundSunRadius;
  const moonRadius = groundSunRadius * moonScale;

  if (distance >= sunRadius + moonRadius) {
    return 0;
  }

  if (distance <= Math.abs(moonRadius - sunRadius)) {
    return Math.min(1, (Math.PI * Math.min(sunRadius, moonRadius) ** 2) / (Math.PI * sunRadius ** 2));
  }

  const sunPart =
    sunRadius ** 2 *
    Math.acos(clamp((distance ** 2 + sunRadius ** 2 - moonRadius ** 2) / (2 * distance * sunRadius), -1, 1));
  const moonPart =
    moonRadius ** 2 *
    Math.acos(clamp((distance ** 2 + moonRadius ** 2 - sunRadius ** 2) / (2 * distance * moonRadius), -1, 1));
  const lens = 0.5 * Math.sqrt(Math.max(0, (-distance + sunRadius + moonRadius) * (distance + sunRadius - moonRadius) * (distance - sunRadius + moonRadius) * (distance + sunRadius + moonRadius)));

  return clamp((sunPart + moonPart - lens) / (Math.PI * sunRadius ** 2), 0, 1);
}

export function getSpaceMoonPosition(time: number, model: EclipseModel = "total"): SpaceMoonPosition {
  const clampedTime = clamp(time, 0, 1);
  const orbitAngleRad = Math.PI - 0.62 + clampedTime * 1.24;
  const config = spaceModelConfig[model];
  const orbitSin = Math.sin(orbitAngleRad);

  return {
    x: spaceEarth.x + Math.cos(orbitAngleRad) * config.orbitRadius,
    y: spaceEarth.y + orbitSin * config.orbitRadius * Math.sin(spaceMoonOrbitInclinationRad),
    z: orbitSin * config.orbitRadius * Math.cos(spaceMoonOrbitInclinationRad),
    orbitAngleRad
  };
}

function getLineYAtX(start: { x: number; y: number }, end: { x: number; y: number }, targetX: number): number {
  const progress = (targetX - start.x) / (end.x - start.x);

  return start.y + (end.y - start.y) * progress;
}

function getLineValueAtX(start: { x: number; value: number }, end: { x: number; value: number }, targetX: number): number {
  const progress = (targetX - start.x) / (end.x - start.x);

  return start.value + (end.value - start.value) * progress;
}

function getLineXAtY(start: { x: number; y: number }, end: { x: number; y: number }, targetY: number): number {
  const progress = (targetY - start.y) / (end.y - start.y);

  return start.x + (end.x - start.x) * progress;
}

export function getEclipseTangentGeometry(time: number, model: EclipseModel = "total"): EclipseTangentGeometry {
  const config = spaceModelConfig[model];
  const moon = getSpaceMoonPosition(time, model);
  const sunTop = { x: spaceSun.x, y: spaceSun.y + spaceSun.radius };
  const sunBottom = { x: spaceSun.x, y: spaceSun.y - spaceSun.radius };
  const moonTop = { x: moon.x, y: moon.y + config.moonRadius };
  const moonBottom = { x: moon.x, y: moon.y - config.moonRadius };
  const umbraUpperEarthY = getLineYAtX(sunTop, moonTop, spaceEarth.x);
  const umbraLowerEarthY = getLineYAtX(sunBottom, moonBottom, spaceEarth.x);
  const umbraTipX = getLineXAtY(sunTop, moonTop, moon.y);
  const antumbra =
    model === "annular"
      ? {
          upperEarthY: Math.max(umbraUpperEarthY, umbraLowerEarthY),
          lowerEarthY: Math.min(umbraUpperEarthY, umbraLowerEarthY)
        }
      : null;

  return {
    model,
    moon,
    moonRadius: config.moonRadius,
    penumbra: {
      upperEarthY: getLineYAtX(sunTop, moonBottom, spaceEarth.x),
      lowerEarthY: getLineYAtX(sunBottom, moonTop, spaceEarth.x)
    },
    umbra: {
      upperEarthY: umbraUpperEarthY,
      lowerEarthY: umbraLowerEarthY
    },
    antumbra,
    umbraTipX
  };
}

export function getSpaceShadowProjectionGeometry(tangentGeometry: EclipseTangentGeometry): SpaceShadowProjectionGeometry {
  const moon = tangentGeometry.moon;
  const moonRadius = tangentGeometry.moonRadius;
  const centerAtEarth = {
    x: spaceEarth.x,
    y: getLineValueAtX({ x: spaceSun.x, value: 0 }, { x: moon.x, value: moon.y }, spaceEarth.x),
    z: getLineValueAtX({ x: spaceSun.x, value: 0 }, { x: moon.x, value: moon.z }, spaceEarth.x)
  };
  const umbraTip = {
    x: tangentGeometry.umbraTipX,
    y: getLineValueAtX({ x: spaceSun.x, value: 0 }, { x: moon.x, value: moon.y }, tangentGeometry.umbraTipX),
    z: getLineValueAtX({ x: spaceSun.x, value: 0 }, { x: moon.x, value: moon.z }, tangentGeometry.umbraTipX)
  };
  const penumbraFrontEarthZ = getLineValueAtX({ x: spaceSun.x, value: spaceSun.radius }, { x: moon.x, value: moon.z - moonRadius }, spaceEarth.x);
  const penumbraBackEarthZ = getLineValueAtX({ x: spaceSun.x, value: -spaceSun.radius }, { x: moon.x, value: moon.z + moonRadius }, spaceEarth.x);
  const umbraFrontEarthZ = getLineValueAtX({ x: spaceSun.x, value: spaceSun.radius }, { x: moon.x, value: moon.z + moonRadius }, spaceEarth.x);
  const umbraBackEarthZ = getLineValueAtX({ x: spaceSun.x, value: -spaceSun.radius }, { x: moon.x, value: moon.z - moonRadius }, spaceEarth.x);
  const penumbraRadiusY = Math.abs(tangentGeometry.penumbra.lowerEarthY - tangentGeometry.penumbra.upperEarthY) / 2;
  const penumbraRadiusZ = Math.abs(penumbraBackEarthZ - penumbraFrontEarthZ) / 2;
  const centralRadiusY = Math.abs(tangentGeometry.umbra.upperEarthY - tangentGeometry.umbra.lowerEarthY) / 2;
  const centralRadiusZ = Math.abs(umbraFrontEarthZ - umbraBackEarthZ) / 2;

  return {
    centerAtEarth,
    umbraTip,
    penumbraRadiusAtEarth: Math.max(penumbraRadiusY, penumbraRadiusZ),
    centralRadiusAtEarth: Math.max(centralRadiusY, centralRadiusZ)
  };
}

export function getShadowTrackGeometry(tangentGeometry: EclipseTangentGeometry): ShadowTrackGeometry {
  const central = tangentGeometry.antumbra ?? tangentGeometry.umbra;
  const penumbraCenterY = (tangentGeometry.penumbra.upperEarthY + tangentGeometry.penumbra.lowerEarthY) / 2;
  const penumbraSpan = Math.abs(tangentGeometry.penumbra.lowerEarthY - tangentGeometry.penumbra.upperEarthY);
  const centralSpan = Math.abs(central.upperEarthY - central.lowerEarthY);

  return {
    bandY: clamp(penumbraCenterY * 0.48, -spaceEarth.radius * 0.46, spaceEarth.radius * 0.46),
    partialBandScaleY: clamp(penumbraSpan * 0.52, 0.28, 0.58),
    centralBandScaleY: clamp(centralSpan * 0.52, 0.11, 0.18)
  };
}

export function getGroundEclipseAppearance(state: SolarEclipseState): GroundEclipseAppearance {
  const displayTime = 0.5;

  if (state.groundMode === "annular") {
    const moonScale = 0.72;
    const transitOffset = getTransitOffset(displayTime, moonScale);
    const distance = Math.abs(transitOffset);

    return {
      moonOffset: { x: transitOffset, y: 0 },
      moonScale,
      coverage: getDiscOverlapCoverage(distance, moonScale),
      ringVisible: distance < 0.08
    };
  }

  if (state.groundMode === "total") {
    const moonScale = 1.06;
    const transitOffset = getTransitOffset(displayTime, moonScale);
    const distance = Math.abs(transitOffset);

    return {
      moonOffset: { x: transitOffset, y: 0 },
      moonScale,
      coverage: getDiscOverlapCoverage(distance, moonScale),
      ringVisible: false
    };
  }

  const direction = normalizePoint(state.partialOffset);
  const moonScale = 1.02;
  const tangent = normalizePoint({ x: -direction.y, y: direction.x });
  const transitOffset = getTransitOffset(displayTime, moonScale);
  const maxPartialDepth = groundSunRadius * 0.82;
  const midSeparation = groundSunRadius + groundSunRadius * moonScale - state.partialMagnitude * maxPartialDepth;
  const offset = {
    x: direction.x * midSeparation + tangent.x * transitOffset,
    y: direction.y * midSeparation + tangent.y * transitOffset
  };
  const distance = getPointDistance(offset);

  return {
    moonOffset: roundPoint(offset),
    moonScale,
    coverage: getDiscOverlapCoverage(distance, moonScale),
    ringVisible: false
  };
}
