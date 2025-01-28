---
title: "开机启动"
sequence: "102"
---

## 开机启动

开机启动：

```text
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

禁用开机启动：

```text
$ sudo systemctl disable docker.service
$ sudo systemctl disable containerd.service
```

查看服务状态：

```text
systemctl status docker
```

```text
sudo systemctl daemon-reload
```

## 启动-停止-重启

启动：

```text
sudo systemctl start docker
```

停止：

```text
sudo systemctl stop docker
```

重启：

```text
systemctl restart docker
```
