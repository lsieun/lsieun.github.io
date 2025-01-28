---
title: "Docker Time"
sequence: "102"
---

## Docker

```text
-v /etc/timezone:/etc/timezone:ro -v /etc/localtime:/etc/localtime:ro
```

```text
docker run --name test --rm -ti -v /etc/timezone:/etc/timezone:ro -v /etc/localtime:/etc/localtime:ro alpine /bin/sh
/ # date
Fri Nov 29 16:13:55 CST 2019
```

## Docker Compose

```text
方式一：
environment:
  - SET_CONTAINER_TIMEZONE=true
  - CONTAINER_TIMEZONE=Asia/Shanghai

方式二：
environment:
  - TZ=Asia/Shanghai
```
