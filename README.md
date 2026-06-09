# personal-web

`yzh666.dev` 的可运行个人网站 Demo，使用 Astro、TypeScript 和 Markdown Content Collections 构建。

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 内容位置

- 项目：`src/content/projects`
- 文章：`src/content/blog`
- 笔记：`src/content/notes`
- 个人资料：`src/data/profile.ts`
- 简历：`src/data/resume.ts`

当前内容包含用于演示页面结构的示例文案，发布前需要替换为真实资料。

## 桌面外观

首页的壁纸与快捷方式统一配置在 `src/data/desktop.ts`。

- 壁纸：`public/images/desktop/wallpaper.svg`
- 快捷方式图标：`public/images/desktop/icon-*.svg`

替换对应图片后保持文件路径不变即可直接更新；如果需要改文件名、入口名称或链接，则修改
`src/data/desktop.ts`。
