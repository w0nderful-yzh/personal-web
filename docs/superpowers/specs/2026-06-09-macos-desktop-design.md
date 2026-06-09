# macOS 桌面主题 — 设计规范

> 状态：进行中 | 关联计划：`plan.md` | 更新：2026-06-09

## 1. 设计目标

首页采用 macOS 桌面隐喻作为核心视觉概念。目标：

1. **降低认知负担** — 利用访客熟悉的桌面范式，无需学习导航
2. **传递个人风格** — 通过细节（启动动画、毛玻璃、Dock 等）展现技术品味
3. **可扩展的交互层** — 桌面不仅是静态入口，更是可交互的操作环境
4. **渐进增强** — 无 JS 时降级为文本链接，桌面隐喻仅在浏览器支持时启用

## 2. 架构总览

```
index.astro (首页)
│
├── 状态机层 (client JS)
│   ├── off → booting → desktop → shutting-down → off
│   └── sessionStorage / localStorage 持久化
│
├── 桌面 UI 层 (HTML + CSS)
│   ├── 菜单栏 (Menu Bar)
│   ├── 桌面快捷方式 (Shortcut Grid)
│   ├── 系统组件 (System Widget)
│   ├── 桌面窗口 (Desktop Window) ─── 🆕 待实现
│   ├── 右键菜单 (Context Menu) ─── 🆕 待实现
│   ├── 通知中心 (Notification Center) ─── 🆕 待实现
│   └── Dock
│
├── 外部数据层 (client fetch)
│   ├── Open-Meteo 天气 API (30min 间隔)
│   └── 站点运行时间 / 本地访问计数
│
└── 降级层 (无 JS)
    └── 纯文本链接 + 导航降级
```

## 3. 状态机设计

### 3.1 状态定义

| 状态 | `data-state` | 触发条件 | 视觉效果 |
|------|-------------|---------|---------|
| `off` | `off` | 首次访问 / 关机完成 | 显示 POWER ON 按钮，背景暗色 |
| `booting` | `booting` | 点击 POWER ON | 按钮淡出 → 品牌标记 → 进度条 → 状态文字 |
| `desktop` | `desktop` | 启动完成 / 会话恢复 | 完整桌面 UI，菜单栏 + Dock + 桌面图标 |
| `shutting-down` | `shutting-down` | 点击 Dock 关机按钮 | 桌面淡出 → 回到关机画面 |

### 3.2 持久化策略

| 存储 | Key | 用途 |
|------|-----|------|
| `sessionStorage` | `personal-desktop-powered-on` | 跳过启动动画（同会话内返回 `/` 直接进桌面） |
| `sessionStorage` | `personal-desktop-visit-counted` | 防止同会话重复计数 |
| `localStorage` | `personal-desktop-local-visits` | 本地访问计数（每次新会话 +1） |
| `localStorage` | `snake-high-score` | 贪吃蛇最高分 |

### 3.3 动画时序

```
off → booting:
  t=0ms:     按钮 opacity 1→0 (300ms)
  t=300ms:   品牌标记 fade-in
  t=600ms:   进度条 0% → 100% (over 600ms)
  t=1200ms:  状态文字 "LOADING..." → "READY"
  t=1800ms:  .computer class → desktop

desktop → shutting-down:
  t=0ms:     桌面 opacity 1→0 (400ms)
  t=400ms:   .computer class → off
  t=400ms:   关机画面 fade-in

prefers-reduced-motion: 全部动画缩短至 180ms
```

## 4. 桌面 UI 元素规范

### 4.1 菜单栏 (Menu Bar)

```
┌──────────────────────────────────────────────────────────┐
│ [🔲🔲🔲🔲] Desktop   About Projects Blog Notes Playground │  🟢 Available  14:30
└──────────────────────────────────────────────────────────┘
```

