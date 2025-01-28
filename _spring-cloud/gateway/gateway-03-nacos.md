---
title: "Gateway + Nacos"
sequence: "103"
---

## pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>

    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>
</dependencies>
```

## application.yml

```text
server:
  port: 80

spring:
  application:
    name: api-gateway-nacos
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
        username: nacos
        password: nacos
    gateway:
      enabled: true
      routes:
        - id: service-consumer-route
          uri: lb://service-provider # lb指的是从nacos中按照名称获取微服务，并遵循负载均衡策略
          predicates:
            - Path=/consumer/**
          filters:
            - StripPrefix=1
```

## Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayNacosApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayNacosApplication.class, args);
    }
}
```
