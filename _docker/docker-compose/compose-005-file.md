---
title: "Docker Compose File"
sequence: "105"
---

## 介绍

### 用途

The Compose file is a YAML file defining
`version` (**DEPRECATED**), `services` (**REQUIRED**),
`networks`, `volumes`, `configs` and `secrets`.

- `version` (**DEPRECATED**)
- `services` (**REQUIRED**)
- `networks`
- `volumes`
- `configs`
- `secrets`

### 文件名

The default path for a Compose file is `compose.yaml` (preferred) or `compose.yml` in working directory.

> 默认文件名

Compose implementations SHOULD also support `docker-compose.yaml` and `docker-compose.yml` for backward compatibility.

> 兼容性

If both files exist, Compose implementations MUST prefer canonical `compose.yaml` one.

> 优先级

However, you can use the `-f` flag to specify custom filenames.

```text
docker compose -f my.yaml up
```

## services

### build

`build` specifies the build configuration for creating **container image** from **source**.

- `context`  (**REQUIRED**) defines either a path to a directory containing a Dockerfile, or a URL to a git repository.
- `dockerfile` sets an alternate Dockerfile. A relative path MUST be resolved from the build context.

```text
build:
  context: .
  dockerfile: webapp.Dockerfile
```

### container_name

- `container_name` is a string that specifies a custom container name, rather than a generated default name.

### depends_on

- `depends_on` expresses startup and shutdown dependencies between services.

### env_file

`env_file` adds environment variables to the container based on file content.

```text
env_file: .env
```

`env_file` can also be a list.

```text
env_file:
  - ./a.env
  - ./b.env
```

The files in the list MUST be processed from the top down.
For the same variable specified in two env files, the value from the last file in the list MUST stand.

> 多个文件的顺序和优先级

Each line in an env file MUST be in `VAR[=[VAL]]` format.
Lines beginning with `#` MUST be ignored.
Blank lines MUST also be ignored.

```text
# Set Rails/Rack environment
RACK_ENV=development
VAR="quoted"
```

### environment

`environment` defines environment variables set in the container.
`environment` can use either an array or a map.
Any `boolean` values; `true`, `false`, `yes`, `no`, SHOULD be enclosed in quotes
to ensure they are not converted to `True` or `False` by the YAML parser.

Map syntax:

```text
environment:
  RACK_ENV: development
  SHOW: "true"
  USER_INPUT:
```

Array syntax:

```text
environment:
  - RACK_ENV=development
  - SHOW=true
  - USER_INPUT
```

When both `env_file` and `environment` are set for a service, values set by `environment` have precedence.

> 优先级：environment 更高

### networks

`networks` defines the networks that service containers are attached to,
**referencing entries under the top-level `networks` key**.

```text
services:
  some-service:
    networks:
      - some-network
      - other-network
```

### ports

```text
ports:
  - "3000"
  - "3000-3005"
  - "8000:8000"
  - "9090-9091:8080-8081"
  - "49100:22"
  - "8000-9000:80"
  - "127.0.0.1:8001:8001"
  - "127.0.0.1:5000-5010:5000-5010"
  - "6060:6060/udp"
```

### restart

`restart` defines the policy that the platform will apply on container termination.

- `no`: The default restart policy. Does not restart the container under any circumstances.
- `always`: The policy always restarts the container until its removal.
- `on-failure`: The policy restarts the container if **the exit code indicates an error.**
- `unless-stopped`: The policy restarts the container irrespective of the exit code
  but will stop restarting when the service is stopped or removed.

```text
restart: "no"
restart: always
restart: on-failure
restart: unless-stopped
```

```yaml
services:
  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: prometheus
    restart: on-failure:1
    ports:
      - "9090:9090"
    volumes:
      - /opt/prometheus/config:/etc/prometheus
    deploy:
      resources:
        limits:
          memory: 2G
```

`on-failure:1` 表示容器会在失败时自动重新启动，最多尝试一次。
当容器的退出状态码为非零值时，即容器运行过程中出现错误或异常导致容器停止，Docker Engine 会自动重新启动该容器。
而 `1` 是最大重新尝试次数的限制。
这个设置通常用于保证容器的可用性，当容器由于某些问题停止运行时，Docker 会自动尝试重新启动容器，以使容器保持在运行状态。
这在一些故障恢复的场景下非常有用。

## volumes

```yaml
services:
  nginx:
    image: nginx:1.20
    container_name: nginx-1.20
    restart: always
    privileged: true
    environment:
      - TZ=Asia/Shanghai
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./conf.d:/etc/nginx/conf.d  ##这里面放置自定义conf文件
      - ./ssl:/etc/nginx/ssl  ###这里面可以放置ssl证书
      - ./log:/var/log/nginx  ###这里面放置日志
      - ./html:/usr/local/nginx/html  ###这里面放置静态文件
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/hosts:/etc/hosts:ro
      - /etc/localtime:/etc/localtime:ro
```

## Reference

- [Compose specification](https://docs.docker.com/compose/compose-file/)
    - [The Compose file](https://docs.docker.com/compose/compose-file/03-compose-file/)
    - [Services top-level element](https://docs.docker.com/compose/compose-file/05-services/)
        - [Compose file build reference](https://docs.docker.com/compose/compose-file/build/)
        - [Compose file deploy reference](https://docs.docker.com/compose/compose-file/deploy/)
    - [Networks top-level element](https://docs.docker.com/compose/compose-file/06-networks/)
    - [Volumes top-level element](https://docs.docker.com/compose/compose-file/07-volumes/)
    - [Configs top-level element](https://docs.docker.com/compose/compose-file/08-configs/)
    - [Secrets top-level element](https://docs.docker.com/compose/compose-file/09-secrets/)