- **位置**：`position: fixed; top: 0; left: 0; right: 0; z-index: 100`
- **样式**：深色半透明玻璃态 `background: rgba(30, 30, 30, 0.8); backdrop-filter: blur(20px)`
- **高度**：48px（桌面端）/ 44px（移动端）
- **品牌标记**：4-dot 网格图标 + "Desktop" 文字
- **导航链接**：当前页（`/`）显示为 `aria-current="page"` + 下划线
- **右侧状态**：绿色圆点（#34c759）+ "Available" + 实时时钟
- **响应式**：平板/手机隐藏部分导航，改为横向滚动

### 4.2 桌面快捷方式 (Shortcut Grid)

```
┌─────┐ ┌─────┐ ┌─────┐
│ 📁  │ │ 📝  │ │ 💻  │
│About│ │Blog │ │Proj.│
└─────┘ └─────┘ └─────┘
┌─────┐ ┌─────┐ ┌─────┐
│ 📋  │ │ 🎮  │ │ 📄  │
│Notes│ │Games│ │Resume│
└─────┘ └─────┘ └─────┘
```

- **数据源**：`src/data/desktop.ts` → `desktopApps`
- **布局**：CSS Grid, 3 列 × 2 行
- **入场动画**：错开 (staggered) fade-in + translateY，每个延迟 80ms
- **图标**：SVG 图标 + 白色文字标签 + `text-shadow` 保证可读性
- **交互**：`<a>` 链接，悬停缩放 1.05 + 阴影增强
- **焦点**：`focus-visible` 蓝色环

### 4.3 系统组件 (System Widget)

```
┌──────────────────────┐
│ SYSTEM ONLINE        │  ← 标题 + 绿色状态圆点
│                      │
│ Hangzhou, Zhejiang   │  ← 位置
│ ☀️ 26°C Partly Cloudy│  ← 天气 (Open-Meteo, 30min 刷新)
│                      │
│ Site Uptime          │  ← 基于 boot 时间的计时器
│ 02:34:15             │
│                      │
│ Local Visits ▸ 7     │  ← 本地访问计数
│ Since 2026.06.09     │  ← 启动日期
└──────────────────────┘
```

- **位置**：桌面左侧，垂直居中偏上
- **样式**：半透明白色卡片 `background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(12px); border-radius: 12px`
- **宽度**：220px
- **响应式**：平板缩小至 180px，手机隐藏
- **天气**：客户端 fetch Open-Meteo API（Hangzhou coord: 30.27, 120.15），无 API Key 需求

### 4.4 Dock

```
┌──────────────────────────────────────────┐
│ [Desktop] [GitHub] [Resume] [Mail] ｜ [⏻]│
└──────────────────────────────────────────┘
```

- **位置**：`position: fixed; bottom: 16px; left: 50%; translateX(-50%)`
- **样式**：浅色毛玻璃 `background: rgba(240, 240, 240, 0.7); backdrop-filter: blur(20px); border-radius: 20px`
- **高度**：56px（含 padding）
- **图标**：SVG 或 emoji，50×50px 点击区域
- **交互**：
  - 悬停：图标放大 1.3× + 邻居图标 1.15×（macOS 放大效果）
  - 工具提示：`::after` 气泡显示标签
  - 当前页（Desktop）：下方灰色圆点指示器（active indicator）
- **分隔线**：`|` 分隔符，区分导航链接和关机按钮
- **关机按钮**：红色，hover 加深，点击触发 `shutting-down` 状态
- **响应式**：手机隐藏 Dock

### 4.5 桌面窗口 (Desktop Window) 🆕

```
┌─────────────────────────────────┐
│ ●  ●  ●  Blog           [• • •]│  ← 红黄绿三色窗口按钮 + 标题
├─────────────────────────────────┤
│                                 │
│  窗口内容（博客列表 / 项目等）     │
│                                 │
│  可拖拽：mousedown 标题栏         │
│  可最小化：点击黄色按钮 → Dock    │
│  可关闭：点击红色按钮             │
│  z-index：点击置顶               │
│                                 │
├─────────────────────────────────┤
│                          [↘️]   │  ← 拖拽调整大小
└─────────────────────────────────┘
```

