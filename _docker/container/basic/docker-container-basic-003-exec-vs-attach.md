---
title: "docker exec/attach"
sequence: "103"
---

## 进入正在运行容器的两种方式

- docker exec
- docker attach

## docker exec

使用 `docker exec` 相当于进入容器并开启一个新的终端，可以在里面操作。
如果使用 `exit` 退出，容器也不会停止。

```text
docker exec -it <容器 ID> /bin/bash
```

```text
$ docker exec --help

Usage:  docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

Run a command in a running container

Options:
  -d, --detach               Detached mode: run command in the background
      --detach-keys string   Override the key sequence for detaching a container
  -e, --env list             Set environment variables
      --env-file list        Read in a file of environment variables
  -i, --interactive          Keep STDIN open even if not attached
      --privileged           Give extended privileges to the command
  -t, --tty                  Allocate a pseudo-TTY
  -u, --user string          Username or UID (format: <name|uid>[:<group|gid>])
  -w, --workdir string       Working directory inside the container
```

注意：因为 `exec` 是开始一个新终端，所以 `COMMAND` 是必填项，不能省略。

```text
$ docker exec nexus3 cat /nexus-data/etc/nexus.properties
```

```text
$ docker exec -it nginx-test whoami
root
```

### 权限问题

加上 `--user=root` 参数，切记最后的参数要使用 `/bin/bash`：

```text
docker exec -it --user=root 容器 ID /bin/bash
```

## attach

```text
$ docker attach --help

Usage:  docker attach [OPTIONS] CONTAINER

Attach local standard input, output, and error streams to a running container

Aliases:
  docker container attach, docker attach

Options:
      --detach-keys string   Override the key sequence for detaching a container
      --no-stdin             Do not attach STDIN
      --sig-proxy            Proxy all received signals to the process (default true)
```

使用 `docker attach` 会进入容器正在执行的终端，不会启动新的进程。
如果使用 `exit` 退出，容器会停止运行。

```text
$ docker attach <容器 ID>
```

如果想退出（Exit）容器，但不想停止（Stop）容器，则按住 `Ctrl+P+Q` 退出。

- `Ctrl+P+Q`: hold down `CTRL` and type `p` followed by `q`
