import type { AssetSource } from "@/types/domain";

export const assetSources: AssetSource[] = [
  {
    id: "sun-nasa-sdo",
    bodyId: "sun",
    purpose: "diffuse",
    title: "SOHO Prominences",
    url: "https://science.nasa.gov/wp-content/uploads/2023/05/soho-prominences-1920x640-1.jpg?w=1536",
    agency: "NASA",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/sun.jpg",
    processing: "Representative official solar photograph, not a true equirectangular global texture; resized to 1024px wide and saved as JPEG for local web use."
  },
  {
    id: "mercury-nasa",
    bodyId: "mercury",
    purpose: "diffuse",
    title: "Mercury from MESSENGER",
    url: "https://science.nasa.gov/wp-content/uploads/2023/05/mercury-from-messenger-pia15160-1920x640-1.jpg?w=1536",
    agency: "NASA / Johns Hopkins University Applied Physics Laboratory / Carnegie Institution of Washington",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/mercury.jpg",
    processing: "Representative official spacecraft photograph, not a true equirectangular global texture; resized to 1024px wide and saved as JPEG for local web use."
  },
  {
    id: "venus-nasa",
    bodyId: "venus",
    purpose: "diffuse",
    title: "Venus from Mariner 10",
    url: "https://science.nasa.gov/wp-content/uploads/2023/05/venus-mariner-10-pia23791-1920x640-1.jpg?w=1536",
    agency: "NASA / JPL-Caltech",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/venus.jpg",
    processing: "Representative official spacecraft photograph, not a true equirectangular global texture; resized to 1024px wide and saved as JPEG for local web use."
  },
  {
    id: "earth-nasa",
    bodyId: "earth",
    purpose: "diffuse",
    title: "Earth",
    url: "https://science.nasa.gov/wp-content/uploads/2023/05/earth-1-jpg.webp?w=1600",
    agency: "NASA",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/earth.jpg",
    processing: "Representative official Earth photograph, not a true equirectangular global texture; converted from source WebP to JPEG, resized to 1024px wide, and saved for local web use."
  },
  {
    id: "moon-nasa",
    bodyId: "moon",
    purpose: "diffuse",
    title: "NASA Images Moon and Earth view",
    url: "https://images-assets.nasa.gov/image/art002e009287/art002e009287~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1280&w=1920",
    agency: "NASA",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/moon.jpg",
    processing: "Representative official Moon photograph, not a true equirectangular global texture; resized to 1024px wide and saved as JPEG for local web use."
  },
  {
    id: "mars-nasa",
    bodyId: "mars",
    purpose: "diffuse",
    title: "Mars PIA04304",
    url: "https://science.nasa.gov/wp-content/uploads/2024/03/pia04304-mars.jpg?w=1536",
    agency: "NASA / JPL-Caltech",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/mars.jpg",
    processing: "Representative official spacecraft-derived Mars image, not a true equirectangular global texture; resized to 1024px wide and saved as JPEG for local web use."
  },
  {
    id: "jupiter-nasa",
    bodyId: "jupiter",
    purpose: "diffuse",
    title: "Jupiter Marble PIA22946",
    url: "https://science.nasa.gov/wp-content/uploads/2024/03/jupiter-marble-pia22946.jpg?w=1536",
    agency: "NASA / JPL-Caltech / SwRI / MSSS",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/jupiter.jpg",
    processing: "Representative official Juno spacecraft image, not a true equirectangular global texture; resized to 1024px wide and saved as JPEG for local web use."
  },
  {
    id: "saturn-nasa",
    bodyId: "saturn",
    purpose: "diffuse",
    title: "Saturn Farewell PIA21345",
    url: "https://science.nasa.gov/wp-content/uploads/2023/05/saturn-farewell-pia21345-sse-banner-1920x640-1.jpg?w=1536",
    agency: "NASA / JPL / Space Science Institute",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/saturn.jpg",
    processing: "Representative official Cassini photograph with rings, not a true equirectangular global texture; resized to 1024px wide and saved as JPEG for local web use."
  },
  {
    id: "uranus-nasa",
    bodyId: "uranus",
    purpose: "diffuse",
    title: "Uranus PIA18182",
    url: "https://science.nasa.gov/wp-content/uploads/2023/06/uranus-pia18182-1920x640-1-jpg.webp?w=1536",
    agency: "NASA / JPL-Caltech",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/uranus.jpg",
    processing: "Representative official Uranus photograph, not a true equirectangular global texture; converted from source WebP to JPEG, resized to 1024px wide, and saved for local web use."
  },
  {
    id: "neptune-nasa",
    bodyId: "neptune",
    purpose: "diffuse",
    title: "Neptune PIA01492",
    url: "https://science.nasa.gov/wp-content/uploads/2023/06/neptune-pia01492-1920x640-2-jpg.webp?w=1536",
    agency: "NASA / JPL-Caltech",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-18",
    localPath: "/textures/neptune.jpg",
    processing: "Representative official Voyager 2 photograph, not a true equirectangular global texture; converted from source WebP to JPEG, resized to 1024px wide, and saved for local web use."
  }
];
