# 太阳系探索 Solar System Explorer

一个可分享、可部署、可开源维护的中英文太阳系科普网站。第一版聚焦“太阳系概述”：首页展示六个学习主题，但只有太阳系概述可进入完整 3D 学习体验。

## 功能范围

- 沉浸式首页和 `/overview` 太阳系概述页面。
- 基于 Three.js / React Three Fiber 的 3D 太阳、八大行星和月球展示。
- 近似轨道运动、时间控制、相机预设和图层开关。
- 天体百科面板，覆盖基础事实、意义说明和本地化内容。
- 中文 / English 切换，通过 `?lang=zh` 和 `?lang=en` 保持 URL 可分享。
- 真实公开影像来源记录，并在 `public/textures/` 暂存本地素材文件。

当前 3D 场景已经在网格 `userData` 中保留贴图来源路径，但运行时仍使用 fallback / programmatic materials 渲染天体颜色；真实图片贴图映射会在后续任务中接入。

第一版不实现日食、月食、水星逆行、小行星带、木星卫星五个专题页面；这些入口在首页保留为 coming soon。

## 运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 验证

```bash
npm run test
npm run lint
npm run build
```

聚焦数据完整性检查：

```bash
npm run test -- src/data/data-integrity.test.ts
```

## 素材与授权

太阳、行星和月球视觉素材来自 NASA 官方页面或 NASA Images 服务，来源记录见 `docs/assets.md` 和 `src/data/assets.ts`。这些文件目前作为可追溯的公开素材资产随项目暂存，供后续 texture mapping 使用；当前运行时场景尚未加载这些图片作为球体贴图。当前素材以代表性官方影像为主，并非全部都是严格的 equirectangular global texture；具体处理方式逐项记录在素材表中。

NASA、JPL、USGS 等机构名称只用于来源署名。本项目不暗示这些机构对项目、网站内容、代码或展示效果背书。复用、分发或再发布素材前，应再次核对对应来源页面和 NASA Images and Media Guidelines。

## 架构原则

- 数据、i18n、素材元数据、轨道计算、URL 状态、UI 组件和 3D 渲染分层维护。
- 领域数据保持纯数据结构，渲染组件不内联来源或授权信息。
- 新增专题必须通过清晰接口接入，不破坏首页、概述模块、中英文切换和素材来源记录。
- 优先保持高内聚、低耦合、单一职责和 YAGNI；新增测试覆盖用户可见行为和共享数据约束。
