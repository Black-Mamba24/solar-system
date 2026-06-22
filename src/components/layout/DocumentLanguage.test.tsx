import React from "react";
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocumentLanguage } from "./DocumentLanguage";

const navigationMocks = vi.hoisted(() => ({
  searchParams: new URLSearchParams()
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => navigationMocks.searchParams
}));

describe("DocumentLanguage", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("lang");
    navigationMocks.searchParams = new URLSearchParams();
  });

  it("sets the html lang attribute from the URL locale", async () => {
    navigationMocks.searchParams = new URLSearchParams("lang=en");

    render(<DocumentLanguage />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("lang", "en"));
  });
});
