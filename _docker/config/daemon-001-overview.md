---
title: "Docker Daemon 概览"
sequence: "101"
---

```text
Docker daemon = dockerd
```

```text
$ which dockerd
/usr/bin/dockerd
```

## Configure the Docker daemon

There are two ways to configure the Docker daemon:

- Use a JSON configuration file. This is the preferred option, since it keeps all configurations in a single place.
- Use flags when starting `dockerd`.

You can use both of these options together
as long as you don't specify the same option both as a flag and in the JSON file.
If that happens, the Docker daemon won't start and prints an error message.

> 注意：命令行 和 配置文件的 option 不能重复

To configure the Docker daemon using a JSON file,
create a file at `/etc/docker/daemon.json` on Linux systems.

You can also start the Docker daemon manually and configure it using flags.
This can be useful for troubleshooting problems.
