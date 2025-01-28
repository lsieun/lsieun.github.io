---
title: "APM"
image: /assets/images/apm/apm-illustration.png
permalink: /amp.html
---

**APM** stands for **Application Performance Monitoring**.

## 概念

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/concept/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## 如何使用 APM

APM 会对 Application 的 性能 造成一定的影响，我是这样想的：

- 在 Development 环境中，使用 APM 进行监控时，
    - 第一种情况，前期不使用，后期再使用：先解决 **业务** 问题，再解决 **性能** 问题。
    - 第二种情况，从前期到后期，一直使用：遇到任何**性能**问题，及时修改
- 在 Production 环境中，
    - 第一种情况，完全不使用 APM，从而避免带来的性能消耗
    - 第二种情况，只针对重要的业务进行 APM 监控

## 采集什么样的数据

- general purpose
- application-specific



## Reference

GitHub

- [apache/skywalking](https://github.com/apache/skywalking)
- [pinpoint-apm/pinpoint](https://github.com/pinpoint-apm/pinpoint)
    - [pinpoint-apm.gitbook.io](https://pinpoint-apm.gitbook.io)
- [Jaeger](https://www.jaegertracing.io/): open source, end-to-end distributed tracing
- [Uptrace](https://uptrace.dev/) Open Source Observability with Traces, Metrics, and Logs

OpenTelemetry

- [OpenTelemetry](https://opentelemetry.io)
- [OpenTracing](https://opentracing.io)
  - [中文版](https://github.com/opentracing-contrib/opentracing-specification-zh)
  - [英文版](https://opentracing.io/specification/)
  - [GitHub: The OpenTracing Specification repository](https://github.com/opentracing/specification)

Baeldung:

- [Observability in Distributed Systems](https://www.baeldung.com/distributed-systems-observability)
- [Introduction to Pinpoint](https://www.baeldung.com/ops/pinpoint-intro)
- [Observability with Spring Boot 3](https://www.baeldung.com/spring-boot-3-observability)
- [Service Mesh Architecture with Istio](https://www.baeldung.com/ops/istio-service-mesh)
- [Spring Cloud Sleuth in a Monolith Application](https://www.baeldung.com/spring-cloud-sleuth-single-application)

Zabbix

- [Zabbix 6.0 教程](https://www.bilibili.com/video/BV1H84y1b7gi)
