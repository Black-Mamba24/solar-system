import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { createInitialEclipseState, getSpaceMoonPosition, selectEclipseModel, selectGroundMode, spaceEarth } from "@/lib/solar-eclipse";
import { getEarthShadowSurfacePoint, getShadowAxisGeometry, getShadowPointFromLocalPoint, getShadowTrackPointAtProgress, getShadowVolumeFillEndPoint, getShadowVolumeFillProgress, getSweptShadowTrackPoints, SolarEclipseCanvas } from "./SolarEclipseCanvas";

const dreiMocks = vi.hoisted(() => ({
  orbitControlsProps: [] as Array<Record<string, unknown>>
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="solar-eclipse-canvas">{children}</div>,
  useFrame: () => undefined,
  useThree: () => ({
    camera: {
      position: { set: vi.fn() },
      lookAt: vi.fn()
    }
  })
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: (props: Record<string, unknown>) => {
    dreiMocks.orbitControlsProps.push(props);
    return <div data-testid="eclipse-orbit-controls" />;
  },
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock("@/components/solar-system/procedural-models/useImageTexture", () => ({
  useImageTexture: () => null
}));

function createCanvasContextMock() {
  const gradient = { addColorStop: vi.fn() };

  return {
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    createRadialGradient: vi.fn(() => gradient),
    ellipse: vi.fn(),
    fill: vi.fn(),
    set fillStyle(_value: string | CanvasGradient | CanvasPattern) {},
    set globalCompositeOperation(_value: GlobalCompositeOperation) {}
  } as unknown as CanvasRenderingContext2D;
}

describe("SolarEclipseCanvas", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((contextId) => (contextId === "2d" ? createCanvasContextMock() : null));
  });

  afterEach(() => {
    dreiMocks.orbitControlsProps = [];
    vi.restoreAllMocks();
  });

  it("maps local shadow click positions into normalized penumbra coordinates", () => {
    expect(getShadowPointFromLocalPoint({ x: 0.37, y: -0.18 }, 0.74)).toEqual({ x: 0.5, y: -0.24 });
    expect(getShadowPointFromLocalPoint({ x: -0.74, y: 0.74 }, 0.74)).toEqual({ x: -1, y: 1 });
  });

  it("anchors the visible penumbra volume to the current Earth surface shadow point", () => {
    const surfacePoint = getEarthShadowSurfacePoint(0.5, "total");
    const surfaceRadius = Math.hypot(surfacePoint.local.x, surfacePoint.local.y, surfacePoint.local.z);

    expect(surfaceRadius).toBeCloseTo(spaceEarth.radius, 6);
    expect(surfacePoint.world.x).toBeCloseTo(spaceEarth.x + surfacePoint.local.x, 6);
    expect(surfacePoint.world.y).toBeCloseTo(surfacePoint.local.y, 6);
    expect(surfacePoint.world.z).toBeCloseTo(surfacePoint.local.z, 6);
  });

  it("moves the current Earth shadow patch along the sweep instead of pinning a full static path", () => {
    const early = getShadowTrackPointAtProgress(0.25, "total");
    const middle = getShadowTrackPointAtProgress(0.5, "total");
    const late = getShadowTrackPointAtProgress(0.75, "total");
    const middleSurfacePoint = getEarthShadowSurfacePoint(0.5, "total");

    expect(early).not.toBeNull();
    expect(middle).not.toBeNull();
    expect(late).not.toBeNull();
    expect(middle!.x).toBeCloseTo(-spaceEarth.radius, 6);
    expect(early!.x).toBeGreaterThan(middle!.x);
    expect(late!.x).toBeGreaterThan(middle!.x);
    expect(early!.y).toBeGreaterThan(0);
    expect(late!.y).toBeLessThan(0);
    expect(early!.z).toBeGreaterThan(0);
    expect(late!.z).toBeLessThan(0);
    expect(middleSurfacePoint.local.x).toBeCloseTo(middle!.x, 6);
    expect(middleSurfacePoint.local.y).toBeCloseTo(middle!.y, 6);
  });

  it("grows the swept Earth shadow track as playback progresses", () => {
    const start = getSweptShadowTrackPoints(0, "total");
    const middle = getSweptShadowTrackPoints(0.5, "total");
    const end = getSweptShadowTrackPoints(1, "total");

    expect(start.length).toBeLessThan(middle.length);
    expect(end.length).toBeGreaterThan(middle.length);
    expect(start.length).toBe(0);
    expect(new Set(end.map((point) => `${point.x.toFixed(4)},${point.y.toFixed(4)},${point.z.toFixed(4)}`)).size).toBe(end.length);
  });

  it("does not create Earth track points before entry or after exit", () => {
    expect(getShadowTrackPointAtProgress(0, "total")).toBeNull();
    expect(getShadowTrackPointAtProgress(0.15, "total")).toBeNull();
    expect(getShadowTrackPointAtProgress(0.2, "total")).not.toBeNull();
    expect(getShadowTrackPointAtProgress(0.8, "total")).not.toBeNull();
    expect(getShadowTrackPointAtProgress(0.85, "total")).toBeNull();
    expect(getShadowTrackPointAtProgress(1, "total")).toBeNull();
    expect(getShadowTrackPointAtProgress(0.2, "annular")).toBeNull();
    expect(getShadowTrackPointAtProgress(0.3, "annular")).not.toBeNull();
    expect(getShadowTrackPointAtProgress(0.8, "annular")).toBeNull();
  });

  it("keeps filled shadow volume sides clear of the Earth surface", () => {
    const moon = getSpaceMoonPosition(0.5, "total");
    const start = new THREE.Vector3(moon.x, moon.y, moon.z);
    const axisGeometry = getShadowAxisGeometry(0.5, "total");
    const surfaceEnd = axisGeometry.axisEnd;
    const startRadius = 0.24 * 0.92;
    const surfaceEndRadius = 0.48;
    const fillProgress = getShadowVolumeFillProgress(start, surfaceEnd, startRadius, surfaceEndRadius);
    const fillEnd = getShadowVolumeFillEndPoint(start, surfaceEnd, startRadius, surfaceEndRadius);
    const fillDirection = fillEnd.clone().sub(start).normalize();

    expect(fillEnd.distanceTo(start)).toBeLessThan(surfaceEnd.distanceTo(start));
    expect(fillEnd.distanceTo(surfaceEnd)).toBeGreaterThan(0.04);
    expect(fillDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 5);
    for (let index = 0; index <= 16; index += 1) {
      const sampleProgress = index / 16;
      const center = start.clone().lerp(fillEnd, sampleProgress);
      const radius = startRadius + (surfaceEndRadius - startRadius) * fillProgress * sampleProgress;

      expect(center.distanceTo(new THREE.Vector3(spaceEarth.x, spaceEarth.y, 0)) - radius).toBeGreaterThan(spaceEarth.radius);
    }
  });

  it("keeps shadow axis endpoints aligned with the Sun-Moon direction", () => {
    for (const model of ["total", "annular"] as const) {
      for (const time of [0, 0.2, 0.5, 0.8, 1]) {
        const axisGeometry = getShadowAxisGeometry(time, model);
        const endpointDirection = axisGeometry.axisEnd.clone().sub(axisGeometry.start).normalize();

        expect(endpointDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 5);
      }
    }
  });

  it("renders textured Sun, Earth, and Moon models in the space mechanism view", () => {
    render(<SolarEclipseCanvas locale="zh" state={createInitialEclipseState({ time: 0.5 })} view="space" onShadowPointSelect={() => undefined} />);

    expect(screen.getByTestId("solar-eclipse-canvas")).toBeInTheDocument();
    expect(document.querySelector('group[name="eclipse-sun-body"] mesh[name="sun-surface"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="eclipse-earth-body"] mesh[name="earth-surface"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="eclipse-moon-body"] mesh[name="moon-surface"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-umbra-volume"] cylinderGeometry')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-penumbra-volume"] cylinderGeometry')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-umbra-volume"] meshBasicMaterial[name="eclipse-umbra-volume-wireframe-material"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-penumbra-volume"] meshBasicMaterial[name="eclipse-penumbra-volume-wireframe-material"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-penumbra-y-upper-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-penumbra-y-lower-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-umbra-y-upper-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-umbra-y-lower-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-penumbra-z-front-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-penumbra-z-back-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-umbra-z-front-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-umbra-z-back-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-shadow-axis-surface-contact"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-sun-moon-upper-tangent"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-umbra-cone"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-penumbra-cone"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-moon-visibility-rim"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-atmosphere"]')).not.toBeInTheDocument();
    expect(document.querySelector('points[name="sun-coronal-density-haze"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-antumbra-cone"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-current-partial-eclipse-band"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-current-total-eclipse-band"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-umbra-click-target"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-penumbra-click-target"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-umbra-click-target"] meshBasicMaterial[opacity="0.001"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-penumbra-click-target"] meshBasicMaterial[opacity="0.001"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-antumbra-click-target"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-partial-eclipse-band"] circleGeometry')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-total-eclipse-band"] circleGeometry')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-partial-eclipse-band"] meshBasicMaterial[depthTest="false"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-total-eclipse-band"] meshBasicMaterial[opacity="0.88"]')).not.toBeInTheDocument();
  });

  it("renders the Earth shadow band as a surface patch rather than a flat disc", () => {
    const { rerender } = render(<SolarEclipseCanvas locale="zh" state={createInitialEclipseState({ time: 0.3 })} view="space" onShadowPointSelect={() => undefined} />);

    rerender(<SolarEclipseCanvas locale="zh" state={createInitialEclipseState({ time: 0.7 })} view="space" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('mesh[name="earth-partial-eclipse-band"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-partial-eclipse-band"] circleGeometry')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-partial-eclipse-band"] planeGeometry')).not.toBeInTheDocument();
  });

  it("dispatches semantic shadow clicks from the Earth shadow hot zones", () => {
    const onShadowPointSelect = vi.fn();
    render(<SolarEclipseCanvas locale="zh" state={createInitialEclipseState({ time: 0.5 })} view="space" onShadowPointSelect={onShadowPointSelect} />);

    fireEvent.click(document.querySelector('mesh[name="earth-penumbra-click-target"]')!);
    fireEvent.click(document.querySelector('mesh[name="earth-umbra-click-target"]')!);

    expect(onShadowPointSelect).toHaveBeenNthCalledWith(1, { x: 0.72, y: 0.42 }, "partial");
    expect(onShadowPointSelect).toHaveBeenNthCalledWith(2, { x: 0.04, y: 0.02 }, "total");
  });

  it("renders antumbra affordance for annular space exploration", () => {
    const state = selectEclipseModel(createInitialEclipseState({ time: 0.5 }), "annular");

    render(<SolarEclipseCanvas locale="zh" state={state} view="space" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('mesh[name="eclipse-antumbra-cone"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-antumbra-volume"] cylinderGeometry')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="eclipse-antumbra-volume"] meshBasicMaterial[name="eclipse-antumbra-volume-wireframe-material"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-annular-eclipse-band"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-current-partial-eclipse-band"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-current-total-eclipse-band"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-antumbra-click-target"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-antumbra-click-target"] meshBasicMaterial[opacity="0.001"]')).toBeInTheDocument();
  });

  it("dispatches annular shadow clicks from the antumbra target", () => {
    const onShadowPointSelect = vi.fn();
    const state = selectEclipseModel(createInitialEclipseState({ time: 0.5 }), "annular");

    render(<SolarEclipseCanvas locale="zh" state={state} view="space" onShadowPointSelect={onShadowPointSelect} />);

    fireEvent.click(document.querySelector('mesh[name="earth-antumbra-click-target"]')!);

    expect(onShadowPointSelect).toHaveBeenCalledWith({ x: 0.04, y: 0.02 }, "annular");
  });

  it("renders ground eclipse discs with stable names outside the space view", () => {
    const state = selectGroundMode(createInitialEclipseState({ time: 0 }), "partial");

    render(<SolarEclipseCanvas locale="zh" state={state} view="ground" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('group[name="ground-eclipse-disc-view"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="ground-sun-disc"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="ground-moon-occluder"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="ground-real-sun-model"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="ground-solar-corona"]')).not.toBeInTheDocument();
    expect(document.querySelector('points[name="sun-coronal-density-haze"]')).not.toBeInTheDocument();
  });

  it("keeps ground eclipse views front-facing instead of orbit-rotatable", () => {
    const state = selectGroundMode(createInitialEclipseState(), "total");

    render(<SolarEclipseCanvas locale="zh" state={state} view="ground" onShadowPointSelect={() => undefined} />);

    expect(dreiMocks.orbitControlsProps.at(-1)).toMatchObject({
      enableRotate: false,
      enablePan: false,
      enableZoom: false
    });
  });
});
