---
title: Astro Content Collections 速记
summary: 内容集合的字段校验、查询和动态路由基础。
createdAt: 2026-06-08
updatedAt: 2026-06-08
topic: Astro
tags:
  - Astro
  - TypeScript
status: growing
draft: false
---

## 基本结构

内容集合把 Markdown 文件变成经过 schema 校验的数据。字段错误会在开发或构建阶段暴露，而不是到页面运行时才发现。

## 当前项目约定

- Projects 使用 `date` 和 `status`
- Blog 使用 `publishedAt`
- Notes 使用 `createdAt`、`updatedAt` 和成长状态

下一步补充标签聚合和草稿环境区分。
