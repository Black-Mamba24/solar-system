import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bodies } from "@/data/bodies";
import { BodyInfoPanel } from "./BodyInfoPanel";

function bodyById(bodyId: string) {
  const body = bodies.find((item) => item.id === bodyId);
  if (!body) throw new Error(`Missing body ${bodyId}`);
  return body;
}

describe("BodyInfoPanel", () => {
  it("shows the selected body's sourced image", () => {
    render(<BodyInfoPanel body={bodyById("earth")} locale="en" />);

    expect(screen.getByRole("img", { name: "Earth" }).getAttribute("src")).toContain("%2Ftextures%2Fearth.jpg");
  });

  it("does not compare Moon rotation and orbit periods against Earth", () => {
    render(<BodyInfoPanel body={bodyById("moon")} locale="zh" />);

    const rotationCard = screen.getByText("自转周期").closest("div");
    const orbitCard = screen.getByText("公转周期").closest("div");

    expect(rotationCard).not.toHaveTextContent("约为地球的");
    expect(orbitCard).not.toHaveTextContent("约为地球的");
  });

  it("renders multiple moons as an ordered list with descriptions", () => {
    render(<BodyInfoPanel body={bodyById("saturn")} locale="zh" />);

    const moonsCard = screen.getByText("卫星").closest("div");
    expect(moonsCard).toHaveTextContent("274");

    const moonList = within(moonsCard!).getByRole("list");
    const items = within(moonList).getAllByRole("listitem");

    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent("土卫六");
    expect(items[0]).toHaveTextContent("浓厚大气");
    expect(items[1]).toHaveTextContent("土卫二");
    expect(items[1]).toHaveTextContent("含水羽流");
  });
});
