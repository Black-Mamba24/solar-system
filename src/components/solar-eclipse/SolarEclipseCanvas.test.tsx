import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { createInitialEclipseState, getEclipseTangentGeometry, getShadowTrackGeometry, selectEclipseModel, selectGroundMode, spaceEarth } from "@/lib/solar-eclipse";
import { getCentralShadowTrackHalfWidth, getEarthShadowSurfacePoint, getEarthSurfaceTrackModel, getPenumbraShadowVolumeAxisEndPoint, getShadowAxisGeometry, getShadowPointFromLocalPoint, getShadowTrackPointAtProgress, getSweptShadowTrackPoints, SolarEclipseCanvas } from "./SolarEclipseCanvas";

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
    fillRect: vi.fn(),
    set fillStyle(_value: string | CanvasGradient | CanvasPattern) {},
    set globalCompositeOperation(_value: GlobalCompositeOperation) {}
  } as unknown as CanvasRenderingContext2D;
}

function parseVectorAttribute(element: Element, attributeName: string): THREE.Vector3 {
  const values = (element.getAttribute(attributeName) ?? "").split(",").map(Number);

  return new THREE.Vector3(values[0], values[1], values[2]);
}

function parseNumberAttributeTuple(element: Element, attributeName: string): number[] {
  return (element.getAttribute(attributeName) ?? "").split(",").map(Number);
}

