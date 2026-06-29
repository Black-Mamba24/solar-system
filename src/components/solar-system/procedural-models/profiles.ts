import type { BandSpec, CraterPatchSpec, PatchSpec, RockyProfile, SphericalPolygonSpec, SphericalPolylineSpec } from "./types";

export const mercuryProfile: RockyProfile = {
  seed: 11,
  baseColor: "#7d7973",
  lightColor: "#b8b3aa",
  darkColor: "#3f3d3a",
  roughness: 0.94,
  displacement: 0,
  craters: [],
  ridges: [
    { name: "mercury-scarp-a", lat: 12, lon: -44, latRadius: 2.2, lonRadius: 34, color: "#b7b0a6", opacity: 0.7 },
    { name: "mercury-scarp-b", lat: -26, lon: 78, latRadius: 2.0, lonRadius: 26, color: "#5a5752", opacity: 0.5 }
  ]
};

export const mercuryLavaPlains: PatchSpec[] = [
  { name: "mercury-caloris-lava-plain", lat: 30, lon: 165, latRadius: 18, lonRadius: 27, color: "#6f675b", opacity: 0.78 },
  { name: "mercury-northern-volcanic-plain", lat: 62, lon: -35, latRadius: 16, lonRadius: 42, color: "#736b61", opacity: 0.64 },
  { name: "mercury-intercrater-plain", lat: -18, lon: -92, latRadius: 19, lonRadius: 34, color: "#5d554d", opacity: 0.58 },
  { name: "mercury-ancient-smooth-plain", lat: -42, lon: 88, latRadius: 14, lonRadius: 28, color: "#756d61", opacity: 0.5 }
];

export const mercuryCraterPlains: PatchSpec[] = [
  { name: "mercury-dark-weathered-highland", lat: 18, lon: -28, latRadius: 28, lonRadius: 46, color: "#332a25", opacity: 0.36 },
  { name: "mercury-ashen-highland", lat: -36, lon: 22, latRadius: 24, lonRadius: 52, color: "#938c81", opacity: 0.22 },
  { name: "mercury-scorched-terminator-region", lat: 4, lon: 78, latRadius: 32, lonRadius: 28, color: "#241c18", opacity: 0.32 }
];

export const mercuryCraters: CraterPatchSpec[] = [
  { name: "mercury-crater-c10", lat: 46, lon: -122, latRadius: 4.8, lonRadius: 5.8, color: "#221d19", opacity: 0.82, rimColor: "#b6afa2", rimOpacity: 0.48 },
  { name: "mercury-crater-c11", lat: 28, lon: -86, latRadius: 3.2, lonRadius: 4.1, color: "#2a231e", opacity: 0.76, rimColor: "#938a7d", rimOpacity: 0.42 },
  { name: "mercury-crater-c12", lat: -8, lon: -52, latRadius: 5.6, lonRadius: 6.8, color: "#1d1815", opacity: 0.86, rimColor: "#aaa294", rimOpacity: 0.5 },
  { name: "mercury-crater-c13", lat: -28, lon: -138, latRadius: 4.0, lonRadius: 5.0, color: "#2f2924", opacity: 0.78, rimColor: "#8d8579", rimOpacity: 0.44 },
  { name: "mercury-crater-c14", lat: 9, lon: 18, latRadius: 6.4, lonRadius: 7.4, color: "#191512", opacity: 0.82, rimColor: "#c2b9aa", rimOpacity: 0.42 },
  { name: "mercury-crater-c15", lat: 34, lon: 54, latRadius: 2.4, lonRadius: 3.1, color: "#2b251f", opacity: 0.76, rimColor: "#b0a89a", rimOpacity: 0.44 },
  { name: "mercury-crater-c16", lat: -46, lon: 74, latRadius: 5.8, lonRadius: 6.4, color: "#231d19", opacity: 0.84, rimColor: "#91887c", rimOpacity: 0.46 },
  { name: "mercury-crater-c17", lat: 58, lon: 112, latRadius: 3.6, lonRadius: 4.4, color: "#2c251f", opacity: 0.74, rimColor: "#b7afa0", rimOpacity: 0.42 },
  { name: "mercury-crater-c18", lat: -14, lon: 136, latRadius: 7.8, lonRadius: 9.2, color: "#1b1512", opacity: 0.78, rimColor: "#a69d90", rimOpacity: 0.38 },
  { name: "mercury-crater-c19", lat: 2, lon: -172, latRadius: 4.5, lonRadius: 5.6, color: "#2d251f", opacity: 0.76, rimColor: "#8f8679", rimOpacity: 0.4 },
  { name: "mercury-crater-c20", lat: -57, lon: -24, latRadius: 3.6, lonRadius: 4.1, color: "#25201b", opacity: 0.78, rimColor: "#aaa193", rimOpacity: 0.43 },
  { name: "mercury-crater-c21", lat: 69, lon: -12, latRadius: 2.8, lonRadius: 3.5, color: "#211b17", opacity: 0.76, rimColor: "#b9b0a2", rimOpacity: 0.4 }
];

