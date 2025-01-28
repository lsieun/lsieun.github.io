---
title: "Spring Cloud Component"
sequence: "112"
---

- Cloud
  - 服务注册中心
    - Eureka(x) 停止更新
    - Zookeeper
    - Consul
    - Nacos (推荐)
  - 服务调用
    - Ribbon
    - LoadBalancer
  - 服务调用2
    - Feign (x) 可以不关注了
    - OpenFeign
  - 服务降级
    - Hystrix (x) 不推荐使用
    - resilicence4j
    - Sentinel （推荐）
  - 服务网关
    - Zuul (x)
    - Gateway
  - 服务配置
    - Config (x)
    - Nacos
  - 服务总线
    - Bus (x)
    - Nacos

微服务模块：

- 建module
- 改POM
- 写YML
- 主启动类
- 业务类

TODO：

- maven scope import, optional: true
- spring-boot-maven-plugin是做什么用的呢？
- Spring Boot: 上传文件
- Spring Boot: DTO
- Spring Boot: Mockmvc
- HttpClient
- RestTemplate
- @Slf4j注解
- Run Dashboard
- map struct
