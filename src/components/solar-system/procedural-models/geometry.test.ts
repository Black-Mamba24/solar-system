import { describe, expect, it } from "vitest";
import { earthLandPolygons, marsProfile } from "./profiles";
import { buildDisplacedSphereGeometry, buildRingBandGeometry, buildRingParticlePositions, buildSphericalEllipseGeometry, buildSphericalPolygonGeometry, sampleCraterSpecs } from "./geometry";

describe("procedural model geometry", () => {
  it("builds deterministic displaced sphere geometry with vertex colors", () => {
    const options = {
      radius: 1,
      seed: 7,
      baseColor: "#777777",
      lightColor: "#aaaaaa",
      darkColor: "#333333",
      displacement: 0.05,
      craters: sampleCraterSpecs(7, 4, 6, 12, 0.04)
    };
    const first = buildDisplacedSphereGeometry(options);
    const second = buildDisplacedSphereGeometry(options);

    expect(first.getAttribute("position").count).toBe(second.getAttribute("position").count);
    expect(first.getAttribute("color").count).toBe(first.getAttribute("position").count);
    expect(Array.from(first.getAttribute("position").array).slice(0, 24)).toEqual(Array.from(second.getAttribute("position").array).slice(0, 24));
  });

  it("keeps sphere surfaces smooth even when displacement data is provided", () => {
    const geometry = buildDisplacedSphereGeometry({
      radius: 1,
      seed: 3,
      baseColor: "#777777",
      lightColor: "#aaaaaa",
      darkColor: "#333333",
      displacement: 0.2,
      craters: [{ lat: 0, lon: 0, radius: 22, depth: 0.08, rim: 0.04 }]
    });
    const position = geometry.getAttribute("position");
    const radii = Array.from({ length: position.count }, (_, index) => Math.hypot(position.getX(index), position.getY(index), position.getZ(index)));

    expect(Math.max(...radii) - Math.min(...radii)).toBeLessThan(0.00001);
  });

  it("places spherical patch geometry above the base surface", () => {
    const geometry = buildSphericalEllipseGeometry({ radius: 2, lat: 10, lon: 20, latRadius: 8, lonRadius: 16, height: 1.03 });
    const position = geometry.getAttribute("position");
    const firstRadius = Math.hypot(position.getX(0), position.getY(0), position.getZ(0));

    expect(firstRadius).toBeGreaterThan(2);
  });

  it("keeps Mars as a smooth sphere", () => {
    const radius = 0.52;
    const geometry = buildDisplacedSphereGeometry({
      radius,
      seed: marsProfile.seed,
      baseColor: marsProfile.baseColor,
      lightColor: marsProfile.lightColor,
      darkColor: marsProfile.darkColor,
      displacement: marsProfile.displacement,
      craters: marsProfile.craters
    });
    const position = geometry.getAttribute("position");
    const radii = Array.from({ length: position.count }, (_, index) => Math.hypot(position.getX(index), position.getY(index), position.getZ(index)));

    expect(Math.max(...radii) - Math.min(...radii)).toBeLessThan(0.00001);
  });

  it("builds spherical polygon land geometry from embedded coastline points", () => {
    const polygon = earthLandPolygons.find((land) => land.name === "earth-africa")!;
    const geometry = buildSphericalPolygonGeometry({ radius: 2, patch: polygon, height: 1.02 });
    const position = geometry.getAttribute("position");
    const firstRadius = Math.hypot(position.getX(0), position.getY(0), position.getZ(0));

    expect(position.count).toBe(polygon.points.length);
    expect(geometry.getIndex()?.count).toBeGreaterThanOrEqual((polygon.points.length - 2) * 3);
    expect(firstRadius).toBeGreaterThan(2);
  });

  it("builds separated ring bands and deterministic coplanar ring particles", () => {
    const inner = buildRingBandGeometry(2, 2.3, 96);
    const outer = buildRingBandGeometry(2.5, 3.0, 96);
    inner.computeBoundingSphere();
    outer.computeBoundingSphere();
    const particlesA = buildRingParticlePositions({ innerRadius: 2, outerRadius: 3, count: 8, seed: 1, verticalScale: 0.04 });
    const particlesB = buildRingParticlePositions({ innerRadius: 2, outerRadius: 3, count: 8, seed: 1, verticalScale: 0.04 });
    const particleRadii = Array.from({ length: particlesA.length / 3 }, (_, index) => Math.hypot(particlesA[index * 3], particlesA[index * 3 + 1]));
    const particleHeights = Array.from({ length: particlesA.length / 3 }, (_, index) => Math.abs(particlesA[index * 3 + 2]));

    expect(inner.getAttribute("position").count).toBeGreaterThan(0);
    expect(outer.boundingSphere?.radius ?? 0).not.toBe(inner.boundingSphere?.radius ?? 0);
    expect(Math.min(...particleRadii)).toBeGreaterThanOrEqual(2);
    expect(Math.max(...particleRadii)).toBeLessThanOrEqual(3);
    expect(Math.max(...particleHeights)).toBeLessThanOrEqual(0.02);
    expect(Array.from(particlesA)).toEqual(Array.from(particlesB));
  });
});