**行为规范**：

- **打开**：点击桌面快捷方式 或 Dock 图标 → 窗口从图标位置弹出（scale + fade-in）
- **关闭**：点击红色按钮 → 窗口缩小 + fade-out（300ms）
- **最小化**：点击黄色按钮 → 窗口缩小到 Dock 位置（genie effect 简化版）
- **最大化**：点击绿色按钮 → 窗口扩展至全屏（可选，初版跳过）
- **拖拽**：`mousedown` 标题栏 → `mousemove` 更新窗口位置 → `mouseup` 释放
- **z-index**：点击窗口或标题栏 → 窗口 z-index 设为当前最大值 + 1
- **边界限制**：拖拽不能使标题栏溢出视口（至少保留 50px 在可视区域内）

**技术实现**：

- 纯 Vanilla JS + CSS（与现有代码风格一致）
- 窗口模板：用 `<template>` 或 JS 动态生成 DOM
- 窗口内容：通过 `<slot>` 或 `innerHTML` 渲染（初版用简单的文本列表）
- 状态管理：`window.activeWindows = Map<id, {element, minimized, zIndex}>`

**最小化到 Dock**：

- 点击黄色按钮：窗口缩小动画（scale 1→0，opacity 1→0）
- Dock 对应图标显示底部指示器（表示窗口已最小化）
- 点击 Dock 图标：已最小化窗口恢复（scale 0→1）
- 所有窗口列表通过 `data-window-id` 关联 Dock 图标和窗口

### 4.6 右键上下文菜单 (Context Menu) 🆕

```
┌──────────────────────────┐
│ 新建窗口          ⌘N    │
│ ──────────────────────── │
│ 刷新桌面                 │
│ 整理图标                 │
│ ──────────────────────── │
│ 关于本网站               │
└──────────────────────────┘
```

**行为规范**：

- **触发**：桌面空白区域 `contextmenu` 事件（唯一触发方式，不提供左键触发）
- **位置**：鼠标位置处弹出，不超出视口（自动调整）
- **关闭**：点击菜单项 → 执行动作后关闭；点击菜单外 → 关闭；Esc → 关闭
- **外观**：
  - macOS 风格圆角菜单（`border-radius: 8px`）
  - 白色半透明背景 + `backdrop-filter: blur(20px)`
  - 内阴影 + 外阴影模拟 macOS 菜单阴影
  - 分隔线：灰色 `1px solid rgba(0,0,0,0.1)`
- **菜单项**：
  - 悬停高亮（蓝色 `#007aff` 背景 + 白色文字）
  - 快捷键右对齐，灰色文字
  - 分隔线不可交互

### 4.7 通知中心 (Notification Center) 🆕

**触发方式**：

- 菜单栏右侧添加铃铛图标 🔔 + 未读角标
- 点击铃铛 → 右侧滑出通知面板

**通知面板**：

```
┌─────────────────────────┐
│ 通知中心          清除  │
├─────────────────────────┤
│ ● 2026-06-09           │
│   新文章：搜索功能设计笔记  │
│   2h ago               │
├─────────────────────────┤
│ ○ 2026-06-08           │
│   新笔记：Astro 集合使用指 │
│   1d ago               │
├─────────────────────────┤
│   暂无更多通知           │
└─────────────────────────┘
```

**数据源**：

- 从 Blog 和 Notes 的最新内容生成通知
- 已读/未读状态：localStorage 持久化
- 通知存储：`localStorage` key `personal-desktop-notifications`

**行为规范**：

- **滑出动画**：从右侧滑入（`translateX(100%) → 0`，300ms）
- **关闭**：点击面板外 / 点击关闭按钮 / Esc → 滑出
- **角标**：未读通知数量，红色圆点 + 白色数字
- **标记已读**：展开面板视为已读，清除角标
- **清除全部**：点击"清除"按钮，清除所有通知记录

## 5. 技术约束

