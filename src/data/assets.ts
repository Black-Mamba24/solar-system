import type { AssetSource } from "@/types/domain";

export const assetSources: AssetSource[] = [
  {
    id: "sun-nasa-sdo",
    bodyId: "sun",
    purpose: "diffuse",
    title: "NASA Solar Dynamics Observatory Sun imagery",
    url: "https://science.nasa.gov/sun/",
    agency: "NASA",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/sun.jpg",
    processing: "To be converted into a sphere texture from public solar imagery."
  },
  {
    id: "mercury-nasa",
    bodyId: "mercury",
    purpose: "diffuse",
    title: "NASA Mercury imagery",
    url: "https://science.nasa.gov/mercury/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/mercury.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "venus-nasa",
    bodyId: "venus",
    purpose: "diffuse",
    title: "NASA Venus imagery",
    url: "https://science.nasa.gov/venus/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/venus.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "earth-nasa",
    bodyId: "earth",
    purpose: "diffuse",
    title: "NASA Earth imagery",
    url: "https://visibleearth.nasa.gov/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/earth.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "moon-nasa",
    bodyId: "moon",
    purpose: "diffuse",
    title: "NASA Moon imagery",
    url: "https://science.nasa.gov/moon/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/moon.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "mars-nasa",
    bodyId: "mars",
    purpose: "diffuse",
    title: "NASA Mars imagery",
    url: "https://science.nasa.gov/mars/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/mars.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "jupiter-nasa",
    bodyId: "jupiter",
    purpose: "diffuse",
    title: "NASA Jupiter imagery",
    url: "https://science.nasa.gov/jupiter/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/jupiter.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "saturn-nasa",
    bodyId: "saturn",
    purpose: "diffuse",
    title: "NASA Saturn imagery",
    url: "https://science.nasa.gov/saturn/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/saturn.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "uranus-nasa",
    bodyId: "uranus",
    purpose: "diffuse",
    title: "NASA Uranus imagery",
    url: "https://science.nasa.gov/uranus/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/uranus.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "neptune-nasa",
    bodyId: "neptune",
    purpose: "diffuse",
    title: "NASA Neptune imagery",
    url: "https://science.nasa.gov/neptune/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/neptune.jpg",
    processing: "Resized and compressed for web texture use."
  }
];
