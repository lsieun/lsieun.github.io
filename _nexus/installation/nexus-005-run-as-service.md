---
title: "Nexus Run as a Service"
sequence: "105"
---

## Linux

## Windows

运行：

```text
bin\nexus.exe /run
```

The startup script that runs Nexus Repository on Windows platforms is `bin/nexus.exe`.
The script includes standard commands for starting and stopping the service.
It also contains commands `install`  and `uninstall` to create and delete the configuration for the service.

## 添加服务

用法：

```text
nexus.exe /install <optional-service-name>
```

**注意：若提示Could not open SCManager，则需管理员身份运行上述命令。**

第一种方式，不指定`<optional-service-name>`，那么它的默认值是`nexus`：

```text
nexus.exe /install
```

第二种方式，指定`<optional-service-name>`，例如`nexus3`（为了避免与Nexus 2.x版本的冲突）：

```text
nexus.exe /install nexus3
```

推荐：使用第一种方式，`<optional-service-name>`可以省略；否则，每次操作（安装、卸载、启动、停止）都需要指定`<optional-service-name>`。

### 卸载服务

```text
nexus.exe /uninstall <optional-service-name>
```

### 启动服务

```text
nexus.exe /start <optional-service-name>
```

### 关闭服务

```text
nexus.exe /stop <optional-service-name>
```

## MacOS

## Reference

- [sonatype: Run as a Service](https://help.sonatype.com/repomanager3/installation-and-upgrades/run-as-a-service)
