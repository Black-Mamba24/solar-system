import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bodies } from "@/data/bodies";
import { degToRad } from "@/lib/orbits";
import { CelestialBodyMesh } from "./CelestialBodyMesh";
import { formatZoomScaleAu, getCameraPresetView, progressToZoomScaleAu, SolarSystemCanvas, zoomScaleAuToProgress } from "./SolarSystemCanvas";
import { getBodyFallbackColor, getOrbitCenter, getSceneBodyPosition } from "./scene-helpers";

const dreiMocks = vi.hoisted(() => ({
  orbitControlsProps: [] as Array<Record<string, unknown>>
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
  Html: ({ children, position }: { children: React.ReactNode; position?: [number, number, number] }) => <div data-html-position={position?.join(",")}>{children}</div>
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
    expect(screen.getByLabelText("缩小比例尺 0.1 AU")).toBeInTheDocument();
    expect(screen.getByLabelText("放大比例尺 0.1 AU")).toBeInTheDocument();
    expect(screen.getByText("10.00 AU")).toBeInTheDocument();
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

  it("renders a procedural 3D surface mesh for every body", () => {
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

    for (const body of bodies) {
      expect(document.querySelector(`mesh[name="${body.id}-surface"]`), body.id).toBeInTheDocument();
    }
  });

  it("adds recognizable procedural model details for major bodies", () => {
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

    expect(document.querySelector('group[name="earth-ocean-boundaries"]')).toBeInTheDocument();
    expect(document.querySelectorAll('group[name="earth-ocean-boundaries"] line').length).toBeGreaterThanOrEqual(4);
    expect(document.querySelector('line[name="earth-indian-pacific-boundary"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="earth-image-based-blue-marble-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-real-cloud-layer"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="earth-atmosphere"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="mercury-image-based-barren-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="mercury-surface"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="venus-image-based-volcanic-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="venus-surface"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="venus-dense-cloud-shell"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="mars-image-based-red-planet-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="mars-surface"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="mars-dust-haze-shell"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="moon-image-based-cratered-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="moon-surface"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="moon-regolith-contrast-sheen"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="jupiter-image-based-storm-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-surface"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-upper-cloud-sheen"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-prograde-cloud-drift-layer"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-retrograde-cloud-drift-layer"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-great-red-spot-vortex"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-great-red-spot-core"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-great-red-spot-wake"]')).not.toBeInTheDocument();
    expect(document.querySelector('group[name="jupiter-polar-cyclone-layer"]')).toBeInTheDocument();
    expect(document.querySelectorAll('mesh[name^="jupiter-polar-cyclone-"]')).toHaveLength(6);
    expect(document.querySelector('group[name="saturn-image-based-model-with-rings"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="saturn-image-based-ringed-storm-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="saturn-north-polar-hexagon"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="saturn-southern-storm-brightening"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="saturn-ring-shadow-on-globe"]')).toBeInTheDocument();
    expect(document.querySelectorAll('group[name="saturn-ring-system"]')).toHaveLength(1);
    expect(document.querySelector('group[name="saturn-ring-system"] mesh[name="saturn-textured-ring-plane"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="saturn-ring-system"] mesh[name="saturn-cassini-division-shadow"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="saturn-ring-system"] mesh[name="saturn-ring-sunlit-edge"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="saturn-ring-system"] points[name="saturn-ring-particles"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="uranus-image-based-ice-giant-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="uranus-surface"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="uranus-seasonal-methane-cloud-layer"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="uranus-polar-haze-cap"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="uranus-dark-ring-system"] mesh[name="uranus-textured-ring-plane"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="uranus-dark-ring-system"] mesh[name="uranus-ring-sunlit-edge-highlight"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="uranus-dark-ring-system"] mesh[name="uranus-ring-shadow-side-scatter"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="uranus-dark-ring-system"] points[name="uranus-epsilon-ring-density-clumps"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="uranus-dark-ring-system"] points[name="uranus-dark-ring-dust"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="neptune-image-based-storm-ice-giant-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="neptune-surface"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="neptune-great-dark-spot-and-methane-clouds"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="neptune-scooter-cloud-highlight"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="neptune-faint-ring-system"] mesh[name="neptune-textured-ring-plane"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="neptune-faint-ring-system"] mesh[name="neptune-ring-sunlit-side-highlight"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="neptune-faint-ring-system"] mesh[name="neptune-ring-shadow-side-scatter"]')).toBeInTheDocument();
    expect(document.querySelectorAll('group[name="neptune-adams-discontinuous-ring-arcs"] mesh[name^="neptune-adams-ring-arc-"]')).toHaveLength(4);
    expect(document.querySelectorAll('group[name="neptune-adams-discontinuous-ring-arcs"] points[name^="neptune-adams-ring-arc-density-"]')).toHaveLength(4);
    expect(document.querySelector('group[name="neptune-faint-ring-system"] points[name="neptune-ring-dust-and-ice"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="sun-image-based-active-star-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="sun-sunspot-and-granulation-layer"]')).toBeInTheDocument();
    expect(document.querySelector('points[name="sun-coronal-density-haze"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="sun-prominence-filaments"]')).toBeInTheDocument();
    expect(document.querySelectorAll('mesh[name^="sun-prominence-filament-"]')).toHaveLength(3);
    expect(document.querySelectorAll('sprite[name^="sun-prominence-"]')).toHaveLength(0);
  });

  it("keeps Venus visually dominated by its dense cloud deck", () => {
    render(
      <SolarSystemCanvas
        locale="en"
        elapsedDays={0}
        cameraPreset="full"
        selectedBodyId="venus"
        layers={{ labels: true, orbits: true, moonOrbit: true }}
        onSelectBody={() => undefined}
      />
    );

    const surfaceMaterial = document.querySelector('mesh[name="venus-surface"] meshStandardMaterial');
    const cloudMaterial = document.querySelector('mesh[name="venus-dense-cloud-shell"] meshStandardMaterial');

    expect(Number(surfaceMaterial?.getAttribute("opacity"))).toBeLessThanOrEqual(0.78);
    expect(Number(cloudMaterial?.getAttribute("opacity"))).toBeGreaterThanOrEqual(0.58);
  });

  it("applies real axial tilt to the visual body group and rotation axis", () => {
    const uranus = bodies.find((body) => body.id === "uranus")!;

    render(
      <CelestialBodyMesh
        body={uranus}
        bodies={bodies}
        locale="en"
        elapsedDays={0}
        selected={false}
        showLabel={false}
        onSelectBody={() => undefined}
      />
    );

    const tiltGroup = document.querySelector('group[name="uranus-axial-tilt"]');
    const rotationAxis = document.querySelector('line[name="uranus-rotation-axis"]');

    expect(tiltGroup).toHaveAttribute("rotation", `0,0,${degToRad(uranus.axialTiltDeg!)}`);
    expect(rotationAxis).toBeInTheDocument();
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

  it("formats and converts the zoom scale in AU", () => {
    expect(formatZoomScaleAu(0)).toBe("0.05 AU");
    expect(formatZoomScaleAu(0.004)).toBe("0.05 AU");
    expect(formatZoomScaleAu(1)).toBe("10.00 AU");
    expect(progressToZoomScaleAu(0.5)).toBe(5);
    expect(zoomScaleAuToProgress(9.9)).toBeCloseTo(0.99);
  });

  it("renders zoom scale stepper buttons", () => {
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

    expect(screen.getByRole("button", { name: "Decrease zoom scale by 0.1 AU" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Increase zoom scale by 0.1 AU" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Decrease zoom scale by 0.1 AU" }));
    expect(screen.getByText("10.00 AU")).toBeInTheDocument();
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

    expect(dreiMocks.orbitControlsProps.at(-1)).toMatchObject({ zoomToCursor: true, zoomSpeed: 0.5, minDistance: 11.1 });
  });

  it("uses an ocean-blue fallback color for Earth", () => {
    expect(getBodyFallbackColor(bodies.find((body) => body.id === "earth")!)).toBe("#0f8fd6");
  });
});
