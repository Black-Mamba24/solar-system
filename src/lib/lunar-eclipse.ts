export type LunarEclipseCase = "total" | "partial";
export type LunarEclipseView = "space" | "ground";
export type LunarEclipseStageCode = "P1" | "U1" | "U2" | "MAX" | "U3" | "U4" | "P4";

export interface LunarEclipseState {
  mainView: LunarEclipseView;
  eclipseCase: LunarEclipseCase;
  time: number;
  playing: boolean;
}

export interface LunarEclipseStage {
  code: LunarEclipseStageCode;
  labelKey: LunarEclipseStageCode;
}

export interface LunarEclipseGeometry {
  moon: {
    x: number;
    y: number;
    z: number;
    radius: number;
  };
  shadowAxis: {
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
    direction: {
      x: number;
      y: number;
      z: number;
    };
  };
  penumbraRadiusAtMoon: number;
  umbraRadiusAtMoon: number;
  umbraRadiusAtEarth: number;
  penumbraCoverage: number;
  umbraCoverage: number;
  umbraCoversWholeMoon: boolean;
  umbraBoundaryArcRadius: number;
  groundShadowCenter: {
    x: number;
    y: number;
  };
}

export interface LunarEclipseMoonAppearance {
  brightness: number;
  penumbralDimming: number;
  umbralDimming: number;
  redAtmosphericLight: number;
  selfIlluminated: false;
  umbraCoverage: number;
  penumbraCoverage: number;
}

export const lunarEclipseSun = { x: -4.2, y: 0, z: 0, radius: 0.72 } as const;
export const lunarEclipseEarth = { x: 0, y: 0, z: 0, radius: 0.64 } as const;
export const lunarEclipseMoon = { x: 3.15, y: 0, z: 0, radius: 0.18 } as const;

const umbraRadiusAtEarth = lunarEclipseEarth.radius * 0.98;
const lunarEclipseShadowEndX = lunarEclipseMoon.x + 0.65;

function getLineYAtX(start: { x: number; y: number }, through: { x: number; y: number }, targetX: number): number {
  const progress = (targetX - start.x) / (through.x - start.x);

  return start.y + (through.y - start.y) * progress;
}

export function getLunarEclipseUmbraRadiusAtX(x: number): number {
  const sunTop = { x: lunarEclipseSun.x, y: lunarEclipseSun.radius };
  const earthTop = { x: lunarEclipseEarth.x, y: umbraRadiusAtEarth };

  return Math.abs(getLineYAtX(sunTop, earthTop, x));
}

export function getLunarEclipsePenumbraRadiusAtX(x: number): number {
  const sunBottom = { x: lunarEclipseSun.x, y: -lunarEclipseSun.radius };
  const earthTop = { x: lunarEclipseEarth.x, y: lunarEclipseEarth.radius };

  return Math.abs(getLineYAtX(sunBottom, earthTop, x));
}

const umbraRadiusAtMoon = getLunarEclipseUmbraRadiusAtX(lunarEclipseMoon.x);
const penumbraRadiusAtMoon = getLunarEclipsePenumbraRadiusAtX(lunarEclipseMoon.x);
const moonPathHalfHeight = penumbraRadiusAtMoon + lunarEclipseMoon.radius;
const shadowAxisEndX = lunarEclipseShadowEndX;
const caseImpactOffset: Record<LunarEclipseCase, number> = {
  total: 0.04,
  partial: 0.48
};

const totalStageTimeline: Array<{ maxTime: number; code: LunarEclipseStageCode }> = [
  { maxTime: 0.16, code: "P1" },
  { maxTime: 0.38, code: "U1" },
  { maxTime: 0.46, code: "U2" },
  { maxTime: 0.56, code: "MAX" },
  { maxTime: 0.64, code: "U3" },
  { maxTime: 0.84, code: "U4" },
  { maxTime: 1, code: "P4" }
];

const partialStageTimeline: Array<{ maxTime: number; code: LunarEclipseStageCode }> = [
  { maxTime: 0.2, code: "P1" },
  { maxTime: 0.46, code: "U1" },
  { maxTime: 0.54, code: "MAX" },
  { maxTime: 0.8, code: "U4" },
  { maxTime: 1, code: "P4" }
];

