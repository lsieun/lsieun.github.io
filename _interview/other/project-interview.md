---
title: "项目"
sequence: "project"
---

## 项目经历

- 做了什么项目
- 项目是做什么的
- 我做了哪些模块？或我的工作职责

- DMA 项目
    - 分区管理模块
    - 分区监控模块
        - 平均压力：有三级分区，一级分区、二级分区、三级分区，压力表
    - 水量统计模块
        - 一个月的用水量
    - 漏损分析模块
        - 夜间最小流量
    - 统计图表模块
    - 报警模块
        - RocketMQ

## 项目做了哪些优化

- 代码优化
    - 将常用到的代码提取成工具类
    - 构建一些结构，来处理相同的逻辑：树状的数据结构（parentId、Id），三级分区、水表的拓扑结构
    - 资源有没有释放或关闭
    - 将多次查询变成一次查询：数据库层面、微服务调用层面
    - 缓存：将常用的数据放到 Redis
    - 算法的复杂度

## 项目的架构

- 展示层：大屏、PC 端
- 网络传输：HTTP/HTTPS
- 第一层网关：Nginx
- 第二层网关：Spring Cloud Gateway = api.domain.com
- 业务服务：业务服务、
- 服务调用：服务之间的调用 OpenFeign、负载均衡 Spring Cloud LoadBlancer
- 基础服务：Nacos、RocketMQ
- 监控：Prometheus
- 存储层：MySQL、Redis、Minio
- DevOps：Jenkins --> GitLab -> Maven 私服仓库 -> 构建镜像 -> Harbor --> Docker Docker Compose

