---
title: "Java Agent"
sequence: "103"
---

## skywalking-java-agent

```text
$ dive apache/skywalking-java-agent:8.16.0-java17
```

![](/assets/images/java/skywalking/skywalking-java-agent-docker-files.png)

```text
$ docker inspect apache/skywalking-java-agent:8.16.0-java17
```

```json
[
  {
    "Id": "sha256:e630e71cf00726c7afdeb536d3601b8cd7c79d61948717c6730adeab5a6373a4",
    "RepoTags": [
      "apache/skywalking-java-agent:8.16.0-java17"
    ],
    "Config": {
      "Env": [
        "PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "JAVA_HOME=/opt/java/openjdk",
        "JAVA_VERSION=jdk-17.0.7+7",
        "JAVA_TOOL_OPTIONS=-javaagent:/skywalking/agent/skywalking-agent.jar" 
      ],
      "Cmd": [
        "/bin/bash"
      ],
      "WorkingDir": "/skywalking"
    },
    "Architecture": "amd64",
    "Os": "linux"
  }
]
```

## Dockerfile

第 1 步，创建一个 `Dockerfile` 文件：

```text
FROM apache/skywalking-java-agent:8.16.0-java17
MAINTAINER lsieun
LABEL org.opencontainers.image.authors="lsieun"
ENV PORT=8022
EXPOSE ${PORT}

WORKDIR /app

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar

ENTRYPOINT ["java","-jar","./application.jar"]
```

第 2 步，生成 Docker Image：

```text
$ docker build --tag auth-service .
```

## Run

### Network

```text
docker network create sw-network
```

### SkyWalking OAP Server

oap-server:

```text
$ docker run \
--name oap-server \
--detach \
--rm \
--network sw-network \
-p 11800:11800 \
-p 12800:12800 \
apache/skywalking-oap-server:9.4.0-java17
```

### SkyWalking UI

```text
$ docker run \
--name oap-ui \
--detach \
--rm \
--network sw-network \
-e SW_OAP_ADDRESS=http://oap-server:12800 \
-p 8080:8080 \
apache/skywalking-ui:v9.4.0-java17
```

### SkyWalking Java Agent

```text
$ docker run \
--name auth-service-app \
-p 8022:8022 \
--rm \
--detach \
--env SW_AGENT_NAME=auth-service \
--env SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800 \
auth-service:latest
```

```text
$ docker exec -it auth-service-app /bin/bash
```

## Reference

- [Setup java agent](https://skywalking.apache.org/docs/skywalking-java/next/en/setup/service-agent/java-agent/readme/)
    - [Apache SkyWalking Agent Containerized Scenarios](https://skywalking.apache.org/docs/skywalking-java/next/en/setup/service-agent/java-agent/containerization/)