export const mercuryScarps: SphericalPolylineSpec[] = [
  { name: "mercury-discovery-rupes-like-scarp", color: "#c7bdae", opacity: 0.62, points: [{ lat: 30, lon: -108 }, { lat: 22, lon: -92 }, { lat: 15, lon: -74 }, { lat: 4, lon: -55 }, { lat: -9, lon: -38 }] },
  { name: "mercury-curved-lobate-scarp", color: "#3a3029", opacity: 0.58, points: [{ lat: -18, lon: 42 }, { lat: -8, lon: 58 }, { lat: 5, lon: 72 }, { lat: 20, lon: 86 }] },
  { name: "mercury-ancient-wrinkled-ridge", color: "#bbb2a3", opacity: 0.44, points: [{ lat: -46, lon: 114 }, { lat: -35, lon: 132 }, { lat: -23, lon: 146 }, { lat: -9, lon: 158 }] }
];

export const moonProfile: RockyProfile = {
  seed: 13,
  baseColor: "#908f88",
  lightColor: "#d8d6cc",
  darkColor: "#3e4042",
  roughness: 0.96,
  displacement: 0,
  craters: []
};

export const marsProfile: RockyProfile = {
  seed: 17,
  baseColor: "#c9653f",
  lightColor: "#ec9b61",
  darkColor: "#6f372b",
  roughness: 0.86,
  displacement: 0,
  craters: [],
  ridges: [
    { name: "mars-valles-marineris", lat: -13, lon: -55, latRadius: 2.8, lonRadius: 40, color: "#4b241f", opacity: 0.7 },
    { name: "mars-olympus-mons", lat: 18, lon: -133, latRadius: 5.2, lonRadius: 5.2, color: "#e18b55", opacity: 0.72 },
    { name: "mars-hellas-planitia", lat: -42, lon: 70, latRadius: 9, lonRadius: 14, color: "#d8945e", opacity: 0.45 }
  ]
};

