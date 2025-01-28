---
title: "Commands"
sequence: "104"
---

The `docker compose` command works on a per-directory basis.
You can have multiple groups of Docker containers running on one machine — 
just make one directory for each container and one `docker-compose.yml` file for each directory.


- `docker compose --help`：查看帮助
- `docker compose up`：启动所有 docker compose 服务
- `docker compose up -d`：启动所有 docker compose 服务，并后台运行
- `docker compose down`：停止并删除容器、网络、卷、镜像
- `docker compose exec yml里面的服务id /bin/bash`：进入容器实例内部
- `docker compose ps`：展示当前 docker compose 编排过的、运行的所有容器
- `docker compose top`：展示当前 docker compose 编排过的容器进程
- `docker compose logs yml里面的服务id`：查看容器输出日志

- `docker compose restart`：重启服务
- `docker compose start`：启动服务
- `docker compose stop`：停止服务

```text
$ docker compose -f kafka-zk-docker-compose.yml up -d
```

## 查看帮助

```text
$ docker compose --help

Usage:  docker compose [OPTIONS] COMMAND

Define and run multi-container applications with Docker.

Options:
      --ansi string                Control when to print ANSI control characters ("never"|"always"|"auto") (default "auto")
      --compatibility              Run compose in backward compatibility mode
      --dry-run                    Execute command in dry run mode
      --env-file stringArray       Specify an alternate environment file.
  -f, --file stringArray           Compose configuration files
      --parallel int               Control max parallelism, -1 for unlimited (default -1)
      --profile stringArray        Specify a profile to enable
      --project-directory string   Specify an alternate working directory
                                   (default: the path of the, first specified, Compose file)
  -p, --project-name string        Project name

Commands:
  build       Build or rebuild services
  config      Parse, resolve and render compose file in canonical format
  cp          Copy files/folders between a service container and the local filesystem
  create      Creates containers for a service.
  down        Stop and remove containers, networks
  events      Receive real time events from containers.
  exec        Execute a command in a running container.
  images      List images used by the created containers
  kill        Force stop service containers.
  logs        View output from containers
  ls          List running compose projects
  pause       Pause services
  port        Print the public port for a port binding.
  ps          List containers
  pull        Pull service images
  push        Push service images
  restart     Restart service containers
  rm          Removes stopped service containers
  run         Run a one-off command on a service.
  start       Start services
  stop        Stop services
  top         Display the running processes
  unpause     Unpause services
  up          Create and start containers
  version     Show the Docker Compose version information

Run 'docker compose COMMAND --help' for more information on a command.
```

## 基本

### 查看版本

```text
$ docker compose version
Docker Compose version v2.21.0
```

### 查看帮助

```text
docker compose COMMAND --help
```

例如：

```text
$ docker compose up --help
```

## compose file

### config

```text
$ docker compose config --help

Usage:  docker compose config [OPTIONS] [SERVICE...]

Parse, resolve and render compose file in canonical format

Aliases:
  docker compose config, docker compose convert

Options:
      --dry-run                 Execute command in dry run mode
      --format string           Format the output. Values: [yaml | json] (default "yaml")
      --hash string             Print the service config hash, one per line.
      --images                  Print the image names, one per line.
      --no-consistency          Don't check model consistency - warning: may produce invalid Compose output
      --no-interpolate          Don't interpolate environment variables.
      --no-normalize            Don't normalize compose model.
      --no-path-resolution      Don't resolve file paths.
  -o, --output string           Save to file (default to stdout)
      --profiles                Print the profile names, one per line.
  -q, --quiet                   Only validate the configuration, don't print anything.
      --resolve-image-digests   Pin image tags to digests.
      --services                Print the service names, one per line.
      --volumes                 Print the volume names, one per line.
```

- `docker compose config`：检查配置
- `docker compose config -q`：检查配置，有问题才输出

```text
$ docker compose -f kafka-zk-docker-compose.yml up -d
```



## service

So far you've been running `docker compose up` on your own, from which you can use `CTRL-C` to shut the container down.
This allows debug messages to be displayed in the terminal window.
This isn't ideal though;
when running in production it is more robust to have `docker-compose` act more like a **service**.
One simple way to do this is to add the `-d` option when you up your session:

```text
docker compose up -d
```

`docker compose` will now fork to the background.

## containers

If you try any of these commands from a directory other than the directory
that contains a Docker container and `.yml` file, it will return an error:

```text
ERROR:
        Can't find a suitable configuration file in this directory or any
        parent. Are you in the right directory?

        Supported filenames: docker-compose.yml, docker-compose.yaml
```

### up + down

启动：

```text
docker compose up
docker compose up -d
```

关闭：

```text
docker compose down
```

### ps

To show your group of Docker containers (both stopped and currently running), use the following command:

```text
docker compose ps -a
```

If a container is stopped, the Status will be listed as `Exited`, as shown in the following example:

```text
$ docker compose ps -a
NAME                    COMMAND             SERVICE             STATUS              PORTS
hello-world-my-test-1   "/hello"            my-test             exited (0)
```

### logs

```text
docker compose logs -f 容器ID
```

### stop

To stop all running Docker containers for an application group,
issue the following command in the same directory as the `docker-compose.yml` file
that you used to start the Docker group:

```text
docker compose stop
```

Note: `docker compose kill` is also available if you need to shut things down more forcefully.

### rm

In some cases, Docker containers will store their old information in an internal volume.
If you want to start from scratch you can use the `rm` command to
fully delete all the containers that make up your container group:

```text
docker compose rm
```

