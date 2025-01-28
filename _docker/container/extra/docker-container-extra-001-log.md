---
title: "docker logs"
sequence: "101"
---

```text
$ docker logs --help

Usage:  docker logs [OPTIONS] CONTAINER

Fetch the logs of a container

Aliases:
  docker container logs, docker logs

Options:
      --details        Show extra details provided to logs
  -f, --follow         Follow log output
      --since string   Show logs since timestamp (e.g. "2013-01-02T13:23:37Z") or relative (e.g. "42m" for 42 minutes)
  -n, --tail string    Number of lines to show from the end of the logs (default "all")
  -t, --timestamps     Show timestamps
      --until string   Show logs before a timestamp (e.g. "2013-01-02T13:23:37Z") or relative (e.g. "42m" for 42 minutes)
```

```text
$ docker logs <容器 ID>
```

```text
$ docker logs -f -t --tail 10 <容器 ID>
```

## grep

在 Docker 容器内，输出到 `stdout` 和 `stderr` 的信息会显示为 Docker 容器的 log。

为了查看 log，我们可以使用下面的语句：

```text
$ docker logs my-docker-container | grep "Thing that doesn't exist in the file"
```

但是，存在一个问题：`grep` 只对 `stdout` 信息生效，对 `stderr` 无效，所以输出结果中就带有 `stderr` 的信息。

为了解决这个问题，我们可以将 `stderr` 重定向到 `stdout` 中：

```text
$ docker logs my-docker-container 2>&1 | grep "Thing that doesn't exist in the file"
```

其中，

- `2` 代表 `stderr`
- `1` 代表 `stdout`
- `>&` 的作用就是将 `stderr` 重定向到 `stdout` 中

或者：

```text
$ docker logs my-docker-container |& grep "Thing that doesn't exist in the file"
```
