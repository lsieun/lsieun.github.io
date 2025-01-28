---
title: "HTTP2 Intro"
sequence: "101"
---

[UP](/netty.html)

- 1989, Http 1.0
- 1997, Http 1.1
- 2011, WebSocket
- 2015, Http 2.0
- 2022, Http 3.0

HTTP/2 is still the latest version of the protocol that is widely accepted and implemented.
It differs significantly from the previous versions with its **multiplexing** and **server push features**, among other things.

Communication in HTTP/2 happens via a group of bytes called **frames**, and **multiple frames** form a **stream**.

HTTP/2 相比于 HTTP/1.1 有以下主要区别：

1. 多路复用（Multiplexing）：HTTP/2 允许在单个 TCP 连接上同时发送多个请求和响应，而 HTTP/1.1 每个请求都需要建立一个独立的连接。多路复用提高了网络利用率，减少了连接建立和关闭的开销。

2. 头部压缩（Header Compression）：HTTP/2 使用 HPACK 算法对 HTTP 头部进行压缩，减少了数据传输的大小，提高了传输效率。

3. 二进制传输（Binary Protocol）：HTTP/2 使用二进制协议来解析和传输数据，而 HTTP/1.1 使用文本协议。二进制传输更高效，降低了解析数据的复杂度。

4. 服务器推送（Server Push）：HTTP/2 允许服务器在客户端请求之前主动推送资源，提高了页面加载速度和性能。

5. 流量控制（Flow Control）：HTTP/2 支持流量控制机制，可以更好地控制数据流的速率，避免了队头阻塞问题。

6. 请求优先级（Request Prioritization）：HTTP/2 允许客户端指定请求的优先级，服务器可以根据优先级来处理请求，提高了页面加载的顺序和效率。

综上所述，HTTP/2 相比于 HTTP/1.1 具有更高的性能和效率，可以提供更快的网页加载速度和更好的用户体验。



## Reference

- [RFC7540: Hypertext Transfer Protocol Version 2 (HTTP/2)](https://httpwg.org/specs/rfc7540.html)
- [HTTP/2: the difference between HTTP/1.1, benefits and how to use it](https://factoryhr.medium.com/http-2-the-difference-between-http-1-1-benefits-and-how-to-use-it-38094fa0e95b)

