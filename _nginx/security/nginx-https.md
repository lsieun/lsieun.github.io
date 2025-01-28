---
title: "Nginx HTTPS"
sequence: "101"
---

## 由 80 自动转向 443

第 1 种配置：

```text
server {
    listen 80;
    server_name www.lsieun.cn;
    
    location / {
        rewrite ^(.*) https://www.lsieun.cn$1;
    }
}
```

第 2 种配置：

```text
server {
    listen 80;
    server_name *.example.com;
    return 301 https://$host$request_uri;
}
```

## 301 和 302

301 和 302 是 HTTP 状态码中的两种重定向（Redirect）状态码，它们有以下区别：

301 Moved Permanently（永久重定向）：
当服务器返回 301 状态码时，表示被请求的资源已经被永久性地移动到了一个新的 URL。
搜索引擎在遇到 301 重定向时，会更新索引并将权重转移到新的 URL 上。
浏览器会缓存该重定向结果，下次请求时会直接跳转到新的 URL。
因此，301 重定向适用于已经永久更换了 URL 的情况。

302 Found（临时重定向）：当服务器返回 302 状态码时，表示被请求的资源暂时性地移动到了一个新的 URL。
搜索引擎在遇到 302 重定向时，会继续保留原始 URL 的索引。
浏览器会缓存该重定向结果，但下次请求时仍会访问原始 URL 。
因此，302 重定向适用于临时性的页面重定向，例如网站正在进行维护或临时重定向到另一个页面。

总结来说，301 重定向是永久性的，浏览器会记住并直接跳转到新的 URL；
而 302 重定向是临时性的，浏览器会记住但仍会请求原始 URL。
在实际应用中，要根据具体情况选择适合的重定向状态码。

请注意，在使用重定向时，应确保遵守 HTTP 规范，并正确地选择适当的状态码。

## Reference

- [A Step-by-Step Guide to Using a Specific TLS Version in Nginx](https://tecadmin.net/a-step-by-step-guide-to-using-a-specific-tls-version-in-nginx/)
