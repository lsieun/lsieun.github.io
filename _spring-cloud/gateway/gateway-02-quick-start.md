---
title: "Gateway: Quick Start"
sequence: "102"
---

## pom.xml

```xml

<dependencies>
    <!-- boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter</artifactId>
    </dependency>

    <!-- gateway -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
</dependencies>
```

## application.yml

```text
server:
  port: 80

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes: # 路由数组
        - id: server-consumer-route # 当前路由的标识，要求唯一
          uri: http://localhost:1903 # 请求要转发到的地址
          order: 1 # 路由的优先级，数字越小，级别越高
          predicates: # 断言（路由转发要满足的条件）
            - Path=/consumer/**
          filters: # 过滤器，请求在传递过程中，可以通过过滤器对其进行一定修改
            - StripPrefix=1 # 转发之前去掉1层路径
        - id: server-provider-route
          uri: http://localhost:1916
          order: 2
          predicates:
            - Path=/provider/**
          filters:
            - StripPrefix=1
```

```text
server:
  port: 80

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: server-consumer-route
          uri: http://localhost:1903
          order: 1
          predicates:
            - Path=/consumer/**
          filters:
            - StripPrefix=1
        - id: server-provider-route
          uri: http://localhost:1916
          order: 2
          predicates:
            - Path=/provider/**
          filters:
            - StripPrefix=1
```

## Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

## 访问

通过上面的配置，可以如下地址：

```text
http://localhost/consumer/echo/hello
```

转换成：

```text
http://localhost:8080/echo/hello
```

访问地址：

```text
http://127.0.0.1/consumer/hello/echo/good
```

输出结果：

```text
Hello +++ World --- good --- World +++ Hello
```

访问地址：

```text
http://127.0.0.1/provider/world/echo/good
```

输出结果：

```text
World --- good --- World
```

