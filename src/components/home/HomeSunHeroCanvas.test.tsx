import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeSunHeroCanvas } from "./HomeSunHeroCanvas";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="home-sun-canvas">{children}</div>,
  useFrame: () => undefined
}));

vi.mock("@/components/solar-system/procedural-models/useImageTexture", () => ({
  useImageTexture: () => null
}));

function createCanvasContextMock() {
  const gradient = { addColorStop: vi.fn() };

  return {
    beginPath: vi.fn(),
    bezierCurveTo: vi.fn(),
    clearRect: vi.fn(),
    createRadialGradient: vi.fn(() => gradient),
    ellipse: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    stroke: vi.fn(),
    set fillStyle(_value: string | CanvasGradient | CanvasPattern) {},
    set globalCompositeOperation(_value: GlobalCompositeOperation) {},
    set lineWidth(_value: number) {},
    set strokeStyle(_value: string | CanvasGradient | CanvasPattern) {}
  } as unknown as CanvasRenderingContext2D;
}

describe("HomeSunHeroCanvas", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((contextId) => (contextId === "2d" ? createCanvasContextMock() : null));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a single animated Sun model for the homepage hero", () => {
    render(<HomeSunHeroCanvas animated />);

    expect(screen.getByTestId("home-sun-canvas")).toBeInTheDocument();
    expect(document.querySelector('group[name="sun-image-based-active-star-model"]')).toBeInTheDocument();
    expect(document.querySelector('mesh[name="sun-sunspot-and-granulation-layer"]')).toBeInTheDocument();
    expect(document.querySelector('points[name="sun-coronal-density-haze"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="sun-prominence-filaments"]')).not.toBeInTheDocument();
    expect(document.querySelectorAll('mesh[name^="sun-prominence-filament-"]')).toHaveLength(0);
    expect(document.querySelector('group[name="sun-hero-coronal-veil"]')).toBeInTheDocument();
    expect(document.querySelector('group[name="sun-hero-magnetic-light-bands"]')).not.toBeInTheDocument();
    expect(document.querySelectorAll('sprite[name^="sun-prominence-"]')).toHaveLength(0);
    expect(document.querySelector('mesh[name="earth-surface"]')).not.toBeInTheDocument();
    expect(document.querySelector('mesh[name="jupiter-surface"]')).not.toBeInTheDocument();
    expect(document.querySelector('group[name="saturn-image-based-model-with-rings"]')).not.toBeInTheDocument();
  });
});
