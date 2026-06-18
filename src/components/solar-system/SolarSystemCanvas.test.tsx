import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { bodies } from "@/data/bodies";
import { CelestialBodyMesh } from "./CelestialBodyMesh";
import { getCameraPresetView, SolarSystemCanvas } from "./SolarSystemCanvas";
import { getOrbitCenter, getSceneBodyPosition } from "./scene-helpers";

const dreiMocks = vi.hoisted(() => ({
  useTexture: vi.fn()
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: () => <div data-testid="canvas" />,
  useFrame: () => undefined
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTexture: dreiMocks.useTexture
}));

describe("SolarSystemCanvas", () => {
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

  it("provides camera views for each overview preset", () => {
    expect(getCameraPresetView("full")).toEqual({ position: [0, 38, 68], target: [0, 0, 0] });
    expect(getCameraPresetView("inner")).toEqual({ position: [0, 20, 32], target: [0, 0, 0] });
    expect(getCameraPresetView("earthMoon")).toEqual({ position: [10, 9, 18], target: [-14, 0, 4] });
    expect(getCameraPresetView("outer")).toEqual({ position: [0, 58, 96], target: [0, 0, 0] });
  });
});