export const earthLandPolygons: SphericalPolygonSpec[] = [
  {
    name: "earth-north-america",
    color: "#3f9448",
    points: [
      { lat: 72, lon: -166 },
      { lat: 60, lon: -146 },
      { lat: 55, lon: -126 },
      { lat: 49, lon: -124 },
      { lat: 33, lon: -117 },
      { lat: 18, lon: -104 },
      { lat: 9, lon: -82 },
      { lat: 25, lon: -80 },
      { lat: 44, lon: -67 },
      { lat: 56, lon: -61 },
      { lat: 63, lon: -83 },
      { lat: 69, lon: -105 },
      { lat: 73, lon: -135 }
    ]
  },
  {
    name: "earth-greenland",
    color: "#e8f3f0",
    points: [
      { lat: 83, lon: -58 },
      { lat: 78, lon: -22 },
      { lat: 69, lon: -18 },
      { lat: 60, lon: -42 },
      { lat: 64, lon: -58 },
      { lat: 75, lon: -72 }
    ]
  },
  {
    name: "earth-south-america",
    color: "#2f8840",
    points: [
      { lat: 12, lon: -79 },
      { lat: 6, lon: -52 },
      { lat: -7, lon: -35 },
      { lat: -23, lon: -43 },
      { lat: -38, lon: -57 },
      { lat: -55, lon: -70 },
      { lat: -39, lon: -74 },
      { lat: -18, lon: -76 },
      { lat: 1, lon: -81 }
    ]
  },
  {
    name: "earth-europe",
    color: "#67a14c",
    points: [
      { lat: 71, lon: -10 },
      { lat: 58, lon: 30 },
      { lat: 45, lon: 38 },
      { lat: 36, lon: 21 },
      { lat: 40, lon: -8 },
      { lat: 52, lon: -12 }
    ]
  },
  {
    name: "earth-africa",
    color: "#b38945",
    points: [
      { lat: 37, lon: -17 },
      { lat: 32, lon: 32 },
      { lat: 12, lon: 51 },
      { lat: -18, lon: 41 },
      { lat: -35, lon: 20 },
      { lat: -28, lon: 15 },
      { lat: -5, lon: 9 },
      { lat: 8, lon: -14 },
      { lat: 25, lon: -17 }
    ]
  },
  {
    name: "earth-arabia",
    color: "#c59b54",
    points: [
      { lat: 32, lon: 35 },
      { lat: 29, lon: 55 },
      { lat: 15, lon: 58 },
      { lat: 12, lon: 43 },
      { lat: 23, lon: 35 }
    ]
  },
  {
    name: "earth-asia-mainland",
    color: "#639247",
    points: [
      { lat: 71, lon: 35 },
      { lat: 72, lon: 145 },
      { lat: 58, lon: 170 },
      { lat: 42, lon: 138 },
      { lat: 24, lon: 118 },
      { lat: 8, lon: 101 },
      { lat: 20, lon: 74 },
      { lat: 31, lon: 58 },
      { lat: 42, lon: 40 },
      { lat: 55, lon: 36 }
    ]
  },
  {
    name: "earth-india",
    color: "#78a64b",
    points: [
      { lat: 31, lon: 68 },
      { lat: 27, lon: 88 },
      { lat: 17, lon: 85 },
      { lat: 8, lon: 77 },
      { lat: 20, lon: 70 }
    ]
  },
  {
    name: "earth-southeast-asia",
    color: "#2f9146",
    points: [
      { lat: 22, lon: 96 },
      { lat: 20, lon: 108 },
      { lat: 8, lon: 110 },
      { lat: -7, lon: 105 },
      { lat: 1, lon: 96 }
    ]
  },
  {
    name: "earth-japan",
    color: "#5d9c4d",
    points: [
      { lat: 45, lon: 141 },
      { lat: 38, lon: 143 },
      { lat: 31, lon: 132 },
      { lat: 35, lon: 130 }
    ]
  },
  {
    name: "earth-australia",
    color: "#c3904b",
    points: [
      { lat: -11, lon: 113 },
      { lat: -17, lon: 153 },
      { lat: -33, lon: 151 },
      { lat: -43, lon: 144 },
      { lat: -35, lon: 116 },
      { lat: -22, lon: 112 }
    ]
  },
  {
    name: "earth-madagascar",
    color: "#6f9b48",
    points: [
      { lat: -12, lon: 49 },
      { lat: -20, lon: 50 },
      { lat: -26, lon: 45 },
      { lat: -17, lon: 43 }
    ]
  },
  {
    name: "earth-antarctica",
    color: "#f2fbfb",
    points: [
      { lat: -70, lon: -170 },
      { lat: -67, lon: -120 },
      { lat: -72, lon: -60 },
      { lat: -69, lon: 0 },
      { lat: -72, lon: 60 },
      { lat: -67, lon: 120 },
      { lat: -70, lon: 170 },
      { lat: -86, lon: 130 },
      { lat: -84, lon: 0 },
      { lat: -86, lon: -130 }
    ]
  }
];

export const earthClouds: PatchSpec[] = [
  { name: "earth-cloud-band-a", lat: 9, lon: -35, latRadius: 6, lonRadius: 52, color: "#ffffff", opacity: 0.24 },
  { name: "earth-cloud-band-b", lat: -28, lon: 102, latRadius: 5, lonRadius: 40, color: "#ffffff", opacity: 0.2 },
  { name: "earth-cloud-spiral", lat: 34, lon: -151, latRadius: 8, lonRadius: 15, color: "#ffffff", opacity: 0.28 }
];

