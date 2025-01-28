---
title: "Apache SkyWalking"
image: /assets/images/java/skywalking/skywalking-cover.png
permalink: /skywalking.html
---

SkyWalking is an open source observability platform used to
collect, analyze, aggregate and visualize data from services and cloud native infrastructures.

## Use

### Server

#### Basic

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/basic/'" |
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

<table>
    <thead>
    <tr>
        <th>Storage</th>
        <th>Trace</th>
        <th>Log</th>
        <th>Metrics</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/storage/'" |
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
        </td>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/trace/'" |
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
        </td>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/log/'" |
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
        </td>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/metric/'" |
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
        </td>
    </tr>
    </tbody>
</table>


#### Docker

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/docker/'" |
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

#### Cluster

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/cluster/'" |
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

### Client Use Case

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/agent/'" |
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

## Dev

### 自定义插件

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/dev/'" |
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

## FAQ

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/faq/'" |
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

## 源码理解

### SkyWalking-Java-Agent

<table>
    <thead>
    <tr>
        <th>环境搭建</th>        
        <th>Agent 启动过程</th>
        <th>BootService 管理</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/source/env/'" |
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
        </td>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/source/agent/'" |
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
        </td>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/source/service/'" |
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
        </td>
    </tr>
    </tbody>
</table>

---

