---
title: "：Sentinel"
sequence: "123"
---

- Sentinel
- 安装Sentinel控制台
- 初始化演示工程
- 流控规则
  - 流控效果
    - 直接失败
    - WarmUp
    - 排队等待
- 降级规则
  - RT: response time
  - 异常比例
  - 异常数（DEGRADE_GRADE_EXCEPTION_COUNT）
- 热点规则（key限流）
  - QPS
- 系统规则
- @SentinelResource
- 服务熔断功能
- 规则持久化

## Reference

- [Sentinel](https://github.com/alibaba/Sentinel/)