function getRenderedShadowVolumeEnd(meshName: string, start: THREE.Vector3): THREE.Vector3 {
  const volume = document.querySelector(`mesh[name="${meshName}"]`);

  expect(volume).toBeInTheDocument();

  return parseVectorAttribute(volume!, "position").multiplyScalar(2).sub(start);
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

  it("keeps the visible penumbra volume on the Sun-Moon shadow axis", () => {
    const surfacePoint = getEarthShadowSurfacePoint(0.5, "total");
    const surfaceRadius = Math.hypot(surfacePoint.local.x, surfacePoint.local.y, surfacePoint.local.z);
    const axisGeometry = getShadowAxisGeometry(0.5, "total");
    const penumbraEndPoint = getPenumbraShadowVolumeAxisEndPoint(0.5, "total");
    const penumbraDirection = penumbraEndPoint.clone().sub(axisGeometry.start).normalize();

    expect(surfaceRadius).toBeCloseTo(spaceEarth.radius, 6);
    expect(surfacePoint.world.x).toBeCloseTo(spaceEarth.x + surfacePoint.local.x, 6);
    expect(surfacePoint.world.y).toBeCloseTo(surfacePoint.local.y, 6);
    expect(surfacePoint.world.z).toBeCloseTo(surfacePoint.local.z, 6);
    expect(penumbraEndPoint.x).toBeCloseTo(spaceEarth.x, 6);
    expect(penumbraDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 6);
  });

  it("keeps penumbra volume endpoints aligned with the light direction throughout the eclipse sweep", () => {
    const samples = {
      total: [0.2, 0.25, 0.5, 0.75, 0.8],
      annular: [0.3, 0.35, 0.5, 0.75, 0.8]
    } as const;

    for (const model of ["total", "annular"] as const) {
      for (const time of samples[model]) {
        const axisGeometry = getShadowAxisGeometry(time, model);
        const endPoint = getPenumbraShadowVolumeAxisEndPoint(time, model);
        const endDirection = endPoint.clone().sub(axisGeometry.start).normalize();
        const offAxisDistance = endPoint.clone().sub(axisGeometry.start).cross(axisGeometry.direction).length();

        expect(endPoint.x).toBeCloseTo(spaceEarth.x, 6);
        expect(endDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 6);
        expect(offAxisDistance).toBeCloseTo(0, 6);
      }
    }
  });

  it("renders the penumbra volume endpoint on the Sun-Moon axis during entry and exit", () => {
    const samples = [
      { model: "total" as const, time: 0.2 },
      { model: "total" as const, time: 0.8 },
      { model: "annular" as const, time: 0.3 },
      { model: "annular" as const, time: 0.75 }
    ];

    for (const sample of samples) {
      const state =
        sample.model === "annular"
          ? selectEclipseModel(createInitialEclipseState({ time: sample.time }), "annular")
          : createInitialEclipseState({ time: sample.time });
      const { unmount } = render(<SolarEclipseCanvas locale="zh" state={state} view="space" onShadowPointSelect={() => undefined} />);
      const axisGeometry = getShadowAxisGeometry(sample.time, sample.model);
      const penumbraVolume = document.querySelector('mesh[name="eclipse-penumbra-volume"]');
      const penumbraGeometry = document.querySelector('mesh[name="eclipse-penumbra-volume"] cylinderGeometry');

      expect(penumbraVolume).toBeInTheDocument();
      expect(penumbraGeometry).toBeInTheDocument();

      const renderedCenter = parseVectorAttribute(penumbraVolume!, "position");
      const [, , renderedLength] = parseNumberAttributeTuple(penumbraGeometry!, "args");
      const renderedEnd = renderedCenter.clone().multiplyScalar(2).sub(axisGeometry.start);
      const renderedDirection = renderedEnd.clone().sub(axisGeometry.start).normalize();
      const offAxisDistance = renderedEnd.clone().sub(axisGeometry.start).cross(axisGeometry.direction).length();

      expect(renderedLength).toBeCloseTo(renderedEnd.distanceTo(axisGeometry.start), 6);
      expect(renderedDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 6);
      expect(offAxisDistance).toBeCloseTo(0, 6);

      unmount();
    }
  });

  it("renders totality umbra to the Earth surface instead of truncating it", () => {
    for (const time of [0.2, 0.5, 0.8]) {
      const state = createInitialEclipseState({ time });
      const { unmount } = render(<SolarEclipseCanvas locale="zh" state={state} view="space" onShadowPointSelect={() => undefined} />);
      const axisGeometry = getShadowAxisGeometry(time, "total");
      const renderedUmbraEnd = getRenderedShadowVolumeEnd("eclipse-umbra-volume", axisGeometry.start);
      const renderedDirection = renderedUmbraEnd.clone().sub(axisGeometry.start).normalize();

      expect(renderedUmbraEnd.distanceTo(axisGeometry.axisEnd)).toBeCloseTo(0, 6);
      expect(renderedUmbraEnd.distanceTo(new THREE.Vector3(spaceEarth.x, spaceEarth.y, 0))).toBeCloseTo(spaceEarth.radius, 6);
      expect(renderedDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 6);

      unmount();
    }
  });

  it("renders annularity as antumbra reaching Earth after the umbra tip ends before Earth", () => {
    for (const time of [0.35, 0.5, 0.65]) {
      const state = selectEclipseModel(createInitialEclipseState({ time }), "annular");
      const { unmount } = render(<SolarEclipseCanvas locale="zh" state={state} view="space" onShadowPointSelect={() => undefined} />);
      const tangentGeometry = getEclipseTangentGeometry(time, "annular");
      const axisGeometry = getShadowAxisGeometry(time, "annular");
      const projectionTip = getRenderedShadowVolumeEnd("eclipse-umbra-volume", axisGeometry.start);
      const antumbraEnd = getRenderedShadowVolumeEnd("eclipse-antumbra-volume", projectionTip);
      const antumbraGeometry = document.querySelector('mesh[name="eclipse-antumbra-volume"] cylinderGeometry');
      const umbraDirection = projectionTip.clone().sub(axisGeometry.start).normalize();
      const antumbraDirection = antumbraEnd.clone().sub(projectionTip).normalize();
      const [antumbraEndRadius] = parseNumberAttributeTuple(antumbraGeometry!, "args");

      expect(projectionTip.x).toBeCloseTo(tangentGeometry.umbraTipX, 6);
      expect(projectionTip.distanceTo(new THREE.Vector3(spaceEarth.x, spaceEarth.y, 0))).toBeGreaterThan(spaceEarth.radius);
      expect(projectionTip.distanceTo(axisGeometry.start)).toBeLessThan(axisGeometry.axisEnd.distanceTo(axisGeometry.start));
      expect(umbraDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 6);
      expect(antumbraEnd.distanceTo(axisGeometry.axisEnd)).toBeCloseTo(0, 6);
      expect(antumbraEnd.distanceTo(new THREE.Vector3(spaceEarth.x, spaceEarth.y, 0))).toBeCloseTo(spaceEarth.radius, 6);
      expect(antumbraDirection.dot(axisGeometry.direction)).toBeCloseTo(1, 6);
      expect(antumbraEndRadius).toBeLessThan(0.04);

      unmount();
    }
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
    expect(getShadowTrackPointAtProgress(0.3, "annular")).toBeNull();
    expect(getShadowTrackPointAtProgress(0.35, "annular")).not.toBeNull();
    expect(getShadowTrackPointAtProgress(0.65, "annular")).not.toBeNull();
    expect(getShadowTrackPointAtProgress(0.7, "annular")).toBeNull();
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
    expect(document.querySelector('mesh[name="earth-umbra-click-target"] meshBasicMaterial[opacity="0"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-penumbra-click-target"] meshBasicMaterial[opacity="0"]')).toBeInTheDocument();
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
    expect(document.querySelector('line[name="eclipse-antumbra-y-upper-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-antumbra-y-lower-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-antumbra-z-front-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('line[name="eclipse-antumbra-z-back-tangent"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-annular-eclipse-band"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-current-partial-eclipse-band"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-current-total-eclipse-band"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-antumbra-click-target"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-antumbra-click-target"] meshBasicMaterial[opacity="0"]')).toBeInTheDocument();
  });

  it("keeps the annular surface track aligned with the total-eclipse track shape", () => {
    const totalTrack = getShadowTrackGeometry(getEclipseTangentGeometry(0.5, "total"));
    const annularTrack = getShadowTrackGeometry(getEclipseTangentGeometry(0.5, "annular"));
    const totalHalfWidth = getCentralShadowTrackHalfWidth(totalTrack.centralBandScaleY);

    expect(getEarthSurfaceTrackModel("annular")).toBe("total");
    expect(getEarthSurfaceTrackModel("total")).toBe("total");
    expect(totalHalfWidth).toBeGreaterThan(0.002);
    expect(annularTrack.centralBandScaleY).not.toBe(totalTrack.centralBandScaleY);
    expect(getSweptShadowTrackPoints(0.5, "annular")).not.toEqual(getSweptShadowTrackPoints(0.5, "total"));
  });

  it("dispatches annular shadow clicks from the antumbra target", () => {
    const onShadowPointSelect = vi.fn();
    const state = selectEclipseModel(createInitialEclipseState({ time: 0.5 }), "annular");

    render(<SolarEclipseCanvas locale="zh" state={state} view="space" onShadowPointSelect={onShadowPointSelect} />);

    fireEvent.click(document.querySelector('mesh[name="earth-antumbra-click-target"]')!);

    expect(onShadowPointSelect).toHaveBeenCalledWith({ x: 0.04, y: 0.02 }, "annular");
  });

  it("renders ground eclipse discs with stable names outside the space view", () => {
    const { rerender } = render(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState(), "total")} view="ground" onShadowPointSelect={() => undefined} />);

    for (const mode of ["total", "partial", "annular"] as const) {
      rerender(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState(), mode)} view="ground" onShadowPointSelect={() => undefined} />);

      expect(document.querySelector('group[name="ground-eclipse-disc-view"]')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-solar-corona"]')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-sun-disc"]')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-annular-light-ring"]')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-moon-occluder"]')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-solar-corona"] planeGeometry')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-sun-disc"] circleGeometry')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-annular-light-ring"] ringGeometry')).toBeInTheDocument();
      expect(document.querySelector('mesh[name="ground-moon-occluder"] circleGeometry')).toBeInTheDocument();
    }

    expect(document.querySelector('group[name="ground-real-sun-model"]')).not.toBeInTheDocument();
    expect(document.querySelector('points[name="sun-coronal-density-haze"]')).not.toBeInTheDocument();
  });

  it("shows total eclipse corona, annular ring, and partial offset using the unified ground model", () => {
    const { rerender } = render(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState({ time: 0.5 }), "total")} view="ground" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('mesh[name="ground-solar-corona"][renderOrder="0"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="ground-sun-disc"][renderOrder="1"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="ground-annular-light-ring"][renderOrder="2"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="ground-moon-occluder"][renderOrder="3"]')).toBeInTheDocument();
    expect(document.querySelector('meshBasicMaterial[name="ground-solar-corona-material"][opacity="0.88"]')).toBeInTheDocument();
    expect(document.querySelector('meshBasicMaterial[name="ground-annular-light-ring-material"][opacity="0"]')).toBeInTheDocument();

    rerender(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState({ time: 0.5 }), "annular")} view="ground" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('meshBasicMaterial[name="ground-solar-corona-material"][opacity="0"]')).toBeInTheDocument();
    expect(document.querySelector('meshBasicMaterial[name="ground-annular-light-ring-material"][opacity="0.28"]')).toBeInTheDocument();

    rerender(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState({ time: 0.5 }), "partial")} view="ground" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('meshBasicMaterial[name="ground-solar-corona-material"][opacity="0"]')).toBeInTheDocument();
    expect(document.querySelector('meshBasicMaterial[name="ground-annular-light-ring-material"][opacity="0"]')).toBeInTheDocument();
  });

  it("passes physical apparent-disc radii into the ground eclipse geometries", () => {
    const { rerender } = render(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState({ time: 0.5 }), "total")} view="ground" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('mesh[name="ground-sun-disc"] circleGeometry')).toHaveAttribute("args", expect.stringContaining("1.35"));
    expect(document.querySelector('mesh[name="ground-moon-occluder"] circleGeometry')).toHaveAttribute("args", expect.stringContaining("1.404"));

    rerender(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState({ time: 0.5 }), "annular")} view="ground" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('mesh[name="ground-sun-disc"] circleGeometry')).toHaveAttribute("args", expect.stringContaining("1.35"));
    expect(document.querySelector('mesh[name="ground-moon-occluder"] circleGeometry')).toHaveAttribute("args", expect.stringContaining("1.161"));
    expect(document.querySelector('mesh[name="ground-annular-light-ring"] ringGeometry')).toHaveAttribute("args", expect.stringContaining("1.161"));
    expect(document.querySelector('mesh[name="ground-annular-light-ring"] ringGeometry')).toHaveAttribute("args", expect.stringContaining("1.35"));

    rerender(<SolarEclipseCanvas locale="zh" state={selectGroundMode(createInitialEclipseState({ time: 0.5 }), "partial")} view="ground" onShadowPointSelect={() => undefined} />);

    expect(document.querySelector('mesh[name="ground-sun-disc"] circleGeometry')).toHaveAttribute("args", expect.stringContaining("1.35"));
    expect(document.querySelector('mesh[name="ground-moon-occluder"] circleGeometry')).toHaveAttribute("args", expect.stringContaining("1.35"));
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
