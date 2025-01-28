---
title: "Installation (CentOS 7)"
sequence: "102-centos7"
---

第一步，下载文件：

```text
sudo curl -L "https://github.com/docker/compose/releases/download/$(curl https://github.com/docker/compose/releases | grep -m1 '<a href="/docker/compose/releases/download/' | grep -o 'v[0-9:].[0-9].[0-9]')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

第二步，添加执行权限：

```text
sudo chmod +x /usr/local/bin/docker-compose
```

执行命令之前的权限：

```text
$ ls -l /usr/local/bin/docker-compose
-rw-r--r-- 1 root root 9 Jun 15 05:28 /usr/local/bin/docker-compose
```

执行命令之后的权限：

```text
$ ls -l /usr/local/bin/docker-compose
-rwxr-xr-x 1 root root 9 Jun 15 05:28 /usr/local/bin/docker-compose
```

第三步，验证 docker compose 的版本：

```text
$ docker compose version
Docker Compose version v2.18.1
```
