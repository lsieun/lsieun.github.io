---
title: "SkyWalking Java Agent 源码环境"
sequence: "101"
---

第 1 步，下载源码：

```text
https://skywalking.apache.org/downloads/
```

![](/assets/images/skywalking/source/sw-src-env-agent-source-download.png)

第 2 步，解压文件。

第 3 步，使用 IntelliJ IDEA 打开项目。

第 4 步，在 `~/pom.xml` 中，注释掉 `maven-checkstyle-plugin` 插件。

第 5 步，运行 `mvn clean compile` 命令。

第 6 步，在 `apm-protocol/apm-network` 项目中，`src/main/proto` 包含了 ProtoBuf 文件：

- 在 `target/generated-sources/protobuf/grpc-java` 目录上，右键选择 `Mark Directory As` 为 `Sources Roots`。
- 在 `target/generated-sources/protobuf/java` 目录上，右键选择 `Mark Directory As` 为 `Sources Roots`。

