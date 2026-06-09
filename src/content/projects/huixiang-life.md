---
title: 惠享生活
summary: 一个包含本地探店、商户查询、点赞关注和优惠券秒杀的生活服务后端练习。
date: 2026-02-01
status: completed
featured: true
technologies:
  - Spring Boot
  - MySQL
  - Redis
  - Lua
  - JWT
role: 后端开发
draft: false
---

## 项目内容

惠享生活是一个本地生活服务后端，包含用户登录、商户查询、优惠券秒杀、达人探店和点赞关注等模块。

## 练习重点

- 将登录状态放入 Redis，通过双拦截器完成身份校验与 Token 刷新。
- 根据缓存穿透和热点商户场景，使用缓存空值、互斥锁和逻辑过期策略。
- 使用 Redis Lua 脚本把库存扣减和一人一单判断合并为原子操作。
- 拆分秒杀下单链路，降低高并发请求直接访问 MySQL 的风险。
- 使用 MyBatis-Plus 完成用户、商户、订单和探店笔记等模块。

## 收获

这个项目让我第一次比较完整地把 Redis 从“会用 API”推进到“理解它在业务链路中的位置”。