const stageSequences: Record<LunarEclipseCase, LunarEclipseStageCode[]> = {
  total: ["P1", "U1", "U2", "MAX", "U3", "U4", "P4"],
  partial: ["P1", "U1", "MAX", "U4", "P4"]
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

function getMoonPathY(time: number): number {
  return round((clamp(time, 0, 1) - 0.5) * moonPathHalfHeight * 2);
}

function getCircleOverlapFraction(shadowRadius: number, moonRadius: number, distance: number): number {
  if (distance >= shadowRadius + moonRadius) {
    return 0;
  }

  if (distance <= Math.abs(shadowRadius - moonRadius)) {
    const coveredRadius = Math.min(shadowRadius, moonRadius);
    return clamp((coveredRadius * coveredRadius) / (moonRadius * moonRadius), 0, 1);
  }

  const shadowPart = shadowRadius ** 2 * Math.acos(clamp((distance ** 2 + shadowRadius ** 2 - moonRadius ** 2) / (2 * distance * shadowRadius), -1, 1));
  const moonPart = moonRadius ** 2 * Math.acos(clamp((distance ** 2 + moonRadius ** 2 - shadowRadius ** 2) / (2 * distance * moonRadius), -1, 1));
  const lens = 0.5 * Math.sqrt(Math.max(0, (-distance + shadowRadius + moonRadius) * (distance + shadowRadius - moonRadius) * (distance - shadowRadius + moonRadius) * (distance + shadowRadius + moonRadius)));

  return clamp((shadowPart + moonPart - lens) / (Math.PI * moonRadius ** 2), 0, 1);
}

export function createInitialLunarEclipseState(overrides: Partial<LunarEclipseState> = {}): LunarEclipseState {
  return {
    mainView: "space",
    eclipseCase: "total",
    time: 0,
    playing: false,
    ...overrides
  };
}

export function stepLunarEclipseTime(state: LunarEclipseState, delta: number): LunarEclipseState {
  return {
    ...state,
    time: clamp(state.time + delta, 0, 1)
  };
}

export function selectLunarEclipseCase(state: LunarEclipseState, eclipseCase: LunarEclipseCase): LunarEclipseState {
  return {
    ...state,
    eclipseCase
  };
}

export function selectLunarEclipseView(state: LunarEclipseState, mainView: LunarEclipseView): LunarEclipseState {
  return {
    ...state,
    mainView
  };
}

export function getLunarEclipseGeometry(state: LunarEclipseState): LunarEclipseGeometry {
  const clampedTime = clamp(state.time, 0, 1);
  const impactOffset = caseImpactOffset[state.eclipseCase];
  const moon = {
    x: lunarEclipseMoon.x,
    y: getMoonPathY(clampedTime),
    z: impactOffset,
    radius: lunarEclipseMoon.radius
  };
  const distanceToShadowAxis = Math.hypot(moon.y, moon.z);
  const penumbraCoverage = getCircleOverlapFraction(penumbraRadiusAtMoon, moon.radius, distanceToShadowAxis);
  const umbraCoverage = getCircleOverlapFraction(umbraRadiusAtMoon, moon.radius, distanceToShadowAxis);

  return {
    moon,
    shadowAxis: {
      start: { x: lunarEclipseEarth.x, y: lunarEclipseEarth.y, z: lunarEclipseEarth.z },
      end: { x: shadowAxisEndX, y: lunarEclipseEarth.y, z: lunarEclipseEarth.z },
      direction: { x: 1, y: 0, z: 0 }
    },
    penumbraRadiusAtMoon,
    umbraRadiusAtMoon,
    umbraRadiusAtEarth,
    penumbraCoverage: round(penumbraCoverage),
    umbraCoverage: round(umbraCoverage),
    umbraCoversWholeMoon: distanceToShadowAxis + moon.radius <= umbraRadiusAtMoon,
    umbraBoundaryArcRadius: umbraRadiusAtMoon,
    groundShadowCenter: {
      x: round(-moon.y),
      y: round(-moon.z)
    }
  };
}

export function getLunarEclipseStage(state: LunarEclipseState): LunarEclipseStage {
  const timeline = state.eclipseCase === "total" ? totalStageTimeline : partialStageTimeline;
  const time = clamp(state.time, 0, 1);
  const stage = timeline.find((item) => time <= item.maxTime) ?? timeline[timeline.length - 1];

  return {
    code: stage.code,
    labelKey: stage.code
  };
}

export function getLunarEclipseStageSequence(eclipseCase: LunarEclipseCase): LunarEclipseStageCode[] {
  return stageSequences[eclipseCase];
}

export function getLunarEclipseMoonAppearance(state: LunarEclipseState): LunarEclipseMoonAppearance {
  const geometry = getLunarEclipseGeometry(state);
  const penumbralOnlyCoverage = clamp(geometry.penumbraCoverage - geometry.umbraCoverage, 0, 1);
  const penumbralDimming = penumbralOnlyCoverage * 0.16;
  const umbralDimming = geometry.umbraCoverage * 0.62;
  const redAtmosphericLight = geometry.umbraCoversWholeMoon ? 0.34 : geometry.umbraCoverage * 0.18;
  const brightness = round(clamp(1 - penumbralDimming - umbralDimming + redAtmosphericLight * 0.18, 0.18, 1));

  return {
    brightness,
    penumbralDimming: round(penumbralDimming),
    umbralDimming: round(umbralDimming),
    redAtmosphericLight: round(redAtmosphericLight),
    selfIlluminated: false,
    umbraCoverage: geometry.umbraCoverage,
    penumbraCoverage: geometry.penumbraCoverage
  };
}
