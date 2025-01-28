---
title: "Nginx"
sequence: "nginx"
---

## 反向代理

```text
server {
    listen 80;
    server_name localhost;
    
    location / {
        proxy_pass http://127.0.0.1:8081;
    }
}
```

## 负载均衡

### 如何配置

```text
upstream mysite {
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}

server {
    listen 80;
    server_name localhost;
    
    location / {
        proxy_pass http://mysite;
    }
}
```

### 负载均衡策略

Nginx 提供的负载均衡策略有 2 种：**内置策略**和**扩展策略**。

- **内置策略**为**轮询**，**加权轮询**，**IP hash**。
- 扩展策略，就天马行空，只有你想不到的没有他做不到的。

## Reference

- [反向代理和负载均衡有何区别？](https://www.zhihu.com/question/20553431/answer/2501688257)
