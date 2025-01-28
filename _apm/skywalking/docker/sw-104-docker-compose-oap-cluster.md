---
title: "OAP Server Cluster (Docker Compose)"
sequence: "104"
---

```text
$ docker network create sw-network
```

## Nacos

```text
$ docker run -d --name nacos -p 8848:8848 -p 9848:9848 -p 9849:9849 -e PREFER_HOST_MODE=hostname -e MODE=standalone nacos/nacos-server:v2.2.3
```

浏览器访问：

- 地址：`http://192.168.80.130:8848/nacos/`
- 用户：`nacos`
- 密码：`nacos`

## SkyWalking OAP

```text
docker run --name oap-001-server --rm -p 11801:11800 -p 12801:12800 -e SW_CLUSTER=nacos -e SW_CORE_GRPC_PORT=11801 --network sw-network apache/skywalking-oap-server:9.4.0-java17
docker run --name oap-002-server --rm -p 11802:11800 -p 12802:12800 -e SW_CLUSTER=nacos -e SW_CORE_GRPC_PORT=11802 --network sw-network apache/skywalking-oap-server:9.4.0-java17
docker run --name oap-003-server --rm -p 11803:11800 -p 12803:12800 -e SW_CLUSTER=nacos -e SW_CORE_GRPC_PORT=11803 --network sw-network apache/skywalking-oap-server:9.4.0-java17
```

```text
docker run --name oap-001-server --rm -p 11801:11800 -p 12801:12800 -e SW_CLUSTER=nacos -e SW_CORE_GRPC_HOST=192.168.80.130 -e SW_CORE_GRPC_PORT=11801 --network sw-network apache/skywalking-oap-server:9.4.0-java17
docker run --name oap-002-server --rm -p 11802:11800 -p 12802:12800 -e SW_CLUSTER=nacos -e SW_CORE_GRPC_HOST=192.168.80.130 -e SW_CORE_GRPC_PORT=11802 --network sw-network apache/skywalking-oap-server:9.4.0-java17
docker run --name oap-003-server --rm -p 11803:11800 -p 12803:12800 -e SW_CLUSTER=nacos -e SW_CORE_GRPC_HOST=192.168.80.130 -e SW_CORE_GRPC_PORT=11803 --network sw-network apache/skywalking-oap-server:9.4.0-java17
```

```yaml
services:
  oap-001-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-001-server
    ports:
      - 11801:11800
      - 12801:12800
    environment:
      SW_CLUSTER: nacos
      SW_CORE_GRPC_HOST: 192.168.80.130
      SW_CORE_GRPC_PORT: 11801
      TZ: Asia/Shanghai
    volumes:
      - /opt/skywalking/config01:/skywalking/config:ro
    networks:
      - sw-network
  oap-002-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-002-server
    ports:
      - 11802:11800
      - 12802:12800
    environment:
      SW_CLUSTER: nacos
      SW_CORE_GRPC_HOST: 192.168.80.130
      SW_CORE_GRPC_PORT: 11802
      TZ: Asia/Shanghai
    volumes:
      - /opt/skywalking/config02:/skywalking/config:ro
    networks:
      - sw-network
  oap-003-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-003-server
    ports:
      - 11803:11800
      - 12803:12800
    environment:
      SW_CLUSTER: nacos
      SW_CORE_GRPC_HOST: 192.168.80.130
      SW_CORE_GRPC_PORT: 11803
      TZ: Asia/Shanghai
    volumes:
      - /opt/skywalking/config03:/skywalking/config:ro
    networks:
      - sw-network
  oap-ui:
    image: apache/skywalking-ui:v9.4.0-java17
    container_name: oap-ui
    depends_on:
      - oap-001-server
      - oap-002-server
      - oap-003-server
    ports:
      - 8080:8080
    networks:
      - sw-network
    environment:
      SW_OAP_ADDRESS: http://oap-001-server:12801,http://oap-002-server:12802,http://oap-003-server:12803
networks:
  sw-network:
    external: true
```

```yaml
services:
  nacos:
    image: nacos/nacos-server:v2.2.3
    container_name: nacos
    ports:
      - 8848:8848
      - 9848:9848
      - 9849:9849
    environment:
      - PREFER_HOST_MODE=hostname
      - MODE=standalone
    networks:
      - sw-network
  oap-001-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-001-server
    depends_on:
      - nacos
    ports:
      - 11801:11800
      - 12801:12800
    environment:
      TZ: Asia/Shanghai
    volumes:
      - /opt/skywalking/config:/skywalking/config:ro
    networks:
      - sw-network
  oap-002-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-002-server
    depends_on:
      - nacos
    ports:
      - 11802:11800
      - 12802:12800
    environment:
      TZ: Asia/Shanghai
    volumes:
      - /opt/skywalking/config:/skywalking/config:ro
    networks:
      - sw-network
  oap-003-server:
    image: apache/skywalking-oap-server:9.4.0-java17
    container_name: oap-003-server
    depends_on:
      - nacos
    ports:
      - 11803:11800
      - 12803:12800
    environment:
      TZ: Asia/Shanghai
    volumes:
      - /opt/skywalking/config:/skywalking/config:ro
    networks:
      - sw-network
  oap-ui:
    image: apache/skywalking-ui:v9.4.0-java17
    container_name: oap-ui
    depends_on:
      - oap-001-server
      - oap-002-server
      - oap-003-server
    ports:
      - 8080:8080
    networks:
      - sw-network
    environment:
      SW_OAP_ADDRESS: http://oap-001-server:12801,http://oap-002-server:12802,http://oap-003-server:12803
networks:
  sw-network:
    external: true
```


## Config

```text
$ docker cp oap-server:/skywalking/config ~/sw/
$ docker cp oap-server:/skywalking/oap-libs ~/sw/
```

```text
$ sudo mkdir -p /opt/skywalking
$ sudo mv ~/sw/config/ /opt/skywalking/
$ sudo mv ~/sw/oap-libs/ /opt/skywalking/
$ sudo chmod -R 777 /opt/skywalking/
```

```text
$ cd /opt/skywalking/
$ cp -r config/ config01
$ cp -r config/ config02
$ cp -r config/ config03
```
