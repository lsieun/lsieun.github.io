---
title: "Win 10: Nginx"
sequence: "101"
---

## 下载

```text
https://nginx.org/en/download.html
```

```text
https://nginx.org/download/nginx-1.26.1.zip
```

## 使用

### 启动 Nginx

启动 nginx：

```text
> cd c:\
> unzip nginx-1.26.1.zip
> cd nginx-1.26.1
> start nginx
```

### 查看 Nginx 进程

通过 `tasklist` 查看 nginx 进程：

```text
> tasklist /fi "imagename eq nginx.exe"
Image Name           PID Session Name     Session#    Mem Usage
=============== ======== ============== ========== ============
nginx.exe            652 Console                 0      2 780 K
nginx.exe           1332 Console                 0      3 112 K
```

One of the processes is the **master process** and another is the **worker process**.
If nginx does not start, look for the reason in the error log file `logs\error.log`.

### 关闭 Nginx

```text
taskkill /fi "imagename eq nginx.EXE" /f
```

如果修改了 `nginx.conf` 的内容，并且 `nginx -s reload` 之后，不能生效，就可以使用这个命令将所有 nginx 进程关闭。

### 其它

nginx/Windows runs as a standard console application (not a service),
and it can be managed using the following commands:

- `nginx -s stop`: fast shutdown
- `nginx -s quit`: graceful shutdown
- `nginx -s reload`: changing configuration, starting new worker processes with a new configuration,
  graceful shutdown of old worker processes
- `nginx -s reopen`: re-opening log files

### 配置

nginx/Windows uses **the directory where it has been run** as the prefix for **relative paths** in the configuration.
In the example above, the prefix is `C:\nginx-1.26.1\`.
Paths in a **configuration file** must be specified in UNIX-style using **forward slashes**:

```text
access_log   logs/site.log;
root         C:/web/html;
```

- configuration file
    - relative path: 以 `nginx.exe` 启动的目录为前缀
    - absolute path：用 `/` 分隔路径






