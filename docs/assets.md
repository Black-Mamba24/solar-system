# 素材来源

本项目的太阳、行星和月球视觉素材必须来自真实公开影像或由真实观测资料制作的贴图。页面可标注素材来源，但不能暗示 NASA、JPL、USGS 或其他机构背书。

## 使用规则

- 运行时不从互联网动态加载素材。
- 每个素材都需要记录来源 URL、机构、使用说明、下载日期、本地路径和处理方式。
- 如果页面标记第三方版权，不能直接使用。
- 如果素材由真实影像派生，需要说明处理方式。

## 机构背书声明

NASA、JPL、USGS 等机构名称只用于素材来源署名。本项目不是 NASA、JPL、USGS 或其合作机构的官方项目，也不暗示这些机构对项目、代码、页面内容或视觉呈现背书。

## 当前素材清单

数据源记录同步维护在 `src/data/assets.ts`。二进制图片放在 `public/textures/`。`diffuse` 用于信息面板全貌介绍图；`surface` / `clouds` 用于 3D 球体渲染。

| 天体 | 本地文件 | 来源 URL | 机构 | 用途 | 处理说明 |
| --- | --- | --- | --- | --- | --- |
| 太阳 | `/textures/sun.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/soho-prominences-1920x640-1.jpg?w=1536 | NASA | diffuse | NASA 官方太阳代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 太阳表面 | `/textures/sun-surface.jpg` | https://svs.gsfc.nasa.gov/10610/ | NASA / AIA / Goddard Space Flight Center | surface | 由 NASA SDO/AIA 304 全日面图重采样生成 2048x1024 太阳表面纹理，用于 3D 球面表面。 |
| 水星全貌 | `/textures/mercury.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/mercury-from-messenger-pia15160-1920x640-1.jpg?w=1536 | NASA / Johns Hopkins University Applied Physics Laboratory / Carnegie Institution of Washington | diffuse | MESSENGER 航天器全貌介绍图，1536x512 JPEG，用于信息面板。 |
| 水星表面 | `/textures/mercury-surface.jpg` | https://www.solarsystemscope.com/textures/download/2k_mercury.jpg | Solar System Scope, derived from NASA / MESSENGER imagery | surface | 等距全球表面纹理，2048x1024 JPEG，用于 3D 球面表面和 bump 细节。 |
| 金星全貌 | `/textures/venus.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/venus-mariner-10-pia23791-1920x640-1.jpg?w=1536 | NASA / JPL-Caltech | diffuse | Mariner 10 全貌介绍图，1536x512 JPEG，用于信息面板。 |
| 金星表面 | `/textures/venus-surface.jpg` | https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg | Solar System Scope, derived from NASA / Magellan radar imagery | surface | 等距全球表面纹理，2048x1024 JPEG，用于 3D 球面表面和 bump 细节。 |
| 金星云层 | `/textures/venus-clouds.jpg` | https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg | Solar System Scope, derived from NASA Venus imagery | clouds | 等距金星云层纹理，2048x1024 JPEG，用于半透明厚云壳。 |
| 地球 | `/textures/earth.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/earth-1-jpg.webp?w=1600 | NASA | diffuse | NASA 官方地球代表性照片；不是严格的 equirectangular global texture。源文件为 WebP，使用 `sips` 转为 JPEG 并缩放到 1024px 宽。 |
| 地球表面 | `/textures/earth-surface.jpg` | https://svs.gsfc.nasa.gov/vis/a000000/a003600/a003615/earth_noClouds.0330.jpg | NASA / Goddard Space Flight Center Scientific Visualization Studio | surface | Blue Marble Next Generation 无云等距全球地表纹理，2048x1024 JPEG，用于 3D 球体表面和轻微 bump 细节。 |
| 地球云层 | `/textures/earth-clouds.png` | https://svs.gsfc.nasa.gov/vis/a000000/a003600/a003615/flat_earth03.jpg | NASA / Goddard Space Flight Center Scientific Visualization Studio | clouds | 从 NASA SVS 带云/无云 Blue Marble 等距图差分提取透明 PNG，2048x1024，用作独立半透明云壳；极区透明度已软化，并降低东亚/中国附近云层 alpha。 |
| 月球 | `/textures/moon.jpg` | https://images-assets.nasa.gov/image/art002e009287/art002e009287~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1280&w=1920 | NASA | diffuse | NASA Images 月面代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 月球表面 | `/textures/moon-surface.jpg` | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_moon.jpg | Solar System Scope, based on NASA / LRO and lunar imagery | surface | 等距全球月面纹理，8192x4096 JPEG，用于 3D 球面月海、撞击坑、辐射纹和 bump 细节。 |
| 月食地球视角月面基底 | `/textures/lunar-eclipse-moon-nasa-svs.jpg` | https://svs.gsfc.nasa.gov/3444/ | NASA / Goddard Space Flight Center Scientific Visualization Studio | diffuse | NASA SVS Clementine 满月静帧，用作地球视角月食动画基底；运行时裁出居中的月球圆盘，再叠加由几何模型驱动的半影、本影和大气折射红色，不再用程序化椭圆斑块生成月面。 |
| 月全食血月参考 | `/textures/lunar-eclipse-blood-moon-reference-nasa-svs.jpg` | https://svs.gsfc.nasa.gov/4979/ | NASA / Goddard Space Flight Center Scientific Visualization Studio | fallback | NASA SVS 2022 年 5 月月全食望远镜视角参考帧，用于校准铜红/暗红色调；不作为突兀切换的整图状态。 |
| 火星 | `/textures/mars.jpg` | https://science.nasa.gov/wp-content/uploads/2024/03/pia04304-mars.jpg?w=1536 | NASA / JPL-Caltech | diffuse | NASA 官方航天器观测派生火星代表图；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 火星表面 | `/textures/mars-surface.jpg` | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_mars.jpg | Solar System Scope, based on NASA Mars imagery | surface | 等距全球表面纹理，3840x1920 JPEG，用于 3D 球面表面和 bump 细节。 |
| 木星 | `/textures/jupiter.jpg` | https://science.nasa.gov/wp-content/uploads/2024/03/jupiter-marble-pia22946.jpg?w=1536 | NASA / JPL-Caltech / SwRI / MSSS | diffuse | Juno 航天器代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 木星大气表面 | `/textures/jupiter-surface.jpg` | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_jupiter.jpg | Solar System Scope, based on NASA / Juno and spacecraft imagery | surface | 等距全球大气纹理，3840x1920 JPEG，用于 3D 球面云带、大红斑和涡旋细节。 |
| 土星 | `/textures/saturn.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/saturn-farewell-pia21345-sse-banner-1920x640-1.jpg?w=1536 | NASA / JPL / Space Science Institute | diffuse | Cassini 代表性照片，包含环系统；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 土星大气表面 | `/textures/saturn-surface.jpg` | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_saturn.jpg | Solar System Scope, based on NASA / Cassini imagery | surface | 等距全球大气纹理，3840x1920 JPEG，用于 3D 球面柔和云带。 |
| 土星环 | `/textures/saturn-rings.png` | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_2k_saturn_ring_alpha.png | Solar System Scope, based on NASA / Cassini imagery | ring | RGBA 环系统纹理，2048x125 PNG，用于极薄土星环平面。 |
| 天王星 | `/textures/uranus.jpg` | https://science.nasa.gov/wp-content/uploads/2023/06/uranus-pia18182-1920x640-1-jpg.webp?w=1536 | NASA / JPL-Caltech | diffuse | NASA 官方天王星代表性照片；不是严格的 equirectangular global texture。源文件为 WebP，使用 `sips` 转为 JPEG 并缩放到 1024px 宽。 |
| 天王星大气表面 | `/textures/uranus-surface.jpg` | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_2k_uranus.jpg | Solar System Scope, based on NASA / Voyager and planetary imagery | surface | 等距全球大气纹理，2048x1024 JPEG，用于 3D 球面淡蓝绿甲烷大气、极区色彩和高纬云团基础映射。 |
| 海王星 | `/textures/neptune.jpg` | https://science.nasa.gov/wp-content/uploads/2023/06/neptune-pia01492-1920x640-2-jpg.webp?w=1536 | NASA / JPL-Caltech | diffuse | Voyager 2 代表性照片；不是严格的 equirectangular global texture。源文件为 WebP，使用 `sips` 转为 JPEG 并缩放到 1024px 宽。 |
| 海王星大气表面 | `/textures/neptune-surface.jpg` | https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_2k_neptune.jpg | Solar System Scope, based on NASA / Voyager and planetary imagery | surface | 等距全球大气纹理，2048x1024 JPEG，用于 3D 球面深蓝甲烷大气、大黑斑和高空卷云基础映射。 |

## 授权参考

主要参考：

- NASA Images and Media Usage Guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/
- NASA Photojournal: https://science.nasa.gov/photojournal/
- NASA Solar System: https://science.nasa.gov/solar-system/
- NASA Visible Earth: https://visibleearth.nasa.gov/