<table>
    <thead>
    <tr>
        <th>Trace</th>
        <th>DataCarrier</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/source/trace/'" |
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
        </td>
        <td>
{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/skywalking/source/datacarrier/'" |
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
        </td>
    </tr>
    </tbody>
</table>

### OAP



## Task

- 微服务环境搭建
- 链路追踪
    - 自定义链路追踪
    - 微服务
    - Redis
    - MySQL
    - Vue
    - MQ: RocketMQ
    - Nginx
    - Node.Js
- Storage
    - MySQL 持久化
- 性能分析
- 集群
    - 搭建 OAP 集群环境
- 日志采集
    - Logback
    - gRPC

主要任务：

- 链路追踪
    - Spring Cloud,
    - Spring Cloud Gateway
    - MySQL/Redis 追踪
    - Nginx
    - HttpClient
    - RestTemplate
    - 主要解决问题：性能问题（哪个接口慢）
    - NodeJS
    - 告警
        - 告警规则
        - 告警通知：微信
- 持久化
    - MySQL
    - ElasticSearch
- 集群环境搭建
    - Docker 环境下的使用
    - Docker 中的日志，是否生成 JSON 格式
    - [OAP 集群](https://www.bilibili.com/video/BV1Mh411u7Ve?p=16)
- 场景内容
    - [ ] 完整的调用链路
    - [ ] 超时
    - [ ] 调用出错
    - [ ] 自定义追踪
    - [ ] 对 MySQL、Redis 配置 SkyWalking Agent
- ByteBuddy
- SkyWalking 的源码
- Logback

TODO

- [ ] 操作系统的监控
    - [ ] Linux 操作系统的监控
    - [ ] Windows 操作系统的监控
- [ ] IntelliJ IDEA 中，如果有多个 services，例如 Spring Cloud 中，如何设置一个启动顺序；Docker 中应该有依赖关系，可以设置
- [ ] SkyWalking 中存储的数据，默认情况下，保留多长时间呢？因为数据一会儿，就消失了。

## Reference

- [Apache SkyWalking](https://skywalking.apache.org/)
    - [Doc 9.5.0](https://skywalking.apache.org/docs/main/v9.5.0/readme/)
    - [Doc 9.4.0](https://skywalking.apache.org/docs/main/v9.4.0/readme/)
    - [Docker Images for convenience](https://skywalking.apache.org/downloads/#DockerImages)
        - [SkyWalking OAP Server](https://hub.docker.com/r/apache/skywalking-oap-server)
        - [SkyWalking UI Image](https://hub.docker.com/r/apache/skywalking-ui)
        - [SkyWalking Java Agent](https://hub.docker.com/r/apache/skywalking-java-agent)
        - [SkyWalking Cloud on Kubernetes](https://hub.docker.com/r/apache/skywalking-swck)
        - [SkyWalking Satellite](https://hub.docker.com/r/apache/skywalking-satellite)
        - [SkyWalking CLI](https://hub.docker.com/r/apache/skywalking-cli)

GitHub

- [How to build a project](https://github.com/apache/skywalking/blob/master/docs/en/guides/How-to-build.md)


视频：

- [如何用 Grafana 构建 Apache SkyWalking UI](https://www.bilibili.com/video/BV14x4y1o7tn)
- [深入理解 SkyWalking 架构设计与实现原理](https://www.bilibili.com/video/BV1Mh411u7Ve?p=19)
- [APM 管理工具 - Skywalking](https://www.bilibili.com/video/BV1Tq4y127Yi/)，它有 Docker 和 Kubernetes 的内容
- [Skywalking 解决分布式链路追踪](https://www.bilibili.com/video/BV1ft4y1u7jh/)
    - [使用 MySQL 持久化](https://www.bilibili.com/video/BV1ft4y1u7jh?p=6)

- [20 分钟上手新版 Skywalking 9.x APM 监控系统](https://www.bilibili.com/video/BV1Zs4y1w7w1/)
- [APM 应用性能管理工具 -2022 版](https://www.bilibili.com/video/BV1Qt4y1E7Mu/)

- [分布式链路追踪实战](https://www.bilibili.com/video/BV15A411274x/)
- [深入学习 Skywalking 全套教程 -2019- 黑马](https://www.bilibili.com/video/BV1ZJ411s7Mn/)
- [Spring Cloud 微服务 教程（Nacos、sentinel、Seata、Gateway、Skywalking）](https://www.bilibili.com/video/BV1Lo4y1V7gB)
- [分布式链路追踪 sleuth + zipkin + ELK 到底是什么？](https://www.bilibili.com/video/BV1Et4y1G7hQ)


- APISIX
    - [使用 SkyWalking 和 APISIX 来增强 Nginx 的可观测性](https://www.bilibili.com/video/BV1Kq4y1U7uv/) 看了一遍，不是很理解
- [包罗万象 SkyWalking，涵盖了三个可观察性领域](https://www.bilibili.com/video/BV1q541197v4/)
- [Apache SkyWalking Landscape，吴晟](https://www.bilibili.com/video/BV1HV411W7sr/)
- Front End
    - [Apache SkyWalking 如何做前端监控 ，范秋霞](https://www.bilibili.com/video/BV1FL411W7XE/)
- [基于 Kubernetes 和 SkyWalking 的 Spring 微服务监控实践](https://www.bilibili.com/video/BV1xP411c719/)


- [可观测性技术生态和 OpenTelemetry 原理及实践，陈一枭](https://www.bilibili.com/video/BV18K4y1M7bL/)
- [理论知识，什么是 OpenTracing](https://www.bilibili.com/video/BV1cd4y1c7UP/)
- [【SkyWalking 9.0 深入学习】APM 应用性能管理工具 -2022 版](https://www.bilibili.com/video/BV1Qt4y1E7Mu/)
- [分布式链路追踪 Skywalking](https://www.bilibili.com/video/BV1HA411T7vp/)

文章：

- [Java 服务从零接入全链路追踪解决方案](https://blog.csdn.net/m0_71777195/article/details/129176132)
- [一次「找回」TraceId的问题分析与过程思考](https://tech.meituan.com/2023/04/20/traceid-google-dapper-mtrace.html)
- [可视化全链路日志追踪](https://tech.meituan.com/2022/07/21/visualized-log-tracing.html)

APM

- [Dapper，大规模分布式系统的跟踪系统](https://bigbully.github.io/Dapper-translation/)
- [Dapper: a Large-Scale Distributed Systems Tracing Infrastructure](https://s3.amazonaws.com/systemsandpapers/papers/dapper.pdf)
- [Annotated copy](https://www.anantjain.dev/3401861af0d90b7e4ec42aa6918cf402/dapper-annotated.pdf)
- [Dapper: a Large-Scale Distributed Systems Tracing Infrastructure](https://www.anantjain.dev/dapper/)
- [Dapper, a Large-Scale Distributed Systems Tracing Infrastructure](http://alex-ii.github.io/papers/2018/11/25/dapper_distributed_tracing.html)


- [ChaosBlade x SkyWalking: High Availability Microservices Practices](https://www.alibabacloud.com/blog/597653)
- [Chaosblade](https://github.com/chaosblade-io/chaosblade)

- [Baeldung Tag: Lightrun](https://www.baeldung.com/tag/lightrun)
    - [Introduction to Lightrun with Java](https://www.baeldung.com/java-lightrun)

- [Observability in Distributed Systems](https://www.baeldung.com/distributed-systems-observability)
- [Service Mesh Architecture with Istio](https://www.baeldung.com/ops/istio-service-mesh)

稀土掘金

- [docker 安装 skywalking](https://juejin.cn/post/7136146238419779620)
- [Docker 安装 SkyWalking 并监控 Java 程序](https://juejin.cn/post/7117933364614529060)
- [使用 docker 部署 spring boot 并接入 skywalking](https://juejin.cn/post/6951371499479498766)
- [SkyWalking 之高级玩法](https://juejin.cn/post/6844903763728138248)
- [Docker 容器化部署灵活开关 Skywalking 监控](https://juejin.cn/post/7241778027875598397)
- [聊聊 SkyWalkingAgent](https://juejin.cn/post/6844904070273040392)
- [skywalking（二）告警配置](https://juejin.cn/post/6844903954770313224)
- [Skywalking-03：Skywalking 本地调试](https://juejin.cn/post/6989976086717136904)
- [全网最详细的 Skywalking 分布式链路追踪](https://juejin.cn/post/7072709231949905957)


- [SkyWalking 8.7.0 源码分析](https://www.bilibili.com/video/BV1dy4y1V7ck/)
- [SkyWalking8.7源码解析（一）：Agent启动流程、Agent配置加载流程、自定义类加载器AgentClassLoader、插件定义体系、插件加载](https://blog.csdn.net/qq_40378034/article/details/121882943)
- [SkyWalking8.7源码解析（二）：定制Agent、服务加载、witness组件版本识别、Transform工作流程](https://blog.csdn.net/qq_40378034/article/details/122145509)
- [SkyWalking8.7源码解析（三）：静态方法插桩、构造器和实例方法插桩、插件拦截器加载流程、JDK类库插件工作原理](https://blog.csdn.net/qq_40378034/article/details/122278500)
- [31 讲带你搞懂 SkyWalking](https://www.bilibili.com/video/BV1mY4y1y7a1/)

TODO:

- [SkyWalking二次开发](https://www.bilibili.com/video/BV1sv411e7Mr/)
