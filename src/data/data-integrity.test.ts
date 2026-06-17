import { describe, expect, it } from "vitest";
import { assetSources } from "./assets";
import { bodies } from "./bodies";
import { learningModules } from "./modules";

describe("data integrity", () => {
  it("has exactly one available learning module", () => {
    expect(learningModules.filter((module) => module.status === "available").map((module) => module.id)).toEqual(["overview"]);
  });

  it("keeps coming soon modules without routes", () => {
    const comingSoon = learningModules.filter((module) => module.status === "comingSoon");
    expect(comingSoon).toHaveLength(5);
    expect(comingSoon.every((module) => module.route === undefined)).toBe(true);
  });

  it("has localized content for every body", () => {
    for (const body of bodies) {
      expect(body.name.zh).toBeTruthy();
      expect(body.name.en).toBeTruthy();
      expect(body.content.zh.summary).toBeTruthy();
      expect(body.content.en.summary).toBeTruthy();
      expect(body.content.zh.facts.length).toBeGreaterThanOrEqual(3);
      expect(body.content.en.facts.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("documents texture sources for all textured bodies", () => {
    const assetIds = new Set(assetSources.map((asset) => asset.id));
    const textured = bodies.filter((body) => body.textureAssetId);
    expect(textured.every((body) => assetIds.has(body.textureAssetId!))).toBe(true);
  });
});
