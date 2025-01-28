---
title: "MySQL 5.7"
sequence: "102"
---

## MySQL 5.7

```text
docker pull mysql:5.7
```

```text
docker run --name mysql-instance -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
docker ps
docker exec -it mysql-instance /bin/bash
mysql -uroot -p
```

- `-e`表示 Environment

