---
title: "Docker Compose + Nginx"
sequence: "102"
---

## docker compose

```text
/usr/share/nginx/html/index.html
```

```text
version: "3"
services:
  nginx:
    image: nginx:latest
    container_name: mynginx
    restart: always
    privileged: true
    ports:
      - 80:80
    volumes:
      - ./html:/usr/share/nginx/html
      - ./conf.d:/etc/nginx/conf.d
```

```text
docker compose up -d
```

```yaml
services:
  nginx:
    image: nginx:1.20
    container_name: nginx-1.20
    restart: always
    privileged: true
    environment:
      - TZ=Asia/Shanghai
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./conf.d:/etc/nginx/conf.d  ##这里面放置自定义conf文件
      - ./ssl:/etc/nginx/ssl  ###这里面可以放置ssl证书
      - ./log:/var/log/nginx  ###这里面放置日志
      - ./html:/usr/local/nginx/html  ###这里面放置静态文件
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/hosts:/etc/hosts:ro
      - /etc/localtime:/etc/localtime:ro
    networks:
      jinma:
        ipv4_address: 172.20.0.4
networks:
  jinma:
    external: true
```


```text
version: "3"

services:
  nginx:
    image: nginx
    container_name: nginx
    restart: always
    privileged: true
    environment:
      - TZ=Asia/Shanghai 
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./html:/usr/share/nginx/html
      - ./log:/var/log/nginx
      - ./conf.d:/etc/nginx/conf.d  ##这里面放置自定义conf文件
      - ./cert:/etc/nginx/cert  ###这里面可以放置ssl证书
      - ./nginx.conf:/etc/nginx/nginx.conf
```

```text
version: "3"

services:
  nginx:
    image: nginx
    container_name: nginx
    restart: always
    privileged: true
    environment:
      - TZ=Asia/Shanghai 
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./html:/usr/share/nginx/html
      - ./log:/var/log/nginx
      - ./etc:/etc/nginx
```

https://cli.vuejs.org/guide/deployment.html#docker-nginx