export const earthOceanBoundaries: SphericalPolylineSpec[] = [
  {
    name: "earth-pacific-atlantic-boundary",
    color: "#dff7ff",
    opacity: 0.54,
    points: [
      { lat: 66, lon: -168 },
      { lat: 50, lon: -168 },
      { lat: 28, lon: -154 },
      { lat: 8, lon: -140 },
      { lat: -20, lon: -126 },
      { lat: -56, lon: -76 }
    ]
  },
  {
    name: "earth-atlantic-ocean-axis",
    color: "#dff7ff",
    opacity: 0.42,
    points: [
      { lat: -56, lon: -68 },
      { lat: -45, lon: -52 },
      { lat: -23, lon: -36 },
      { lat: 0, lon: -24 },
      { lat: 24, lon: -18 },
      { lat: 64, lon: -22 }
    ]
  },
  {
    name: "earth-atlantic-indian-boundary",
    color: "#dff7ff",
    opacity: 0.54,
    points: [
      { lat: -55, lon: 20 },
      { lat: -34, lon: 20 },
      { lat: -18, lon: 32 },
      { lat: 0, lon: 45 },
      { lat: 20, lon: 62 }
    ]
  },
  {
    name: "earth-indian-pacific-boundary",
    color: "#dff7ff",
    opacity: 0.54,
    points: [
      { lat: -48, lon: 147 },
      { lat: -24, lon: 140 },
      { lat: -9, lon: 128 },
      { lat: 4, lon: 120 },
      { lat: 18, lon: 112 }
    ]
  },
  {
    name: "earth-arctic-ocean-boundary",
    color: "#e8fbff",
    opacity: 0.5,
    points: [
      { lat: 66.5, lon: -180 },
      { lat: 66.5, lon: -120 },
      { lat: 66.5, lon: -60 },
      { lat: 66.5, lon: 0 },
      { lat: 66.5, lon: 60 },
      { lat: 66.5, lon: 120 },
      { lat: 66.5, lon: 180 }
    ]
  }
];

export const venusVolcanicPlains: PatchSpec[] = [
  { name: "venus-rolling-volcanic-plains-west", lat: 8, lon: -118, latRadius: 32, lonRadius: 44, color: "#7b3d20", opacity: 0.62 },
  { name: "venus-rolling-volcanic-plains-east", lat: -10, lon: 62, latRadius: 34, lonRadius: 50, color: "#8a4a25", opacity: 0.58 },
  { name: "venus-basal-flood-plain", lat: -38, lon: -8, latRadius: 21, lonRadius: 58, color: "#5f2d1d", opacity: 0.5 }
];

export const venusHighlands: PatchSpec[] = [
  { name: "venus-ishtar-terra-highland", lat: 66, lon: 25, latRadius: 11, lonRadius: 34, color: "#c0783b", opacity: 0.7 },
  { name: "venus-aphrodite-terra-highland", lat: -8, lon: 104, latRadius: 13, lonRadius: 56, color: "#b66333", opacity: 0.64 },
  { name: "venus-beta-regio-highland", lat: 27, lon: -78, latRadius: 10, lonRadius: 18, color: "#a9552d", opacity: 0.62 }
];

export const venusImpactCraters: CraterPatchSpec[] = [
  { name: "venus-crater-v01", lat: 36, lon: -142, latRadius: 3.6, lonRadius: 4.8, color: "#2b120d", opacity: 0.62, rimColor: "#d08a50", rimOpacity: 0.34 },
  { name: "venus-crater-v02", lat: 12, lon: -52, latRadius: 5.2, lonRadius: 6.4, color: "#37160f", opacity: 0.56, rimColor: "#b76339", rimOpacity: 0.32 },
  { name: "venus-crater-v03", lat: -28, lon: -96, latRadius: 4.0, lonRadius: 5.2, color: "#27100c", opacity: 0.58, rimColor: "#c77c44", rimOpacity: 0.34 },
  { name: "venus-crater-v04", lat: 48, lon: 82, latRadius: 3.2, lonRadius: 4.0, color: "#32140e", opacity: 0.56, rimColor: "#e09a58", rimOpacity: 0.3 },
  { name: "venus-crater-v05", lat: -42, lon: 36, latRadius: 5.6, lonRadius: 7.2, color: "#2e120d", opacity: 0.54, rimColor: "#a85a35", rimOpacity: 0.34 },
  { name: "venus-crater-v06", lat: -6, lon: 154, latRadius: 4.5, lonRadius: 5.6, color: "#3a170f", opacity: 0.5, rimColor: "#cc7f45", rimOpacity: 0.3 }
];

