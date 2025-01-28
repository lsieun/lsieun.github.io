---
title: "内建变量（Builtin Variables）"
sequence: "104"
---

在 Nginx 的配置中，以 `$` 开头的变量对应的概念是 "内建变量"（built-in variables）。
这些内建变量提供了访问请求、响应和服务器信息的便捷方式，可以在 Nginx 配置中使用。

内建变量是 Nginx 提供的预定义变量，它们在 Nginx 内部被计算和填充，并且可以在配置文件中直接使用。
这些内建变量提供了对请求的各个方面的访问，如请求 URI、查询参数、主机名、请求头等。

通过使用这些内建变量，你可以根据请求的属性来进行条件判断、重定向、代理等操作，从而灵活地处理请求。

需要注意的是，虽然这些内建变量以 `$` 开头，但它们不同于 Shell 或其他编程语言中的变量，
它们更像是 Nginx 配置文件中的特殊关键字。

一些常用的 `$` 开始的变量：

- `$args`: 请求中的查询参数部分（例如 `param1=value1&param2=value2`）。
- `$uri`: 不包括查询参数的请求 URI 部分（例如 `/path`）。
- `$request_uri`: 包括完整的请求 URI，包括查询参数（例如 `/path?param1=value1&param2=value2`）。
- `$host`: 请求的主机名部分（例如 `example.com`）。
- `$http_user_agent`: 发起请求的用户代理标头
  （例如 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36）。
- `$server_name`: 配置中定义的服务器名称。
- `$remote_addr`: 客户端的 IP 地址。

这只是一小部分可用的变量示例。 Nginx 还提供了许多其他变量，可用于访问请求和服务器的不同属性。


