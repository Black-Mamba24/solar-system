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

  it("shows an atmosphere introduction for planets", () => {
    render(<BodyInfoPanel body={bodyById("earth")} locale="zh" />);

    const atmosphereCard = screen.getByText("大气").closest("div");

    expect(atmosphereCard).toHaveTextContent("氮气");
    expect(atmosphereCard).toHaveTextContent("氧气");
  });

  it("renders multiple moons by category with numbered moon names", () => {
    render(<BodyInfoPanel body={bodyById("saturn")} locale="zh" />);

    const moonsCard = screen.getByText("卫星").closest("div");
    expect(moonsCard).toHaveTextContent("共有 292 颗已确认卫星");
    expect(moonsCard).toHaveTextContent("规则卫星");
    expect(moonsCard).toHaveTextContent("不规则卫星");
    expect(moonsCard).not.toHaveTextContent("列出代表性卫星");

    const moonList = within(moonsCard!).getByRole("list");
    const items = within(moonList).getAllByRole("listitem");

    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0]).toHaveTextContent("土卫六（泰坦）");
    expect(items[0]).toHaveTextContent("浓厚大气");
    expect(items[1]).toHaveTextContent("土卫二（恩克拉多斯）");
    expect(items[1]).toHaveTextContent("含水羽流");
  });

  it("classifies Uranus and Jupiter moon systems without irrelevant notes", () => {
    const { rerender } = render(<BodyInfoPanel body={bodyById("uranus")} locale="zh" />);

    let moonsCard = screen.getByText("卫星").closest("div");
    expect(moonsCard).toHaveTextContent("共有 29 颗已确认卫星");
    expect(moonsCard).toHaveTextContent("主群卫星");
    expect(moonsCard).toHaveTextContent("内卫星");
    expect(moonsCard).toHaveTextContent("不规则卫星");
    expect(moonsCard).toHaveTextContent("天卫一（艾瑞尔）");

    rerender(<BodyInfoPanel body={bodyById("jupiter")} locale="zh" />);
    moonsCard = screen.getByText("卫星").closest("div");
    expect(moonsCard).toHaveTextContent("共有 115 颗已确认卫星");
    expect(moonsCard).toHaveTextContent("规则卫星");
    expect(moonsCard).toHaveTextContent("顺行不规则卫星");
    expect(moonsCard).toHaveTextContent("逆行不规则卫星");
    expect(moonsCard).not.toHaveTextContent("列出伽利略四大卫星");
  });
});
