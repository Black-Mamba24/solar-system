# 项目约定

## 语言与文档

- 所有面向项目的文档、规格、计划、说明和评审记录默认使用中文。
- 技术名词、库名、API 名称、命令、代码标识符和文件路径可以保留原文。
- 面向用户的产品文案优先使用中文，除非后续明确加入多语言内容。

## 工作方法

- 在方案设计、bug 修复、代码编写、问题复盘等环节，必须从第一性原理出发：先明确目标、约束、真实机制、失败原因和不可违背的边界，再选择实现方式；不要只套用既有模板或对表面现象做局部补丁。
- 任何需要进行代码、文档、配置、素材或测试变更的任务，在动手前必须先执行 `grill-me` skill，对目标、边界、风险、可选方案和不明确点进行追问；随后必须把所有拟改动点和疑问点与用户确认，确认后才能开始变更。
- 完成方案设计、bug 修复、代码编写等工作后，必须开启多Agent进行对抗式审查：主动寻找反例、边界条件、回归风险、与用户目标不一致之处，以及是否引入新的复杂度或视觉/行为副作用；审查结果要落实为修改或明确说明取舍。

## 天体模型与视觉素材

- 太阳、行星和月球的 3D 主模型优先使用真实公开影像、航天器观测资料或由真实观测资料制作的等距全球纹理，不使用简陋几何图形、曲线、色块或纯噪声来替代天体表面。
- 信息面板图片和 3D 表面纹理必须分离维护：
  - `purpose: "diffuse"` 用于信息面板全貌/代表图，保持可识别的天体全貌。
  - `purpose: "surface"` / `"clouds"` / `"ring"` 用于 3D 球体、云层或环系统贴图。
  - 不要为了 3D 细节把信息面板全貌图替换成局部细节图。
- 新增真实纹理时，必须同步更新 `src/data/assets.ts` 和 `docs/assets.md`，记录来源 URL、机构、授权/署名说明、下载日期、本地路径和处理方式。
- 3D 模型资源放在 `public/textures/`，文件命名使用 `body-purpose.ext`，例如 `moon-surface.jpg`、`saturn-rings.png`。
- 材质应服务天体真实性：
  - 岩质天体使用高 roughness、低 metalness，并可使用同一真实纹理作为 `bumpMap` 增强地貌。
  - 气态/冰巨星强调云层、大气和风暴纹理，不表现为固体陆地。
  - 暗弱行星环使用低透明度暗灰/深褐半透明材质，不使用高亮发光材质；必要时只加克制的受光侧高光和背光侧微弱散射。
- 对有显著特征的天体，需要用稳定命名的 mesh/group 表达特征，便于测试保护，例如大黑斑、土星环、天王星暗环、海王星 Adams 不连续环弧、月海/撞击坑纹理层等。

## 前端实现规范

- 保持现有 Next.js、React、Three.js、Tailwind 和 TypeScript 风格，不引入无必要的新框架或大型依赖。
- 交互控件优先使用语义化 `button`，图标优先使用 `lucide-react`，并提供 `aria-label` / `title`。
- UI 文案通过 `src/i18n/dictionaries.ts` 维护，中英文界面都要补齐字典字段。
- 每个非首页子页面都必须提供返回首页入口，统一使用共享的返回首页组件和样式；链接需保留当前语言参数。
- 面板、按钮和控制条要保持紧凑、可扫描，不新增营销式 hero 或大面积装饰背景。
- 修改浏览器 API 相关功能时，需要兼容 SSR/测试环境，先判断 `typeof window !== "undefined"` 和 API 是否存在。

## 测试与验证

- 涉及代码行为或视觉结构变更时，至少运行：
  - `npx tsc --noEmit`
  - 相关 `vitest` 测试
  - `npm run lint`
- 涉及天体模型、贴图、WebGL 或页面布局时，额外用浏览器验证：
  - 3D 场景实际加载新的 `surface` / `clouds` / `ring` 资源。
  - 信息面板仍加载对应 `diffuse` 全貌图。
  - 页面截图或像素抽样确认 canvas 非空且目标天体可见。
- 不要在已有 dev server 正常运行时随意执行会破坏 `.next` 静态资源状态的操作；如需构建或重启，先确认不会影响当前页面样式验证。

### Next.js dev/build 缓存污染处理规范

- **问题表现**：访问首页时样式全部丢失，或终端出现 `Cannot find module './<chunk>.js'`，堆栈指向 `.next/server/webpack-runtime.js`、`.next/server/app/_not-found/page.js` 等 Next.js 构建产物。
- **根因**：已有 `npm run dev` / `next dev` 开发服务正在使用 `.next` 开发缓存时，又执行了 `npm run build` 或其它会重写 `.next` 的操作，导致开发服务引用的 server chunk、CSS 和静态资源与磁盘上的 `.next` 内容不一致。
- **标准解法**：停止当前项目的 Next dev 进程，清理 `.next`，再重新启动开发服务。
  - 推荐命令：`pkill -f '/Users/bytedance/projects/solar-system/node_modules/.bin/next dev' || true`
  - 如仍有包装进程：`pkill -f 'npm run dev' || true`
  - 清理缓存：`rm -rf .next`；如果目录为空但删除失败，可尝试 `rmdir .next`。
  - 重启：`npm run dev`。
- **预防要求**：运行 `npm run build` 前，先确认是否已有 dev server 正在运行；如果有，优先停止 dev server，或在 build 完成后主动重启 dev server。不要把 build 后的 `.next` 状态直接交给旧的 dev server 继续使用。
- **验证方式**：重启后访问首页，确认 HTML 中存在 `/_next/static/css/` 样式资源，并用 `curl -I http://localhost:3000/_next/static/css/...` 确认 CSS 返回 `200 OK` 与 `Content-Type: text/css`。

## Git 与文件编辑

- 工作区可能已有用户或其它任务的未提交改动；不要回滚、覆盖或格式化与当前任务无关的文件。
- 手工编辑文件使用 `apply_patch`，避免用 shell 重定向重写整文件。
- 新增或调整规范、素材、模型时，保持变更范围聚焦；不要顺手做无关重构。
