---
title: "远程访问（Remote Access）"
sequence: "103"
---

A fresh Docker installation provides a **Unix socket** by default. Remote access requires a **TCP socket**.

> Note: By convention, the Docker daemon uses port `2376` for secure TLS connections,
> and port `2375` for insecure, non-TLS connections.

By default, the Docker daemon listens for connections on a **Unix socket** to accept requests from local clients.
It's possible to allow Docker to accept requests from remote hosts
by configuring it to listen on an IP address and port as well as the Unix socket.

You can configure Docker to accept remote connections.
This can be done using the `docker.service` systemd unit file for Linux distributions using `systemd`.
Or you can use the `daemon.json` file, if your distribution doesn't use systemd.

```text
systemd vs daemon.json

Configuring Docker to listen for connections using both the systemd unit file and the daemon.json file
causes a conflict that prevents Docker from starting.
```

注意：**只通过一种方式设置，否则会出冲突**

## 使用 systemd

第一步，Use the command `sudo systemctl edit docker.service` to open an override file for `docker.service` in a text editor.

```text
原来的配置文件：/usr/lib/systemd/system/docker.service

添加的配置文件：/etc/systemd/system/docker.service.d/override.conf
```

第二步，Add or modify the following lines, substituting your own values.

```text
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375
```

第三步，Reload the systemctl configuration.

```text
sudo systemctl daemon-reload
```

第四步，Restart Docker.

```text
sudo systemctl restart docker.service
```

第五步，Verify that the change has gone through.

```text
$ sudo netstat -lntp | grep dockerd
tcp        0      0 127.0.0.1:2375          0.0.0.0:*               LISTEN      3758/dockerd
```

## 使用 daemon.json

修改 `/etc/docker/daemon.json` 文件：

```json
{
    "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
```


```json
{
    "insecure-registries": [
        "docker.lan.net:8082", 
        "docker.lan.net:8083"
    ],
    "registry-mirrors": ["https://hub-mirror.c.163.com"],
    "debug": true,
    "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
```

## 命令行

Run `dockerd` (the Docker daemon executable) with the `-H` flag to define the sockets you want to bind to.

```text
$ sudo dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375
```

This command will bind Docker to **the default Unix socket** and port `2375` on your machine's loopback address.
You can bind to additional sockets and IP addresses by repeating the `-H` flag.

```text
$ dockerd --debug \
  --tls=true \
  --tlscert=/var/docker/server.pem \
  --tlskey=/var/docker/serverkey.pem \
  --host tcp://192.168.59.3:2376
```

## 客户端连接

### Win10 环境

```text
> SET DOCKER_HOST=tcp://192.168.80.130:2375
> echo %DOCKER_HOST%
tcp://192.168.80.130:2375
> docker images
REPOSITORY                  TAG             IMAGE ID       CREATED       SIZE
testcontainers/ryuk         0.5.1           ec913eeff75a   3 weeks ago   12.7MB
docker.lan.net:8083/redis   7.0.11-alpine   f37f9f678836   4 weeks ago   30.2MB
hello-world                 latest          9c7a54a9a43c   5 weeks ago   13.3kB
```

### Linux 环境

```text
$ DOCKER_HOST=tcp://127.0.0.1:2375
$ docker images
REPOSITORY                  TAG             IMAGE ID       CREATED       SIZE
testcontainers/ryuk         0.5.1           ec913eeff75a   3 weeks ago   12.7MB
docker.lan.net:8083/redis   7.0.11-alpine   f37f9f678836   4 weeks ago   30.2MB
hello-world                 latest          9c7a54a9a43c   5 weeks ago   13.3kB
```

## Reference

- [Docker daemon configuration overview](https://docs.docker.com/config/daemon/)
- [Configure remote access for Docker daemon](https://docs.docker.com/config/daemon/remote-access/)
- [How and Why to Use A Remote Docker Host](https://www.howtogeek.com/devops/how-and-why-to-use-a-remote-docker-host/)
- [Use TLS (HTTPS) to protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/#use-tls-https-to-protect-the-docker-daemon-socket)

