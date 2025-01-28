---
title: "Nginx Intro"
sequence: "101"
---

## 什么是 Nginx

Nginx（engine x）是一个高性能的 HTTP 和反向代理服务器，
特点是占用内存少，并发能力强。

事实上，Nginx 的并发能力确实在同类型的网页服务器中表现较好。

Nginx 专为性能优化而开发。性能是其最重要的考量，实现上非常非常注重效率，能经受高负载的考验。

有报告表明，Nginx 能支持高达 50000 个并发连接数。

## 常用版本分为四大阵营

常用版本分为四大阵营

- Nginx 开源版：[nginx.org](https://nginx.org/)
- Nginx plus 商业版：[nginx.com](https://www.nginx.com/)
- OpenResty：[英文](https://openresty.org/en/) [中文](https://openresty.org/cn/)

OpenResty is a dynamic web platform based on NGINX and LuaJIT.

- Tengine：[Tengine](https://tengine.taobao.org/)

Tengine is a web server originated by Taobao, the largest e-commerce website in Asia.
It is based on the Nginx HTTP server and has many advanced features.
Tengine has proven to be very stable and efficient on some of the top 100 websites in the world,
including `taobao.com` and `tmall.com`.

## 反向代理

### 正向代理

正向代理：如果把局域网外的 Internet 想像成一个巨大的资源库，则局域网中的客户端要访问 Internet，则需要通过代理服务器来访问，
这种代理服务器就称为“正向代理”。

### 反向代理

反向代理，其实客户端对代理是无感知的，因为客户端不需要任何配置就可以访问，
我们只需要将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，
再返回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，
暴露的是代理服务器地址，隐藏了真实的服务器 IP 地址。

## 负载均衡

单个服务器解决不了，我们增加服务器的数量，然后将请求分发到各个服务器上，
将原先请求集中到某个服务器上的情况改为将请求分发到多个服务器上，
将负载分发到不同的服务器，也就是我们所说的**负载均衡**。

## 动静分离

为了加快网站的解析速度，可以把动态网页和静态页面由不同的服务器来解析，
加快解析速度，降低单个服务器的压力。



## 高可用

## 总结

我觉得，“反向代理”是根本，而“负载均衡”和“动静分离”都只是“反向代理”的具体应用。

- 反向代理
  - 负载均衡
  - 动静分离

## Nginx 基本概念

- Nginx 是什么，做什么事情。
- 反向代理
- 负载均衡
- 动静分离

## Nginx 安装和常用命令、配置文件

- 在 Linux 系统中 Nginx 安装
- Nginx 常用命令
- Nginx 配置文件

## Nginx 配置实例

- 反向代理
- 负载均衡
- 动静分离
- 高可用集群

## Nginx 原理
