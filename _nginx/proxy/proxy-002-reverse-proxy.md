---
title: "Nginx：反向代理"
sequence: "102"
---

Nginx 反向代理模块的指令是由 `ngx_http_proxy_module` 模块进行解析，该模块在安装 Nginx 的时候已经自己加载到 Nginx 中了。

反向代理中的常用指令：

```text
proxy_pass
proxy_set_header
proxy_redirect
```

## proxy_pass

`proxy_pass` 指令用来设置被代理服务器地址，可以是主机名称、IP 地址加端口形式。

```text
proxy_pass http://www.baidu.com;
proxy_pass http://192.168.80.130/;
```

在编写 `proxy_pass` 的时候，后面的值要不要加 `/` 呢？

示例一：

```text
server {
    listen 80;
    server_name localhost;
    location / {
        # proxy_pass http://192.168.80.130;
        proxy_pass http://192.168.80.130/;
    }
}
```

当客户端访问 `http://localhost/index.html` 效果是一样的。

示例二：

```text
server {
    listen 80;
    server_name localhost;
    location /server {
        # proxy_pass http://192.168.80.130;
        proxy_pass http://192.168.80.130/;
    }
}
```

当客户端访问 `http://localhost/server/index.html` 时，

- 如果使用第一个 `proxy_pass`，即不使用 `/`，则会访问 `http://192.168.80.130/server/index.html`
- 如果使用第二个 `proxy_pass`，即使用 `/`，则会访问 `http://192.168.80.130/index.html`

### proxy_set_header

`proxy_set_header` 指令可以更改 Nginx 服务接收到客户端请求的请求头信息，然后将新的请求头发送给代理的服务器

需要注意的是，如果想要看到结果，必须在被代理的服务器上来获取添加的头信息。

代理服务器（`192.168.80.130`）：

```text
server {
    listen 8080;
    server_name localhost;
    
    location /server {
        proxy_pass http://192.168.80.230:8080/;
        proxy_set_header username TOM;
    }
}
```

被代理服务器（`192.168.80.230`）：

```text
server {
    listen 8080;
    server_name localhost;
    default_type text/plain;
    return 200 $http_username;
}
```

### proxy_redirect

`proxy_redirect` 指令是用来重置头信息中的 `Location` 和 `Refresh` 的值。

为什么要用该指令呢？

代理服务端（`192.168.80.130`）：

```text
server {
    listen 8081;
    server_name localhost;
    location / {
        proxy_pass http://192.168.80.230:8081/;
        proxy_redirect http://192.168.80.230 http://192.168.80.130;
    }
}
```

服务端（`192.168.80.230`）：

```text
server {
    listen 8081;
    server_name localhost;
    location / {
        root html;
        index index.html;
        if (!-f $request_filename) {
            return 302 http://192.168.80.230/;
        }
    }
}
```

```text
server {
    listen       443 ssl;
    server_name  *.lsieun.cn;

    ssl_certificate      lsieun.cn.cer;
    ssl_certificate_key  lsieun.cn.key;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location / {
        if ( $host = blog.lsieun.cn ) {
            proxy_pass http://127.0.0.1:4321;
            break;
        }

        if ( $host = maven.lsieun.cn ) {
            proxy_pass http://127.0.0.1:8081;
            break;
        }

        if ( $host = nacos.lsieun.cn ) {
            proxy_pass http://127.0.0.1:8848;
            break;
        }

        if ( $host = docker.lsieun.cn ) {
            proxy_pass http://192.168.1.181:8082;
            break;
        }

        if ( $host = registry.lsieun.cn ) {
            proxy_pass http://192.168.1.181:8083;
            break;
        }

        root   html;
        index  index.html index.htm;
    }
}
```

## Reference

- [Module ngx_http_proxy_module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [How to Set up & Use NGINX as a Reverse Proxy](https://phoenixnap.com/kb/nginx-reverse-proxy)


