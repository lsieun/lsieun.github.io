---
title: "Docker Environment Variables"
sequence: "105"
---

The following list of environment variables are supported by the `docker` command line:

- `DOCKER_HOST`: Daemon socket to connect to.

## DOCKER_HOST

第一种方式，在 Windows 的 `cmd` 中设置 `DOCKER_HOST` 环境变量：

```text
> set DOCKER_HOST=tcp://192.168.80.130:2375
> docker images
REPOSITORY        TAG       IMAGE ID       CREATED       SIZE
sonatype/nexus3   3.55.0    1a196aa9c4f4   8 days ago    550MB
hello-world       latest    9c7a54a9a43c   5 weeks ago   13.3kB
elasticsearch     7.17.10   a305059888ba   7 weeks ago   622MB
kibana            7.17.10   ba4afcebad69   7 weeks ago   811MB
```

第二种方式，使用 `-H` 或 `--host` 参数：

```text
> docker -H tcp://192.168.80.130:2375 images
REPOSITORY        TAG       IMAGE ID       CREATED       SIZE
sonatype/nexus3   3.55.0    1a196aa9c4f4   8 days ago    550MB
hello-world       latest    9c7a54a9a43c   5 weeks ago   13.3kB
elasticsearch     7.17.10   a305059888ba   7 weeks ago   622MB
kibana            7.17.10   ba4afcebad69   7 weeks ago   811MB

> docker --host tcp://192.168.80.130:2375 images
REPOSITORY        TAG       IMAGE ID       CREATED       SIZE
sonatype/nexus3   3.55.0    1a196aa9c4f4   8 days ago    550MB
hello-world       latest    9c7a54a9a43c   5 weeks ago   13.3kB
elasticsearch     7.17.10   a305059888ba   7 weeks ago   622MB
kibana            7.17.10   ba4afcebad69   7 weeks ago   811MB
```

第三种方式，设置环境变量

![](/assets/images/docker/docker-host-win10-env.png)

```text
> docker images
REPOSITORY        TAG       IMAGE ID       CREATED       SIZE
sonatype/nexus3   3.55.0    1a196aa9c4f4   8 days ago    550MB
hello-world       latest    9c7a54a9a43c   5 weeks ago   13.3kB
elasticsearch     7.17.10   a305059888ba   7 weeks ago   622MB
kibana            7.17.10   ba4afcebad69   7 weeks ago   811MB
```

## Reference

- [Environment variables](https://docs.docker.com/engine/reference/commandline/cli/#environment-variables)
