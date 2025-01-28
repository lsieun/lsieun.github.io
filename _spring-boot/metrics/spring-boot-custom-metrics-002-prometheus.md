---
title: "Actuator + Prometheus"
sequence: "102"
---

## pom.xml

```xml
<!-- actuator -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <version>${micrometer.version}</version>
</dependency>
```

## application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: demo-monitor

management:
  endpoints:
    web:
      exposure:
        include: 'prometheus'
```

```yaml
management:
  endpoints:
    web:
      exposure:
        include: '*'
```

```text
management.endpoints.web.exposure.include=prometheus
```

```text
management.endpoints.web.exposure.include=*
```

## Prometheus 配置

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: spring-boot
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: [ '192.168.80.1:8080' ]
```

```yaml

```

## Reference

- [spring.io: Prometheus](https://docs.spring.io/spring-boot/docs/current/actuator-api/htmlsingle/#prometheus)
- [Micrometer Prometheus](https://micrometer.io/docs/registry/prometheus)
