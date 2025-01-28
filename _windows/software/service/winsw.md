---
title: "WinSW：Windows Service Wrapper"
sequence: "winsw"
---

## WinSW：Windows Service Wrapper

WinSW wraps and manages any application as a Windows service.

```text
https://github.com/winsw/winsw/tags
```

```text
https://github.com/winsw/winsw/releases/tag/v2.12.0
```



```xml
<service>

    <!-- ID of the service. It should be unique across the Windows system-->
    <id>myapp</id>
    <!-- Display name of the service -->
    <name>MyApp Service (powered by WinSW)</name>
    <!-- Service description -->
    <description>This service is a service created from a minimal configuration</description>

    <!-- Path to the executable, which should be started -->
    <executable>%BASE%\myExecutable.exe</executable>

</service>
```

## 示例

- [ ] 将 Nacos 安装为服务
- [将 Nginx 安装为服务]({% link _nginx/installation/win/win-nginx-service-winsw.md %})

