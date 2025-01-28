---
title: "Bitnami"
sequence: "104"
---

```yaml
services:
  mysql:
    container_name: mysql8
    image: 'bitnami/mysql:latest'
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
      - TZ=Asia/Shanghai
    ports:
      - 3306:3306
```

```text
$ docker exec -it mysql8 /bin/bash

$ mysql -u root -p
Enter password:（不需要输入密码，直接回车）
```
