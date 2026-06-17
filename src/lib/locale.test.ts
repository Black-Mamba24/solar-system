import { describe, expect, it } from "vitest";
import { defaultLocale, oppositeLocale, parseLocale, withLocaleSearchParams } from "./locale";

describe("locale helpers", () => {
  it("defaults to Chinese for missing or invalid values", () => {
    expect(parseLocale(undefined)).toBe(defaultLocale);
    expect(parseLocale("fr")).toBe("zh");
  });

  it("parses supported locales", () => {
    expect(parseLocale("zh")).toBe("zh");
    expect(parseLocale("en")).toBe("en");
  });

  it("returns the opposite language", () => {
    expect(oppositeLocale("zh")).toBe("en");
    expect(oppositeLocale("en")).toBe("zh");
  });

  it("serializes language into query params", () => {
    const params = new URLSearchParams("body=earth");
    expect(withLocaleSearchParams(params, "en")).toBe("?body=earth&lang=en");
  });
});
