---
title: "Spring Boot"
sequence: "103"
---

- [ ] Spring Boot的启动过程做了哪些事情？https://www.bilibili.com/video/BV1EN411e77V?p=66
- [ ] Spring Boot自动配置的过程是如何实现的？ https://www.bilibili.com/video/BV1EN411e77V?p=65
- [ ] Spring Boot 如何启动 Tomcat？
- [ ] @SpringBootApplication 注解有什么作用？https://www.bilibili.com/video/BV1EN411e77V?p=63
- [ ] Spring Boot中的spring.factories文件有什么作用？https://www.bilibili.com/video/BV1EN411e77V?p=64
- [ ] Spring Boot中启动时，主要做了什么？
- [ ] Spring Boot是如何判断使用什么Web服务器的？
- [ ] Spring Boot 中为什么要用 ASM 技术来进行扫描？
- [ ] Spring Boot 是如何做到零配置的？
- [ ]

## 微服务需要多少内存空间

4GB 内存够用吗？

对于腾讯云跑微服务项目，4GB 的内存是否足够取决于上述因素。以下是具体的评估：

1. 服务数量：如果微服务项目中的服务数量较少，例如 5 个以下，4GB 的内存基本可以满足需求。但由于服务数量的增加，内存需求也会相应增加。
2. 服务复杂度：如果服务之间的交互和数据处理较为简单，4GB 的内存可以应对。但若服务复杂度高，涉及大量的数据处理和交换，4GB 的内存可能难以满足需求。
3. 数据量：如果微服务项目处理的数据量较小，例如每天不到 10GB 的数据量，4GB 的内存基本可以满足需求。但由于数据量的增加，内存需求也会相应增加。

综合以上因素，4GB 的内存对于一些简单的微服务项目来说是足够的。然而，对于复杂的微服务项目或者涉及大量服务数量和数据处理的情况，4GB 的内存可能不足以满足性能和稳定性的需求。

## Spring Boot Starter

```text

```

