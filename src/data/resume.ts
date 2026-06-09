export const resume = {
  name: '杨子豪',
  role: 'Java 后端开发学习生',
  summary:
    '杭州电子科技大学计算机科学与技术专业本科在读，具备 Spring Boot、MySQL、Redis 后端项目开发经验，关注高并发缓存设计与 AI 应用落地。',
  contacts: [
    { label: 'Email', value: '3353291703@qq.com', href: 'mailto:3353291703@qq.com' },
    { label: 'GitHub', value: 'github.com/w0nderful-yzh', href: 'https://github.com/w0nderful-yzh' },
    { label: 'Website', value: 'yzh666.dev', href: 'https://yzh666.dev' },
  ],
  skills: [
    'Java',
    'Spring Boot',
    'Spring MVC',
    'MyBatis-Plus',
    'MySQL',
    'Redis',
    'Spring AI',
    'Docker',
    'Nginx',
    'Git',
  ],
  experience: [
    {
      org: '萤石云开放平台 · 个人项目',
      role: '智能宠物看护与 AI Agent 系统',
      period: '2026.04 - 至今',
      points: [
        '负责设备管理模块、萤石云接口封装、设备授权流程与智能问答后端开发。',
        '接入 Spring AI，根据设备状态、告警记录和用户问题生成宠物看护建议。',
        '使用 Docker Compose 管理 MySQL、Redis 等本地依赖环境。',
      ],
    },
    {
      org: '个人项目',
      role: '惠享生活：本地探店与优惠券秒杀系统',
      period: '2026.02 - 2026.04',
      points: [
        '使用 Redis 实现登录会话、热点数据缓存和商户详情缓存。',
        '通过 Redis Lua 脚本完成秒杀资格校验与原子扣减，降低重复下单风险。',
        '拆分秒杀下单链路，减少高并发请求直接访问 MySQL 的压力。',
      ],
    },
  ],
  education: [
    {
      school: '杭州电子科技大学',
      degree: '计算机科学与技术 · 本科在读 · CET-6',
      period: '2024 - 2028',
    },
  ],
};
