---
title: "Nginx Config"
sequence: "104"
---

检查配置文件是否正确：

```text
nginx -t
```

## Nginx 配置文件的位置

在 Docker 环境下，配置文件位置：

```text
/etc/nginx/nginx.conf
```

## 配置文件组成

```text
$ cat /etc/nginx/nginx.conf 

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

`nginx.conf` 文件由三部分组成：

- 全局块
- events 块
- http 块

### 全局块

从配置文件开始到 `events` 块之间的内容，主要会设置一些影响 nginx 服务器整体运行的配置指令，
主要包括 **配置运行 Nginx 服务器的用户（组）**、**允许生成的 worker process 数**、**进程 PID 存放路径**、
日志存放路径和类型以及配置的引入等。

```text
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;
```

比如，上面第一行配置的：

```text
worker_processes  auto;
```

这是 Nginx 服务器并发的关键配置，`worker_processes` 值越大，可以支持的并发处理量也越多，
但是会受到硬件、软件等设备的制约。

### 第二部分：events 块

events 块涉及的指令主要影响 Nginx 服务器与用户的网络连接。

比如上面的配置：

```text
events {
    worker_connections  1024;
}
```

events 块涉及的指令主要影响 Nginx 服务器与用户的网络连接。
常用的配置包括是否开启对多 work process 下的网络连接进行序列化、是否允许同时接收多个网络连接、
选取哪种事件驱动模型来处理连接请求、每个 work process 可以同时支持的最大连接数等。

上述的例子就表示每个 work process 支持的最大连接数为 1024。

这部分的配置对 Nginx 的性能影响较大，在实际中应该灵活配置。


### 第三部分：http 块

这算是 Nginx 服务器配置中最频繁的部分：代理、缓存和日志定义等绝大多数功能和第三方模块的配置都在这里。

需要注意的是：**http 块**又可以包括**http 全局块**、**server 块**。

```text
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

#### http 全局块

http 全局块配置的指令包括文件引入、MIME-TYPE 定义、日志自定义、连接超时时间、单连接请求数上限等。

#### server 块

```text
$ cd /etc/nginx/conf.d/
$ cat default.conf 
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，
该技术的产生是为了节省互联网服务器硬件成本。

每个 http 块可以包括多个 server 块，每个 server 块就相当于一个虚拟主机。

每个 server 块也分为全局 server 块，以及可以同时包含多个 location 块。

**全局 server 块**

最常见的配置是本虚拟主机的监听配置和本虚拟主机的名称或 IP 配置。

**location 块**

一个 server 块可以配置多个 location 块。

这块的主要作用是基于 Nginx 服务器接收的请求字符串（例如，server_name/uri-string），
对虚拟主机名称（也可以是 IP 别名）之外的字符串（例如，前面的/uri-string）进行匹配，
对特定的请求进行处理、地址定向、数据缓存和应答控制等功能，
还有许多第三方模块的配置也在这里进行。


