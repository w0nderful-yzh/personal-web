---
title: 智能宠物看护与 AI Agent
summary: 把设备接入、视频告警和 AI 建议组合起来，让宠物看护不只停留在“看见发生了什么”。
date: 2026-04-01
status: active
featured: true
technologies:
  - Spring Boot
  - Redis
  - Spring AI
  - Docker
role: 后端开发
draft: false
---

## 为什么会做它

这是一个面向宠物看护场景的智能设备与 AI 辅助系统。比起单纯展示摄像头画面，我更想尝试让系统结合设备状态、告警记录和用户问题，给出有上下文的看护建议。

## 我负责的部分

- 设计 `device`、`iot_device_credential` 等核心数据结构。
- 封装萤石云开放平台接口，处理设备信息、直播地址和告警同步。
- 区分本系统用户身份与第三方设备凭证，设计设备托管授权流程。
- 使用 Spring AI 接入大模型，完成宠物看护 Agent 原型。
- 使用 Docker Compose 统一管理 MySQL 与 Redis 开发环境。

## 还在继续

目前这个项目仍然在生长中。下一步会继续完善告警分析、长期看护记录和更自然的多轮问答。
