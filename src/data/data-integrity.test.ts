import { existsSync, statSync } from "node:fs";
import path from "node:path";
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
    const missingAssetIds = bodies
      .filter((body) => body.textureAssetId)
      .filter((body) => !assetIds.has(body.textureAssetId!))
      .map((body) => body.id);

    expect(missingAssetIds).toEqual([]);
  });

  it("keeps asset ids unique", () => {
    const ids = assetSources.map((asset) => asset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps asset body ids aligned with existing bodies", () => {
    const bodyIds = new Set(bodies.map((body) => body.id));
    const unknownBodyIds = assetSources
      .filter((asset) => !bodyIds.has(asset.bodyId))
      .map((asset) => asset.id);

    expect(unknownBodyIds).toEqual([]);
  });

  it("matches each body texture asset to the same body id", () => {
    const assetsById = new Map(assetSources.map((asset) => [asset.id, asset]));
    const mismatchedTextures = bodies
      .filter((body) => body.textureAssetId)
      .filter((body) => assetsById.get(body.textureAssetId!)?.bodyId !== body.id)
      .map((body) => body.id);

    expect(mismatchedTextures).toEqual([]);
  });

  it("uses local texture paths and secure source urls for assets", () => {
    const invalidAssets = assetSources
      .filter((asset) => !asset.localPath.startsWith("/textures/") || !asset.url.startsWith("https://"))
      .map((asset) => asset.id);

    expect(invalidAssets).toEqual([]);
  });

  it("keeps asset source metadata complete and explicit about non-endorsement", () => {
    const incompleteAssets = assetSources
      .filter(
        (asset) =>
          !asset.title.trim() ||
          !asset.url.trim() ||
          !asset.agency.trim() ||
          !asset.usage.trim() ||
          !asset.processing.trim() ||
          !asset.downloadedAt.trim()
      )
      .map((asset) => asset.id);
    const missingEndorsementCaveat = assetSources
      .filter((asset) => !/endorsement|背书/i.test(asset.usage))
      .map((asset) => asset.id);

    expect(incompleteAssets).toEqual([]);
    expect(missingEndorsementCaveat).toEqual([]);
  });

  it("backs every asset local path with a non-empty file under public", () => {
    const missingOrEmptyFiles = assetSources
      .filter((asset) => {
        const relativePublicPath = asset.localPath.replace(/^\/+/, "");
        const filePath = path.join(process.cwd(), "public", relativePublicPath);

        return !existsSync(filePath) || statSync(filePath).size === 0;
      })
      .map((asset) => asset.localPath);

    expect(missingOrEmptyFiles).toEqual([]);
  });

  it("includes basic physical metadata for all non-sun bodies", () => {
    const missingMetadata = bodies
      .filter((body) => body.id !== "sun")
      .filter((body) => !body.massKg || body.axialTiltDeg === undefined)
      .map((body) => body.id);

    expect(missingMetadata).toEqual([]);
  });

  it("includes orbit data for every planet and moon", () => {
    const missingOrbits = bodies
      .filter((body) => body.type === "planet" || body.type === "moon")
      .filter((body) => body.orbit === undefined)
      .map((body) => body.id);

    expect(missingOrbits).toEqual([]);
  });
});
