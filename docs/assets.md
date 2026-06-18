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

数据源记录同步维护在 `src/data/assets.ts`。二进制贴图放在 `public/textures/`，下载日期均为 2026-06-18。

| 天体 | 本地文件 | 来源 URL | 机构 | 用途 | 处理说明 |
| --- | --- | --- | --- | --- | --- |
| 太阳 | `/textures/sun.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/soho-prominences-1920x640-1.jpg?w=1536 | NASA | diffuse | NASA 官方太阳代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 水星 | `/textures/mercury.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/mercury-from-messenger-pia15160-1920x640-1.jpg?w=1536 | NASA / Johns Hopkins University Applied Physics Laboratory / Carnegie Institution of Washington | diffuse | MESSENGER 航天器代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 金星 | `/textures/venus.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/venus-mariner-10-pia23791-1920x640-1.jpg?w=1536 | NASA / JPL-Caltech | diffuse | Mariner 10 代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 地球 | `/textures/earth.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/earth-1-jpg.webp?w=1600 | NASA | diffuse | NASA 官方地球代表性照片；不是严格的 equirectangular global texture。源文件为 WebP，使用 `sips` 转为 JPEG 并缩放到 1024px 宽。 |
| 月球 | `/textures/moon.jpg` | https://images-assets.nasa.gov/image/art002e009287/art002e009287~large.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1280&w=1920 | NASA | diffuse | NASA Images 月面代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 火星 | `/textures/mars.jpg` | https://science.nasa.gov/wp-content/uploads/2024/03/pia04304-mars.jpg?w=1536 | NASA / JPL-Caltech | diffuse | NASA 官方航天器观测派生火星代表图；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 木星 | `/textures/jupiter.jpg` | https://science.nasa.gov/wp-content/uploads/2024/03/jupiter-marble-pia22946.jpg?w=1536 | NASA / JPL-Caltech / SwRI / MSSS | diffuse | Juno 航天器代表性照片；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 土星 | `/textures/saturn.jpg` | https://science.nasa.gov/wp-content/uploads/2023/05/saturn-farewell-pia21345-sse-banner-1920x640-1.jpg?w=1536 | NASA / JPL / Space Science Institute | diffuse | Cassini 代表性照片，包含环系统；不是严格的 equirectangular global texture。使用 `sips` 缩放到 1024px 宽并保存为 JPEG。 |
| 天王星 | `/textures/uranus.jpg` | https://science.nasa.gov/wp-content/uploads/2023/06/uranus-pia18182-1920x640-1-jpg.webp?w=1536 | NASA / JPL-Caltech | diffuse | NASA 官方天王星代表性照片；不是严格的 equirectangular global texture。源文件为 WebP，使用 `sips` 转为 JPEG 并缩放到 1024px 宽。 |
| 海王星 | `/textures/neptune.jpg` | https://science.nasa.gov/wp-content/uploads/2023/06/neptune-pia01492-1920x640-2-jpg.webp?w=1536 | NASA / JPL-Caltech | diffuse | Voyager 2 代表性照片；不是严格的 equirectangular global texture。源文件为 WebP，使用 `sips` 转为 JPEG 并缩放到 1024px 宽。 |

## 授权参考

主要参考：

- NASA Images and Media Usage Guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/
- NASA Photojournal: https://science.nasa.gov/photojournal/
- NASA Solar System: https://science.nasa.gov/solar-system/
- NASA Visible Earth: https://visibleearth.nasa.gov/
