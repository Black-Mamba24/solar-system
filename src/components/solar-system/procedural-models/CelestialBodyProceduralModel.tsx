import React from "react";
import { EarthModel } from "./EarthModel";
import { JupiterModel } from "./JupiterModel";
import { MarsModel } from "./MarsModel";
import { MercuryModel } from "./MercuryModel";
import { MoonModel } from "./MoonModel";
import { NeptuneModel } from "./NeptuneModel";
import { RockyBodyModel } from "./RockyBodyModel";
import { SaturnModel } from "./SaturnModel";
import { SaturnRingSystem } from "./SaturnRingSystem";
import { SunModel } from "./SunModel";
import { UranusModel } from "./UranusModel";
import { VenusModel } from "./VenusModel";
import type { ProceduralBodyModelProps } from "./types";

export function CelestialBodyProceduralModel(props: ProceduralBodyModelProps) {
  switch (props.body.id) {
    case "sun":
      return <SunModel {...props} />;
    case "earth":
      return <EarthModel {...props} />;
    case "venus":
      return <VenusModel {...props} />;
    case "mercury":
      return <MercuryModel {...props} />;
    case "mars":
      return <MarsModel {...props} />;
    case "moon":
      return <MoonModel {...props} />;
    case "jupiter":
      return <JupiterModel {...props} />;
    case "saturn":
      return (
        <group name="saturn-image-based-model-with-rings">
          <SaturnModel {...props} />
          <SaturnRingSystem radius={props.radius} />
        </group>
      );
    case "uranus":
      return <UranusModel {...props} />;
    case "neptune":
      return <NeptuneModel {...props} />;
    default:
      return <RockyBodyModel {...props} />;
  }
}
