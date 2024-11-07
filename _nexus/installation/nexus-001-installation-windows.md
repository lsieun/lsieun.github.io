---
title: "Nexus Installation (Windows)"
sequence: "101"
---

## 下载

第 1 步，下载：

```text
https://help.sonatype.com/en/download.html
```

第 2 步，查看压缩包内容：

- 在 `nexus-3.xx.x/bin` 目录下有 `nexus.exe` 文件：

![](/assets/images/nexus3/nexus-bin-exe.png)

## 安装

第 1 步，解压

第 2 步，启动：

```text
nexus.exe /run
```

> 启动需要一些时间，需要多等一会儿

第 3 步，浏览器访问：

```text
http://localhost:8081
```

第 4 步，进行登录：

- 用户：`admin`
- 密码：位于 `sonatype-work\nexus3\admin.password` 文件中。

第 5 步，将密码修改为 `123456`。

## 安装为服务

如果不提供 `<optional-service-name>`，那么它的默认的为 `nexus`：

```text
nexus.exe /install <optional-service-name>
```

```text
nexus.exe /start <optional-service-name>
nexus.exe /stop <optional-service-name>
nexus.exe /uninstall <optional-service-name>
```

## 破解

第 1 步，将 `license-bundle-1.6.0.jar` 替换：

```text
nexus-3.xx.x\system\com\sonatype\licensing\license-bundle\1.6.0\license-bundle-1.6.0.jar
```

第 2 步，修改 `nexus.properties` 文件：

```text
sonatype-work\nexus3\etc\nexus.properties
```

添加如下内容：

```text
nexus.loadAsOSS=false
```


## Reference

- [Download](https://help.sonatype.com/en/download.html)
- [Installation Methods](https://help.sonatype.com/repomanager3/installation-and-upgrades/installation-methods)
- [Run as a Service](https://help.sonatype.com/repomanager3/installation-and-upgrades/run-as-a-service)