### 5.1 无框架依赖

桌面交互全部使用 Vanilla JS（与现有 `index.astro` 内联 `<script>` 风格一致），不引入 React/Vue/Svelte 等运行时框架。

### 5.2 渐进增强

```text
JS 可用 → 完整桌面体验（窗口 + 右键菜单 + 通知）
JS 不可用 → 桌面快捷方式降级为纯文本链接
```

- 所有交互元素在无 JS 时有合理的 HTML 后备
- `aria-hidden` / `inert` 属性随状态切换动态更新

### 5.3 性能

- 天气 API 每 30 分钟刷新，不频繁请求
- 时钟每 30 秒更新，避免 1s 间隔
- 动画使用 CSS `transform` 和 `opacity`（GPU 加速）
- 窗口拖拽使用 `requestAnimationFrame` 节流

### 5.4 响应式策略

| 屏幕宽度 | 桌面体验 |
|---------|---------|
| ≥ 1024px | 完整 macOS 桌面（菜单栏 + Dock + 桌面图标 + 系统组件 + 窗口） |
| 768-1023px | 简化桌面（缩小图标、Dock 保留、系统组件缩小、窗口默认最大化） |
| < 768px | 桌面降级为列表导航、Dock 隐藏、桌面快捷方式改为卡片列表、窗口全屏显示 |
| < 680px 高度 | 系统组件和顶部间距压缩，窗口尽可能全屏 |

### 5.5 可访问性

- 窗口焦点管理：打开窗口时，焦点移至窗口内的第一个可聚焦元素
- Esc 关闭：所有浮动 UI（窗口、菜单、通知面板）均响应 Esc 关闭
- `prefers-reduced-motion`：所有动画缩短至 1ms 或直接跳过
- 键盘导航：Tab 键在窗口内循环，Ctrl+Tab 切换窗口

## 6. 文件规划

### 6.1 需修改的文件

| 文件 | 变更 |
|------|------|
| `src/pages/index.astro` | 整合窗口系统、右键菜单、通知中心的 JS 和 CSS |
| `src/data/desktop.ts` | 扩展配置文件，增加窗口内容映射等 |

### 6.2 新增的文件

| 文件 | 用途 |
|------|------|
| `src/styles/desktop.css` | 桌面 UI 专用样式（窗口、菜单、通知、Dock），从 `global.css` 和 `index.astro` 内联样式中抽取 |

### 6.3 需删除的文件（死代码清理）

| 文件 | 原因 |
|------|------|
| `src/components/BlurText.tsx` | 未被任何页面引用，依赖 `motion` |
| `src/components/ui/button.tsx` | 未被任何页面引用，依赖 `radix-ui`、`cva` |
| `src/lib/utils.ts` | 仅被 button.tsx 引用，无其他消费者 |
| `src/data/navigation.ts` | Header 使用内联导航数组，未引用此模块 |
| `src/hooks/` | 空目录 |
| `components.json` | shadcn/ui 配置，无对应组件使用 |

### 6.4 需移除的 npm 依赖

| 包 | 原因 |
|---|------|
| `lucide-react` | 无 import 引用 |
| `motion` | 仅 BlurText.tsx 使用 |
| `radix-ui` | 仅 button.tsx 使用 |
| `class-variance-authority` | 仅 button.tsx 使用 |
| `clsx` | 仅 utils.ts 使用（utils.ts 仅被 button.tsx 使用） |
| `tailwind-merge` | 同上 |

## 7. 实现顺序

1. **死代码清理** — 删除未使用的文件和依赖
2. **桌面窗口系统** — 核心交互，可拖拽/最小化/关闭
3. **右键上下文菜单** — `contextmenu` 事件 + macOS 风格菜单
4. **通知中心** — 菜单栏通知图标 + 侧滑面板
5. **样式抽取** — 将桌面相关样式整理到 `desktop.css`
6. **测试验证** — 桌面端/平板/手机 + 键盘/鼠标 + reduced-motion
