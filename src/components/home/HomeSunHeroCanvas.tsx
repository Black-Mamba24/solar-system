"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { assetSources } from "@/data/assets";
import { bodies } from "@/data/bodies";
import { SunModel } from "@/components/solar-system/procedural-models/SunModel";

const sun = bodies.find((body) => body.id === "sun");
const sunSurfaceAsset = assetSources.find((asset) => asset.bodyId === "sun" && asset.purpose === "surface");

export function HomeSunHeroCanvas({ animated }: { animated: boolean }) {
  if (!sun) {
    return null;
  }

  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 34 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.42} />
      <pointLight position={[-1.6, 1.2, 2.6]} intensity={850} color="#f8c45c" />
      <pointLight position={[1.8, -1.4, 2.2]} intensity={240} color="#ff4a16" />
      <group name="home-sun-hero-scene" position={[-0.72, 0.02, 0]} rotation={[0.08, -0.36, -0.1]}>
        <SunModel body={sun} radius={1.62} selected={false} fallbackColor="#ff9a24" asset={sunSurfaceAsset} animated={animated} presentation="hero" onSelectBody={() => undefined} />
      </group>
    </Canvas>
  );
}
