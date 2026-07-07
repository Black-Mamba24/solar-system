import { describe, expect, it } from "vitest";
import { createInitialLunarEclipseState } from "@/lib/lunar-eclipse";
import { getGroundEarthViewShadowDisc, getGroundMoonBaseTexturePath, getGroundMoonRenderModel, getGroundShadowProjection, getLunarEclipseShadowConeProfile, getLunarEclipseSunRayLines, getLunarEclipseTangentLines, getSpaceMoonSurfaceEffect } from "./lunar-eclipse-visual";

describe("LunarEclipseCanvas projection helpers", () => {
  it("centers the umbra on the lunar disc only during totality", () => {
    const total = getGroundShadowProjection(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.5 }));
    const partial = getGroundShadowProjection(createInitialLunarEclipseState({ eclipseCase: "partial", time: 0.5 }));

    expect(Math.hypot(total.shadowOffsetX, total.shadowOffsetY)).toBeLessThan(total.moonRadius);
    expect(total.redOpacity).toBeGreaterThan(0);
    expect(Math.hypot(partial.shadowOffsetX, partial.shadowOffsetY)).toBeGreaterThan(partial.moonRadius);
    expect(partial.redOpacity).toBeLessThan(total.redOpacity);
  });

  it("keeps penumbra visually weaker than umbra on the lunar disc", () => {
    const projection = getGroundShadowProjection(createInitialLunarEclipseState({ eclipseCase: "partial", time: 0.5 }));

    expect(projection.penumbraOpacity).toBeLessThan(projection.umbraOpacity);
    expect(projection.umbraRadius).toBeLessThan(projection.penumbraRadius);
  });

  it("drives Earth-view rendering from a NASA lunar image and physical coverage model", () => {
    const total = getGroundMoonRenderModel(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.5 }));
    const partial = getGroundMoonRenderModel(createInitialLunarEclipseState({ eclipseCase: "partial", time: 0.5 }));

    expect(getGroundMoonBaseTexturePath()).toBe("/textures/lunar-eclipse-moon-nasa-svs.jpg");
    expect(total.moonRadius).toBeGreaterThan(0);
    expect(total.totalCase).toBe(true);
    expect(total.totality).toBe(true);
    expect(total.umbraCoverage).toBe(1);
    expect(partial.totalCase).toBe(false);
    expect(partial.totality).toBe(false);
    expect(partial.umbraCoverage).toBeGreaterThan(0);
    expect(partial.umbraCoverage).toBeLessThan(1);
  });

  it("keeps Earth-view eclipse motion horizontal from entry to exit", () => {
    const moonRadius = 100;
    const entry = getGroundEarthViewShadowDisc(createInitialLunarEclipseState({ mainView: "ground", eclipseCase: "total", time: 0.34 }), moonRadius);
    const maximum = getGroundEarthViewShadowDisc(createInitialLunarEclipseState({ mainView: "ground", eclipseCase: "total", time: 0.52 }), moonRadius);
    const exit = getGroundEarthViewShadowDisc(createInitialLunarEclipseState({ mainView: "ground", eclipseCase: "total", time: 0.64 }), moonRadius);

    expect(entry).not.toBeNull();
    expect(maximum).not.toBeNull();
    expect(exit).not.toBeNull();

    expect(entry!.direction).toBe("left-to-right");
    expect(entry!.motionAxis).toBe("x");
    expect(entry!.boundaryShape).toBe("circular");
    expect(entry!.centerY).toBe(0);
    expect(maximum!.centerY).toBe(entry!.centerY);
    expect(exit!.centerY).toBe(entry!.centerY);
    expect(entry!.centerX).toBeLessThan(maximum!.centerX);
    expect(maximum!.centerX).toBeLessThan(exit!.centerX);
    expect(maximum!.radius).toBeGreaterThan(moonRadius);
  });

  it("keeps Earth-view partial eclipse as a circular Earth shadow without full umbra coverage", () => {
    const moonRadius = 100;
    const entry = getGroundEarthViewShadowDisc(createInitialLunarEclipseState({ mainView: "ground", eclipseCase: "partial", time: 0.34 }), moonRadius);
    const maximum = getGroundEarthViewShadowDisc(createInitialLunarEclipseState({ mainView: "ground", eclipseCase: "partial", time: 0.5 }), moonRadius);
    const exit = getGroundEarthViewShadowDisc(createInitialLunarEclipseState({ mainView: "ground", eclipseCase: "partial", time: 0.66 }), moonRadius);

    expect(entry).not.toBeNull();
    expect(maximum).not.toBeNull();
    expect(exit).not.toBeNull();
    expect(maximum!.boundaryShape).toBe("circular");
    expect(maximum!.centerY).toBeGreaterThan(0);
    expect(maximum!.centerY + moonRadius).toBeGreaterThan(maximum!.radius);
    expect(entry!.centerY).toBe(maximum!.centerY);
    expect(exit!.centerY).toBe(maximum!.centerY);
    expect(entry!.centerX).toBeLessThan(maximum!.centerX);
    expect(maximum!.centerX).toBeLessThan(exit!.centerX);
  });

  it("derives umbra and penumbra boundaries from Sun-Earth tangent lines", () => {
    const tangents = getLunarEclipseTangentLines();

    expect(tangents).toHaveLength(8);
    expect(new Set(tangents.map((line) => line.plane))).toEqual(new Set(["y", "z"]));
    expect(tangents.map((line) => line.kind).sort()).toEqual(["penumbra", "penumbra", "penumbra", "penumbra", "umbra", "umbra", "umbra", "umbra"]);
    expect(tangents.every((line) => line.start.x < line.through.x && line.through.x < line.end.x)).toBe(true);
    expect(tangents.filter((line) => line.kind === "umbra").every((line) => Math.hypot(line.end.y, line.end.z) < Math.hypot(line.through.y, line.through.z))).toBe(true);
    expect(tangents.filter((line) => line.kind === "penumbra").every((line) => Math.hypot(line.end.y, line.end.z) > Math.hypot(line.through.y, line.through.z))).toBe(true);
  });

  it("draws visible solar ray boundaries from the same Sun-Earth tangents", () => {
    const rays = getLunarEclipseSunRayLines();
    const umbraBoundaries = rays.filter((line) => line.kind === "umbra-boundary");
    const penumbraBoundaries = rays.filter((line) => line.kind === "penumbra-boundary");

    expect(rays).toHaveLength(8);
    expect(new Set(rays.map((line) => line.plane))).toEqual(new Set(["y", "z"]));
    expect(umbraBoundaries).toHaveLength(4);
    expect(penumbraBoundaries).toHaveLength(4);
    expect(umbraBoundaries.every((line) => Math.hypot(line.end.y, line.end.z) < Math.hypot(line.start.y, line.start.z))).toBe(true);
    expect(penumbraBoundaries.every((line) => Math.hypot(line.end.y, line.end.z) > Math.hypot(line.start.y, line.start.z))).toBe(true);
  });

  it("uses the same tangent geometry for shadow cone radii and visible boundary rays", () => {
    const tangents = getLunarEclipseTangentLines();
    const profile = getLunarEclipseShadowConeProfile();
    const umbraEndRadius = Math.max(...tangents.filter((line) => line.kind === "umbra").map((line) => Math.hypot(line.end.y, line.end.z)));
    const penumbraEndRadius = Math.max(...tangents.filter((line) => line.kind === "penumbra").map((line) => Math.hypot(line.end.y, line.end.z)));

    expect(profile.umbraEndRadius).toBeCloseTo(umbraEndRadius, 6);
    expect(profile.penumbraEndRadius).toBeCloseTo(penumbraEndRadius, 6);
    expect(profile.umbraStartRadius).toBeLessThan(profile.penumbraStartRadius);
    expect(profile.umbraEndRadius).toBeLessThan(profile.umbraStartRadius);
    expect(profile.penumbraEndRadius).toBeGreaterThan(profile.penumbraStartRadius);
  });

  it("makes space-view lunar color a sphere-surface effect instead of a projected overlay", () => {
    const total = getSpaceMoonSurfaceEffect(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.5 }));
    const partial = getSpaceMoonSurfaceEffect(createInitialLunarEclipseState({ eclipseCase: "partial", time: 0.5 }));

    expect(total.usesProjectedOverlay).toBe(false);
    expect(total.totality).toBe(true);
    expect(partial.usesProjectedOverlay).toBe(false);
    expect(partial.totality).toBe(false);
    expect(total.penumbraCoverage).toBeGreaterThan(0);
    expect(total.umbraCoverage).toBe(1);
    expect(partial.penumbraCoverage).toBeGreaterThan(partial.umbraCoverage);
    expect(Math.hypot(partial.shadowCenterY, partial.shadowCenterZ)).toBeGreaterThan(0);
  });
});
