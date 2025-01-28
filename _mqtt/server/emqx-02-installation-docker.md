---
title: "EMQX Installation on Docker"
sequence: "302"
---

## docker

```text
docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8084:8084 -p 8883:8883 -p 18083:18083 emqx/emqx:latest
```

## docker compose

```text
$ cat docker-compose.yml 
services:
  emqx:
    image: emqx/emqx
    container_name: emqx_liusen
    ports:
     - 1883:1883
     - 8083:8083
     - 8084:8084
     - 8883:8883
     - 18083:18083
    restart: always
```

```text
$ docker compose up
[+] Running 2/2
 ⠿ Network my_default     Created                                                                                                                      0.0s
 ⠿ Container emqx_liusen  Created                                                                                                                      0.1s
Attaching to emqx_liusen
emqx_liusen  | WARNING: Default (insecure) Erlang cookie is in use.
emqx_liusen  | WARNING: Configure node.cookie in /opt/emqx/etc/emqx.conf or override from environment variable EMQX_NODE__COOKIE
emqx_liusen  | WARNING: Use the same config value for all nodes in the cluster.
emqx_liusen  | EMQX_RPC__PORT_DISCOVERY [rpc.port_discovery]: manual
emqx_liusen  | EMQX_LOG__FILE_HANDLERS__DEFAULT__ENABLE [log.file_handlers.default.enable]: false
emqx_liusen  | EMQX_LOG__CONSOLE_HANDLER__ENABLE [log.console_handler.enable]: true
emqx_liusen  | EMQX_NODE__NAME [node.name]: emqx@172.18.0.2
emqx_liusen  | Listener ssl:default on 0.0.0.0:8883 started.
emqx_liusen  | Listener tcp:default on 0.0.0.0:1883 started.
emqx_liusen  | Listener ws:default on 0.0.0.0:8083 started.
emqx_liusen  | Listener wss:default on 0.0.0.0:8084 started.
emqx_liusen  | Listener http:dashboard on :18083 started.
emqx_liusen  | EMQX 5.0.16 is running now!
```