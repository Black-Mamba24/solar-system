import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SolarSystemCanvas } from "./SolarSystemCanvas";

vi.mock("@react-three/fiber", () => ({
  Canvas: () => <div data-testid="canvas" />,
  useFrame: () => undefined
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTexture: () => null
}));

describe("SolarSystemCanvas", () => {
  it("renders the scene container and compressed scale notice", () => {
    render(
      <SolarSystemCanvas
        locale="zh"
        elapsedDays={0}
        selectedBodyId="earth"
        layers={{ labels: true, orbits: true, moonOrbit: true }}
        onSelectBody={() => undefined}
      />
    );

    expect(screen.getByTestId("canvas")).toBeInTheDocument();
    expect(screen.getByText("比例经过教学压缩")).toBeInTheDocument();
  });
});
