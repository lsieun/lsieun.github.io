---
title: "Win: Nginx 安装为服务"
sequence: "102"
---

## 下载 WinSW

```text
https://github.com/winsw/winsw/releases/download/v2.12.0/WinSW-x64.exe
```

## 将 Nginx 安装为服务

第 1 步，将 `WinSW-x64.exe` 复制到 `nginx/bin` 目录：

![](/assets/images/nginx/win-install/win-nginx-winsw-001-copy-winsw-exe.png)

第 2 步，将 `WinSW-x64.exe` 重新命名为 `nginx-service.exe`：

![](/assets/images/nginx/win-install/win-nginx-winsw-002-change-name.png)

第 3 步，添加 `nginx-service.xml` 文件：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <id>nginx</id>
    <name>Nginx Service 1.26</name>
    <description>Nginx Service Supported By WinSW</description>
    
    <executable>%BASE%/nginx.exe</executable>
    <stopexecutable>%BASE%/nginx.exe -s stop</stopexecutable>
    
    <logpath>%BASE%/logs/</logpath>
    <logmode>roll</logmode>
    <depend></depend>
</configuration>
```

在使用的过程中，我发现经常会出现“自动启动不成功的问题”，猜测可能是”有些依赖服务没有启动“，因此增加了”延迟启动“：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <id>nginx</id>
    <name>Nginx Service 1.26</name>
    <description>Nginx Service Supported By WinSW</description>
    
    <executable>%BASE%/nginx.exe</executable>
    <stopexecutable>%BASE%/nginx.exe -s stop</stopexecutable>

    <startmode>Automatic</startmode>
    <delayedAutoStart>true</delayedAutoStart>
    
    <logpath>%BASE%/logs/</logpath>
    <logmode>roll</logmode>
    <depend></depend>
</configuration>
```

### 安装和卸载服务

以**管理员身份**启动 cmd 窗口并进入 Nginx 的安装目录下执行：

```text
# 安装 windows 服务
nginx-service.exe install

# 卸载 windows 服务 	
nginx-service.exe uninstall
```

### 启动和停止服务

启动服务（管理员身份运行）：

```text
net start nginx
```

停止服务（管理员身份运行）：

```text
net stop nginx
```




