---
title: "Httpbin"
sequence: "httpbin"
---

Run locally

```text
docker run -p 80:80 kennethreitz/httpbin
```

第一步，将 `kennethreitz/httpbin` 保存 Nexus 的 Docker 私服：

```text
docker pull kennethreitz/httpbin
docker login -u admin -p 123456 docker.lan.net:8083
docker tag kennethreitz/httpbin:latest docker.lan.net:8083/kennethreitz/httpbin:latest
docker push docker.lan.net:8083/kennethreitz/httpbin:latest
```

第二步，从 Nexus 的 Docker 私服下载 `kennethreitz/httpbin`：

```text
docker pull docker.lan.net:8083/kennethreitz/httpbin:latest
docker tag docker.lan.net:8083/kennethreitz/httpbin:latest kennethreitz/httpbin:latest
docker run -p 80:80 kennethreitz/httpbin
```
