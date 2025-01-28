---
title: "process"
sequence: "process"
---

## tasklist

`tasklist` 命令会列出当前运行的进程列表：

```text
> tasklist

映像名称                       PID 会话名              会话#       内存使用
========================= ======== ================ =========== ============
System Idle Process              0 Services                   0          8 K
System                           4 Services                   0      2,792 K
Secure System                   88 Services                   0     73,304 K
Registry                       156 Services                   0     95,524 K
nginx.exe                    15168 Console                    1      9,208 K
nginx.exe                    17800 Console                    1      9,912 K
```

根据**进程 ID** 查询进程名称：

```text
tasklist | findstr "进程 PID 号"
```

```text
> tasklist | findstr "15168"
nginx.exe                    15168 Console                    1      9,208 K
```

使用**进程名称**进行查询：

```text
tasklist /fi "imagename eq <进程名>
```

```text
>tasklist /fi "imagename eq nginx.exe"

映像名称                       PID 会话名              会话#       内存使用
========================= ======== ================ =========== ============
nginx.exe                    15168 Console                    1      9,208 K
nginx.exe                    17800 Console                    1      9,912 K

>tasklist /fi "imagename eq Registry"

映像名称                       PID 会话名              会话#       内存使用
========================= ======== ================ =========== ============
Registry                       156 Services                   0     95,804 K
```

运行以上命令后，会输出进程 ID（PID）、会话 ID（Session ID）、内存使用情况等。

## taskkill

根据 PID 结束进程：

```text
taskkill /F /PID "进程 PID 号"
taskkill -f -pid "进程 PID 号"
```

根据进程名称结束进程：

```text
taskkill -f -t -im "进程名称"
```
