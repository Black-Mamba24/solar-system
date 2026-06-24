import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bodies } from "@/data/bodies";
import { CelestialBodyMesh } from "./CelestialBodyMesh";
import { getCameraPresetView, SolarSystemCanvas } from "./SolarSystemCanvas";
import { getBodyFallbackColor, getOrbitCenter, getSceneBodyPosition } from "./scene-helpers";

const dreiMocks = vi.hoisted(() => ({
  orbitControlsProps: [] as Array<Record<string, unknown>>,
  useTexture: vi.fn()
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
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
    return <div data-testid="orbit-controls" />;
  },
  Html: ({ children, position }: { children: React.ReactNode; position?: [number, number, number] }) => (
    <div data-html-position={position?.join(",")}>{children}</div>
  ),
  useTexture: dreiMocks.useTexture
}));

describe("SolarSystemCanvas", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    dreiMocks.orbitControlsProps = [];
    vi.restoreAllMocks();
  });

  it("renders the scene container and compressed scale notice", () => {
    render(
      <SolarSystemCanvas
        locale="zh"
        elapsedDays={0}
        cameraPreset="full"
        selectedBodyId="earth"
        layers={{ labels: true, orbits: true, moonOrbit: true }}
        onSelectBody={() => undefined}
      />
    );

    expect(screen.getByTestId("canvas")).toBeInTheDocument();
    expect(screen.getByText("比例经过教学压缩")).toBeInTheDocument();
    expect(screen.getByText("缩放比例尺")).toBeInTheDocument();
    expect(screen.getByText("10 AU")).toBeInTheDocument();
    expect(screen.getByLabelText("当前缩放位置")).toBeInTheDocument();
    expect(screen.getByText("10.0 AU")).toBeInTheDocument();
  });

  it("includes the main asteroid belt in the full scene", () => {
    render(
      <SolarSystemCanvas
        locale="en"
        elapsedDays={0}
        cameraPreset="full"
        selectedBodyId="earth"
        layers={{ labels: true, orbits: true, moonOrbit: true }}
        onSelectBody={() => undefined}
      />
    );

    expect(document.querySelector('points[name="asteroid-belt"]')).toBeInTheDocument();
  });

  it("positions child bodies relative to their parent body", () => {
    const earth = bodies.find((body) => body.id === "earth");
    const moon = bodies.find((body) => body.id === "moon");

    expect(earth?.orbit).toBeDefined();
    expect(moon?.orbit).toBeDefined();

    const earthPosition = getSceneBodyPosition(earth!, bodies, 0);
    const moonOffset = getSceneBodyPosition({ ...moon!, parentId: undefined }, bodies, 0);
    const moonPosition = getSceneBodyPosition(moon!, bodies, 0);

    expect(moonPosition).toEqual([
      earthPosition[0] + moonOffset[0],
      earthPosition[1] + moonOffset[1],
      earthPosition[2] + moonOffset[2]
    ]);
  });

  it("centers child orbit lines on their parent body", () => {
    const earth = bodies.find((body) => body.id === "earth");
    const moon = bodies.find((body) => body.id === "moon");

    expect(earth?.orbit).toBeDefined();
    expect(moon?.orbit).toBeDefined();
    expect(getOrbitCenter(moon!, bodies, 0)).toEqual(getSceneBodyPosition(earth!, bodies, 0));
  });

  it("does not load texture files before texture assets exist", () => {
    CelestialBodyMesh({
      body: bodies[0],
      bodies,
      locale: "zh",
      elapsedDays: 0,
      selected: false,
      showLabel: false,
      onSelectBody: () => undefined
    });

    expect(dreiMocks.useTexture).not.toHaveBeenCalled();
  });

  it("places labels below the clickable body mesh", () => {
    const earth = bodies.find((body) => body.id === "earth")!;

    render(
      <CelestialBodyMesh
        body={earth}
        bodies={bodies}
        locale="en"
        elapsedDays={0}
        selected={false}
        showLabel={true}
        onSelectBody={() => undefined}
      />
    );

    expect(screen.getByText("Earth").parentElement).toHaveAttribute("data-html-position", `0,${-(earth.orbit!.displayRadius + 0.52)},0`);
    expect(screen.getByText("Earth")).toHaveClass("whitespace-nowrap");
  });

  it("provides a single full overview camera", () => {
    expect(getCameraPresetView("full")).toEqual({ position: [0, 74, 92], target: [0, 0, 0] });
  });

  it("zooms toward the pointer instead of the fixed solar center", () => {
    render(
      <SolarSystemCanvas
        locale="en"
        elapsedDays={0}
        cameraPreset="full"
        selectedBodyId="earth"
        layers={{ labels: true, orbits: true, moonOrbit: true }}
        onSelectBody={() => undefined}
      />
    );

    expect(dreiMocks.orbitControlsProps.at(-1)).toMatchObject({ zoomToCursor: true, minDistance: 11.1 });
  });

  it("uses an ocean-blue fallback color for Earth", () => {
    expect(getBodyFallbackColor(bodies.find((body) => body.id === "earth")!)).toBe("#0f8fd6");
  });
});
