---
title: "Docker"
image: /assets/images/docker/docker-cover.png
permalink: /docker.html
---

Docker is a set of platform as a service products
that use OS-level virtualization to deliver software in packages called containers.

## Basic

{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/basic/'" |
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

---

<table>
    <thead>
    <tr>
        <th>Linux</th>
        <th>Windows</th>
        <th>Post Install</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/installation/linux/'" |
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
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/installation/windows/'" |
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
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/installation/post-install/'" |
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

## Command

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Container</th>
        <th>Image</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/command/basic/'" |
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
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/command/container/'" |
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
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/command/image/'" |
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

## Container

### Run + Sys + Host/Log

<table>
    <thead>
    <tr>
        <th>Basic</th>
        <th>Sys</th>
        <th>Extra</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/container/basic/'" |
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
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/container/sys/'" |
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
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/container/extra/'" |
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

### Volume And Network

<table>
    <thead>
    <tr>
        <th>Volume</th>
        <th>Network</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/container/volume/'" |
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
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/container/network/'" |
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

## Config

{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/config/'" |
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

## Docker File

{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/dockerfile/'" |
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

## Docker Compose

{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/docker-compose/'" |
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

## Host

Docker 是一个容器，它与宿主机之间一定存在某种关系。

{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/host/'" |
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

## Log

{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/log/'" |
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

## Software

{%
assign filtered_posts = site.docker |
where_exp: "item", "item.url contains '/docker/software/'" |
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

## Reference

- [Docker Hub](https://hub.docker.com/)
    - [alpine](https://hub.docker.com/_/alpine)
    - [busybox](https://hub.docker.com/_/busybox)
    - [elasticsearch](https://hub.docker.com/_/elasticsearch)
    - [jenkins/jenkins](https://hub.docker.com/r/jenkins/jenkins)
    - [kibana](https://hub.docker.com/_/kibana)
    - [mysql](https://hub.docker.com/_/mysql)
    - [nexus3](https://hub.docker.com/r/sonatype/nexus3)
    - [nginx](https://hub.docker.com/_/nginx/)
    - [postgres](https://hub.docker.com/_/postgres)
    - [redis](https://hub.docker.com/_/redis)
    - [skywalking-java-agent](https://hub.docker.com/r/apache/skywalking-java-agent)
    - [skywalking-oap-server](https://hub.docker.com/r/apache/skywalking-oap-server)
    - [skywalking-satellite](https://hub.docker.com/r/apache/skywalking-satellite)
    - [skywalking-swck](https://hub.docker.com/r/apache/skywalking-swck)
    - [skywalking-ui](https://hub.docker.com/r/apache/skywalking-ui)
    - [tomcat](https://hub.docker.com/_/tomcat)
- [Docker Reference Documentation](https://docs.docker.com/reference/)
    - API Reference
        - [Develop with Docker Engine API](https://docs.docker.com/engine/api/)
- [Docker, Inc.](https://www.docker.com/)
- [Mirantis Inc.](https://www.mirantis.com/)
- [The Magic Behind the Scenes of Docker Desktop](https://www.docker.com/blog/the-magic-behind-the-scenes-of-docker-desktop/)

- [Baeldung Tag: Docker](https://www.baeldung.com/linux/tag/docker)

Registry

- [Quay.io](https://quay.io/)

视频：

- [2023 最新版 Docker 视频教程](https://www.bilibili.com/video/BV1Ss4y1X7SD)

- [快速部署一套 Kubernetes/K8s 集群](https://www.bilibili.com/video/BV1A8411u7EU)
- [8.镜像拉取不下来的情况下安装 kubernetes](https://www.bilibili.com/video/BV1dP411q7FD)
- [CentOS 安装 kubernetes（k8s）1.26.2](https://www.bilibili.com/video/BV1zY41167aa)

好文章：

- [Kubernetes vs Docker: Understanding Containers in 2022](https://semaphoreci.com/blog/kubernetes-vs-docker) 讲的很好

- [Java 服务 Docker 容器化最佳实践](https://www.cnblogs.com/hahaha111122222/p/16535747.html)
