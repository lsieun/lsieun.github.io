---
title: "Win10 + SkyWalking"
sequence: "win10"
---

## 下载

```text
https://mirrors.tuna.tsinghua.edu.cn/apache/skywalking/
https://mirrors.tuna.tsinghua.edu.cn/apache/skywalking/9.5.0/
```

## 启动

```text
cd skywalking/bin
.\startup.bat
```

## 使用

浏览器访问：

```text
http://localhost:8080/
```

Java Agent:

```text
-javaagent:D:\service\skywalking-agent\skywalking-agent.jar
-DSW_AGENT_NAME=skywalking-spring-boot-demo
-DSW_AGENT_COLLECTOR_BACKEND_SERVICES=skywalking-server:11800
```
