---
title: "Java Agent (Docker Compose)"
sequence: "104"
---

## Run

### Network

```text
docker network create spring-cloud-network
```

### SkyWalking OAP Server

oap-server:

```text
$ docker run \
--name oap-server \
--detach \
--rm \
--network spring-cloud-network \
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
--network spring-cloud-network \
-e SW_OAP_ADDRESS=http://oap-server:12800 \
-p 8080:8080 \
apache/skywalking-ui:v9.4.0-java17
```

### SkyWalking Java Agent

```yaml
services:
  redis-service:
    container_name: redis-service
    image: redis:7.2.3
    ports:
      - 6379:6379
    networks:
      - spring-cloud-network
  account-service:
    container_name: account-service
    build:
      context: lsieun-account-service
      dockerfile: Dockerfile
    image: account-service:latest
    environment:
      - SW_AGENT_NAME=account-service
      - SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
    ports:
      - 8021:8021
    networks:
      - spring-cloud-network
  auth-service:
    container_name: auth-service
    build:
      context: lsieun-auth-service
      dockerfile: Dockerfile
    image: auth-service:latest
    environment:
      - SW_AGENT_NAME=auth-service
      - SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
    ports:
      - 8022:8022
    networks:
      - spring-cloud-network
  msg-service:
    container_name: msg-service
    build:
      context: lsieun-msg-service
      dockerfile: Dockerfile
    image: msg-service:latest
    environment:
      - SW_AGENT_NAME=msg-service
      - SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
    ports:
      - 8019:8019
    networks:
      - spring-cloud-network
  money-service:
    container_name: money-service
    build:
      context: lsieun-money-service
      dockerfile: Dockerfile
    image: money-service:latest
    depends_on:
      - auth-service
    environment:
      - SW_AGENT_NAME=money-service
      - SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
    ports:
      - 8013:8013
    networks:
      - spring-cloud-network
  gateway-service:
    container_name: gateway-service
    build:
      context: lsieun-gateway-service
      dockerfile: Dockerfile
    image: gateway-service:latest
    environment:
      - SW_AGENT_NAME=gateway-service
      - SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.80.130:11800
    ports:
      - 80:80
    networks:
      - spring-cloud-network
networks:
  spring-cloud-network:
    driver: bridge
    external: true
```

#### GateWay

```text
FROM apache/skywalking-java-agent:8.16.0-java17
MAINTAINER lsieun
LABEL org.opencontainers.image.authors="lsieun"
ENV PORT=80
EXPOSE ${PORT}

RUN ["cp", "/skywalking/agent/optional-plugins/apm-spring-cloud-gateway-3.x-plugin-8.16.0.jar", "/skywalking/agent/plugins"]
RUN ["cp", "/skywalking/agent/optional-plugins/apm-spring-webflux-5.x-plugin-8.16.0.jar", "/skywalking/agent/plugins"]

WORKDIR /app

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar

ENTRYPOINT ["java","-jar","./application.jar"]
```
