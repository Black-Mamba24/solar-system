import { describe, expect, it } from "vitest";
import { getBodyPosition, orbitalAngleDeg } from "./orbits";
import type { OrbitData } from "@/types/domain";

const orbit: OrbitData = {
  semiMajorAxisAu: 1,
  displayDistance: 10,
  displayRadius: 1,
  orbitalPeriodDays: 100,
  phaseDeg: 0,
  inclinationDeg: 0,
  color: "#fff",
  showLabelByDefault: true
};

describe("orbits", () => {
  it("computes a repeating orbital angle", () => {
    expect(orbitalAngleDeg(orbit, 0)).toBeCloseTo(0);
    expect(orbitalAngleDeg(orbit, 25)).toBeCloseTo(90);
    expect(orbitalAngleDeg(orbit, 100)).toBeCloseTo(0);
  });

  it("wraps negative elapsed days into a positive angle", () => {
    expect(orbitalAngleDeg(orbit, -25)).toBeCloseTo(270);
  });

  it("uses display distance for position", () => {
    expect(getBodyPosition(orbit, 0)).toEqual([10, 0, 0]);
    const quarter = getBodyPosition(orbit, 25);
    expect(quarter[0]).toBeCloseTo(0, 5);
    expect(quarter[2]).toBeCloseTo(10, 5);
  });

  it("applies inclination to position", () => {
    const inclinedOrbit: OrbitData = {
      ...orbit,
      inclinationDeg: 30
    };
    const quarter = getBodyPosition(inclinedOrbit, 25);
    expect(quarter[1]).toBeGreaterThan(0);
    expect(quarter[2]).toBeLessThan(orbit.displayDistance);
  });
});
