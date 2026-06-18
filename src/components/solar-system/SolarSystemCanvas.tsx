"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { bodies } from "@/data/bodies";
import { dictionaries } from "@/i18n/dictionaries";
import type { LayerKey, Locale } from "@/types/domain";
import { CelestialBodyMesh } from "./CelestialBodyMesh";
import { OrbitLine } from "./OrbitLine";
import { getOrbitCenter } from "./scene-helpers";
import { Stars } from "./Stars";

interface SolarSystemCanvasProps {
  locale: Locale;
  elapsedDays: number;
  selectedBodyId?: string;
  layers: Record<LayerKey, boolean>;
  onSelectBody: (bodyId: string) => void;
}

export function SolarSystemCanvas({ locale, elapsedDays, selectedBodyId, layers, onSelectBody }: SolarSystemCanvasProps) {
  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-ui border border-white/10 bg-black">
      <Canvas camera={{ position: [0, 38, 68], fov: 48 }} dpr={[1, 1.7]}>
        <color attach="background" args={["#03050b"]} />
        <ambientLight intensity={0.24} />
        <pointLight position={[0, 0, 0]} intensity={800} color="#f8c45c" />
        <Stars />
        {layers.orbits
          ? bodies.map((body) => (body.orbit && !body.parentId ? <OrbitLine key={`${body.id}-orbit`} orbit={body.orbit} center={getOrbitCenter(body, bodies, elapsedDays)} /> : null))
          : null}
        {layers.moonOrbit
          ? bodies.map((body) => (body.orbit && body.parentId ? <OrbitLine key={`${body.id}-orbit`} orbit={body.orbit} center={getOrbitCenter(body, bodies, elapsedDays)} /> : null))
          : null}
        {bodies.map((body) => (
          <CelestialBodyMesh
            key={body.id}
            body={body}
            bodies={bodies}
            locale={locale}
            elapsedDays={elapsedDays}
            selected={body.id === selectedBodyId}
            showLabel={layers.labels && (body.orbit?.showLabelByDefault ?? true)}
            onSelectBody={onSelectBody}
          />
        ))}
        <OrbitControls enableDamping dampingFactor={0.08} minDistance={8} maxDistance={120} />
      </Canvas>
      <p className="absolute bottom-3 left-3 rounded-ui bg-black/60 px-3 py-2 text-xs text-slate-200">
        {dictionaries[locale].compressedScale}
      </p>
    </section>
  );
}
