---
title: "Nacos 注册 IP"
sequence: "105"
---

如果选择固定 IP 注册可以配置

```text
spring.cloud.nacos.discovery.ip = 192.168.0.118
spring.cloud.nacos.discovery.port = 9000
```

如果选择固定网卡配置项

```text
spring.cloud.nacos.discovery.networkInterface = eth0
```

如果想更丰富的选择，可以使用 Spring Cloud 的工具 `InetUtils` 进行配置

具体说明可以自行检索: https://github.com/spring-cloud/spring-cloud-commons/blob/master/docs/src/main/asciidoc/spring-cloud-commons.adoc

```text
spring.cloud.inetutils.default-hostname
spring.cloud.inetutils.default-ip-address
spring.cloud.inetutils.ignored-interfaces[0]=eth0 # 忽略网卡，eth0
spring.cloud.inetutils.ignored-interfaces=eth.* # 忽略网卡，eth.*，正则表达式
spring.cloud.inetutils.preferred-networks=10.34.12 # 选择符合前缀的 IP 作为服务注册 IP
spring.cloud.inetutils.timeout-seconds
spring.cloud.inetutils.use-only-site-local-interfaces
```

更多配置

```text
spring.cloud.nacos.discovery.server-addr #Nacos Server 启动监听的 ip 地址和端口
spring.cloud.nacos.discovery.service # 给当前的服务命名
spring.cloud.nacos.discovery.weight # 取值范围 1 到 100，数值越大，权重越大
spring.cloud.nacos.discovery.network-interface # 当 IP 未配置时，注册的 IP 为此网卡所对应的 IP 地址，如果此项也未配置，则默认取第一块网卡的地址
spring.cloud.nacos.discovery.ip # 优先级最高
spring.cloud.nacos.discovery.port # 默认情况下不用配置，会自动探测
spring.cloud.nacos.discovery.namespace # 常用场景之一是不同环境的注册的区分隔离，例如开发测试环境和生产环境的资源（如配置、服务）隔离等。

spring.cloud.nacos.discovery.access-key # 当要上阿里云时，阿里云上面的一个云账号名
spring.cloud.nacos.discovery.secret-key # 当要上阿里云时，阿里云上面的一个云账号密码
spring.cloud.nacos.discovery.metadata # 使用 Map 格式配置，用户可以根据自己的需要自定义一些和服务相关的元数据信息
spring.cloud.nacos.discovery.log-name # 日志文件名
spring.cloud.nacos.discovery.enpoint # 地域的某个服务的入口域名，通过此域名可以动态地拿到服务端地址
ribbon.nacos.enabled # 是否集成 Ribbon 默认为 true
```

## 屏蔽虚拟机网卡

```text
spring.cloud.inetutils.ignored-interfaces
```

```text
spring:
  application:
    name: jm-mock-data-service
  cloud:
    inetutils:
      preferred-networks: 192.168.30
      ignored-interfaces: 'VMware Virtual Ethernet Adapter for VMnet1,VMware Virtual Ethernet Adapter for VMnet8'
    nacos:
      discovery:
        server-addr: 192.168.1.22:8848
        namespace: dev
```

```text
spring:
  application:
    name: jm-mock-data-service
  cloud:
    inetutils:
#      preferred-networks: 192.168.30
      ignored-interfaces:
        - VMware Virtual Ethernet Adapter for VMnet1
        - VMware Virtual Ethernet Adapter for VMnet8
    nacos:
      discovery:
        server-addr: 192.168.1.22:8848
        namespace: dev
```