export const venusVolcanoes: PatchSpec[] = [
  { name: "venus-maat-mons-volcano", lat: 0.5, lon: 194 - 360, latRadius: 5.5, lonRadius: 7, color: "#4f150c", opacity: 0.72 },
  { name: "venus-sapas-mons-volcano", lat: 8, lon: 188 - 360, latRadius: 4.2, lonRadius: 5.6, color: "#5b1a0d", opacity: 0.68 },
  { name: "venus-shield-volcano-field", lat: -18, lon: 72, latRadius: 7, lonRadius: 14, color: "#6a2211", opacity: 0.5 }
];

export const venusCanyons: SphericalPolylineSpec[] = [
  { name: "venus-aphrodite-chasma", color: "#2a0f0a", opacity: 0.72, points: [{ lat: -8, lon: 50 }, { lat: -13, lon: 72 }, { lat: -8, lon: 96 }, { lat: -16, lon: 121 }, { lat: -10, lon: 146 }] },
  { name: "venus-deep-rift-valley", color: "#31120c", opacity: 0.64, points: [{ lat: 30, lon: -120 }, { lat: 24, lon: -98 }, { lat: 28, lon: -74 }, { lat: 18, lon: -52 }] }
];

export const venusRidges: SphericalPolylineSpec[] = [
  { name: "venus-curved-ridge-alpha", color: "#df8a4a", opacity: 0.42, points: [{ lat: 22, lon: -20 }, { lat: 26, lon: 2 }, { lat: 21, lon: 28 }, { lat: 30, lon: 52 }] },
  { name: "venus-wrinkled-ridge-beta", color: "#572015", opacity: 0.5, points: [{ lat: -38, lon: -72 }, { lat: -30, lon: -50 }, { lat: -34, lon: -26 }, { lat: -25, lon: -4 }] },
  { name: "venus-tessera-ridge", color: "#cc7440", opacity: 0.38, points: [{ lat: 62, lon: -8 }, { lat: 68, lon: 20 }, { lat: 61, lon: 48 }] }
];

export const venusBands: BandSpec[] = [
  { name: "venus-cloud-band-north", lat: 28, width: 0.018, color: "#f2d188", opacity: 0.32 },
  { name: "venus-cloud-band-equator", lat: -4, width: 0.022, color: "#e7b875", opacity: 0.26 },
  { name: "venus-cloud-band-south", lat: -31, width: 0.018, color: "#9f5b32", opacity: 0.3 }
];

export const jupiterBands: BandSpec[] = [
  { name: "jupiter-band-0", lat: 48, width: 0.022, color: "#ead7ad" },
  { name: "jupiter-band-1", lat: 31, width: 0.026, color: "#b26945" },
  { name: "jupiter-band-2", lat: 12, width: 0.03, color: "#f0d9ad" },
  { name: "jupiter-band-3", lat: -8, width: 0.026, color: "#7c493b" },
  { name: "jupiter-band-4", lat: -28, width: 0.024, color: "#d0905d" },
  { name: "jupiter-band-5", lat: -49, width: 0.02, color: "#f3dfbc" }
];

export const saturnBands: BandSpec[] = [
  { name: "saturn-body-band-0", lat: 35, width: 0.02, color: "#e8c987" },
  { name: "saturn-body-band-1", lat: 12, width: 0.024, color: "#f2dfad" },
  { name: "saturn-body-band-2", lat: -11, width: 0.022, color: "#c89b5d" },
  { name: "saturn-body-band-3", lat: -35, width: 0.018, color: "#ead19a" }
];

export const uranusBands: BandSpec[] = [
  { name: "uranus-band-a", lat: 18, width: 0.016, color: "#bce7e7", opacity: 0.26 },
  { name: "uranus-band-b", lat: -24, width: 0.014, color: "#77c6d0", opacity: 0.22 }
];

export const neptuneBands: BandSpec[] = [
  { name: "neptune-band-a", lat: 26, width: 0.017, color: "#6ea2ee", opacity: 0.35 },
  { name: "neptune-band-b", lat: -19, width: 0.014, color: "#244dae", opacity: 0.28 }
];
