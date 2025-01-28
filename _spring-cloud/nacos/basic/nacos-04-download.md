---
title: "Nacos 下载和运行"
sequence: "104"
---

## 下载地址

```text
https://github.com/alibaba/nacos/releases
```

## 目录结构

```text
nacos
├─── bin
│    ├─── shutdown.cmd
│    ├─── shutdown.sh
│    ├─── startup.cmd
│    └─── startup.sh
├─── conf
│    ├─── 1.4.0-ipv6_support-update.sql
│    ├─── application.properties
│    ├─── application.properties.example
│    ├─── cluster.conf.example
│    ├─── derby-schema.sql
│    ├─── mysql-schema.sql
│    └─── nacos-logback.xml
├─── LICENSE
├─── NOTICE
└─── target
     └─── nacos-server.jar
```

### application.properties

```text
### Default web server port:
server.port=8848
```

## 启动

Windows：

```text
startup.cmd -m standalone
```

访问地址：

```text
http://localhost:8848/nacos/
```

- 用户：nacos
- 密码：nacos


## Reference

- [Releases](https://github.com/alibaba/nacos/releases)
