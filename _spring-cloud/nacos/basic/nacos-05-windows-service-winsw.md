---
title: "Nacos 单机版部署为 Windows 服务"
sequence: "105"
---

## 安装为 Windows 服务

### 下载 WinSW

下载 `WinSW-x64.exe` 文件：

```text
https://github.com/winsw/winsw/releases/download/v2.12.0/WinSW-x64.exe
```

### 进行配置

![](/assets/images/spring-cloud/nacos/nacos-windows-service-01.png)


第一步，将 `WinSW-x64.exe` 文件重命名为 `nacos-service.exe` 文件，并放到 Nacos 的 `bin` 目录下。

第二步，在 Nacos 的 `bin` 目录下添加 `nacos-service.xml` 文件，内容如下：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<service>
    <!-- 指定在 Windows 系统内部使用的识别服务的 ID。在系统中安装的所有服务中，这必须是唯一的，它应该完全由字母数字字符组成 -->
    <id>nacos</id>
    <name>Nacos Service 2.1.2</name>
    <description>Nacos Service Supported By WinSW</description>

    <!-- 指定要启动的可执行文件 -->
    <executable>%BASE%\startup.cmd</executable>
    <arguments>-m standalone</arguments>
    <stopexecutable>%BASE%\shutdown.cmd</stopexecutable>

    <!-- 日志输出位置 -->
    <logpath>%BASE%\serviceLogs\</logpath>
    <logmode>roll</logmode>
</service>
```

### 安装和卸载服务

以**管理员身份**启动 cmd 窗口并进入 Nacos 的 `bin` 目录下执行：

```text
# 安装 windows 服务
nacos-service.exe install

# 卸载 windows 服务 	
nacos-service.exe uninstall
```

进行验证。按 `Windows + R` 键打开运行窗口，输入 `services.msc`：

![](/assets/images/spring-cloud/nacos/windows-win-r-services-msc.png)

![](/assets/images/spring-cloud/nacos/nacos-service-install-windows-service.png)


### 启动和停止服务

启动服务（管理员身份运行）：

```text
net start nacos
```

停止服务（管理员身份运行）：

```text
net stop nacos
```
