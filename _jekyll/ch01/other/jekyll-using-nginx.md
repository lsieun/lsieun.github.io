---
title: "Using Nginx"
sequence: "103"
---

[UP](/jekyll/jekyll-index.html)

## 配置 Nginx

- `NGINX_HOME/conf/nginx.conf`

- http
    - server
        - location

```text
http {
    server {
        listen       80;
        server_name  localhost;

        location / {
            root   D:\git-repo\lsieun.github.io\_site;
            index  index.html index.htm;
        }
    }
}
```
