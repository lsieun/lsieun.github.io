---
title: "Gateway日志"
sequence: "109"
---

## 方式一

```yaml
logging:
  level:
    org.springframework.cloud.gateway: TRACE
```

## 方式二

```yaml
logging:
  level:
    org.springframework.web.HttpLogging: TRACE
    reactor.netty.http.server: DEBUG
    reactor.netty.http.client: DEBUG
```

## 方式三

- [spring cloud gateway log levels](https://cloud.spring.io/spring-cloud-gateway/reference/html/#log-levels)

From spring cloud gateway 2.2, please try following switches:

```yaml
logging:
  level:
    reactor:
      netty: INFO
    org:
      springframework:
        cloud:
          gateway: TRACE
spring:
  cloud:
    gateway:
      httpclient:
        wiretap: true
      httpserver:
        wiretap: true
```

## 方式四

You can just add this log level.
The log messages will be more verbose than the filter, but at least you don't need to create a class

```yaml
logging:
  level:
    org.springframework.cloud.gateway.handler.RoutePredicateHandlerMapping: DEBUG
```

An advantage to the filter solution is you can also log when routes are not found by changing to `TRACE`:

```yaml
logging:
  level:
    org.springframework.cloud.gateway.handler.RoutePredicateHandlerMapping: TRACE
```

## Reference

- [Spring Cloud Gateway 收集输入输出日志](https://juejin.cn/post/7055125625085902878)
- [Spring Cloud Gateway 中实现请求、响应参数日志打印](https://blog.csdn.net/ShineupUP/article/details/118353737)
- [Processing the Response Body in Spring Cloud Gateway](https://www.baeldung.com/spring-cloud-gateway-response-body)
