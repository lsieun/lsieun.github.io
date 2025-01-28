---
title: "Nacos"
sequence: "nacos"
---

## 单机

拉取镜像：

```text
$ docker pull nacos/nacos-server:v2.2.3
```

运行：

```text
docker run -d --name nacos -p 8848:8848 -e PREFER_HOST_MODE=hostname -e MODE=standalone nacos/nacos-server:v2.2.3
```

```text
$ docker run -d --name nacos -p 8848:8848 -p 9848:9848 -p 9849:9849 -e PREFER_HOST_MODE=hostname -e MODE=standalone nacos/nacos-server:v2.2.3
```

浏览器访问：

- 地址：`http://192.168.80.130:8848/nacos/`
- 用户：`nacos`
- 密码：`nacos`

进入容器，查看用户：

```text
$ docker exec -it nacos /bin/bash
```

```text
# ps -ef
UID         PID   PPID  C STIME TTY          TIME CMD
root          1      0 11 16:58 ?        00:00:28 /usr/lib/jvm/java-1.8.0-openjdk/bin/java 
```

```text
# cat /proc/1/cmdline 
/usr/lib/jvm/java-1.8.0-openjdk/bin/java
-Xms1g
-Xmx1g
-Xmn512m
-Dnacos.standalone=true
-Dnacos.preferHostnameOverIp=true
-Dnacos.member.list=
-Xloggc:/home/nacos/logs/nacos_gc.log
-Dloader.path=/home/nacos/plugins,/home/nacos/plugins/health,/home/nacos/plugins/cmdb,/home/nacos/plugins/selector
-Dnacos.home=/home/nacos

-jar /home/nacos/target/nacos-server.jar

--spring.config.additional-location=file:/home/nacos/conf/
--spring.config.name=application
--logging.config=/home/nacos/conf/nacos-logback.xml
--server.max-http-header-size=524288
```

## 集群部署


