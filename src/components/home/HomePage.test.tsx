import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { learningModules } from "@/data/modules";
import { dictionaries } from "@/i18n/dictionaries";
import { HomePage } from "./HomePage";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams()
}));

describe("HomePage", () => {
  it("renders all modules and only enables overview", () => {
    render(<HomePage locale="zh" />);

    for (const learningModule of learningModules) {
      expect(screen.getByText(learningModule.title.zh)).toBeInTheDocument();
    }

    expect(screen.getAllByText("即将开放")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /进入太阳系概述/ })).toHaveAttribute("href", "/overview?lang=zh");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: /日食/ })).not.toBeInTheDocument();
  });

  it("renders English text", () => {
    render(<HomePage locale="en" />);

    expect(screen.getByText("Solar System Overview")).toBeInTheDocument();
    expect(screen.getByText(dictionaries.en.homeTitle)).toBeInTheDocument();
    expect(screen.queryByText(dictionaries.en.homeEntryNote)).not.toBeInTheDocument();
    expect(screen.getAllByText("Coming soon")).toHaveLength(5);
  });
});
