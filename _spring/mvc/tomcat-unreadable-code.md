---
title: "Tomcat日志乱码：淇℃伅"
sequence: "117"
---

乱码输出：

```text
02-Mar-2022 12:42:30.962 淇℃伅 [main] org.apache.catalina.startup.VersionLoggerListener.log Server.鏈嶅姟鍣ㄧ増鏈�: Apache Tomcat/8.5.75
02-Mar-2022 12:42:30.965 淇℃伅 [main] org.apache.catalina.startup.VersionLoggerListener.log 鏈嶅姟鍣ㄦ瀯寤�:        Jan 17 2022 22:07:47 UTC
02-Mar-2022 12:42:30.965 淇℃伅 [main] org.apache.catalina.startup.VersionLoggerListener.log 鏈嶅姟鍣ㄧ増鏈彿:      8.5.75.0
02-Mar-2022 12:42:30.965 淇℃伅 [main] org.apache.catalina.startup.VersionLoggerListener.log 鎿嶄綔绯荤粺鍚嶇О:      Windows 7
```

中文输出：

```text
02-Mar-2022 12:36:43.642 信息 [main] org.apache.catalina.startup.VersionLoggerListener.log Server.服务器版本: Apache Tomcat/8.5.75
02-Mar-2022 12:36:43.645 信息 [main] org.apache.catalina.startup.VersionLoggerListener.log 服务器构建:        Jan 17 2022 22:07:47 UTC
02-Mar-2022 12:36:43.645 信息 [main] org.apache.catalina.startup.VersionLoggerListener.log 服务器版本号:      8.5.75.0
02-Mar-2022 12:36:43.645 信息 [main] org.apache.catalina.startup.VersionLoggerListener.log 操作系统名称:      Windows 7
```

英文输出：

```text
02-Mar-2022 12:44:56.907 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server version name:   Apache Tomcat/8.5.75
02-Mar-2022 12:44:56.909 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server built:          Jan 17 2022 22:07:47 UTC
02-Mar-2022 12:44:56.909 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server version number: 8.5.75.0
02-Mar-2022 12:44:56.909 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log OS Name:               Windows 7
```

## 原因分析

- locale
    - en: info
    - zh: 信息

- 编码过程：字符 --> 字节
- 解码过程：字节 --> 字符

```java
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws UnsupportedEncodingException {
        String str = "信息";
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        String result = new String(bytes, "GBK");
        System.out.println(result);
    }
}
```

输出：

```text
淇℃伅
```

![](/assets/images/spring/mvc/tomcat-log-unreadable-character-code.png)

## 解决方式

### 方式一：IDEA

在IDEA当中，修改Console的编码：从`<System Default: GBK>`到`UTF-8`的编码。

```text
Settings --> Editor --> General --> Console
```

将`Default Encoding`修改为`UTF-8`。

### 方式二：Tomcat

在Tomcat的安装目录下`bin`文件夹下，修改`catalina.bat`（Windows）或`catalina.sh`（Linux）文件。

搜索`JAVA_OPTS=`内容，添加如下信息：

```text
-Duser.language=en -Duser.country=US
```

修改前（Windows）：

```text
set "JAVA_OPTS=%JAVA_OPTS% -Djava.protocol.handler.pkgs=org.apache.catalina.webresources"
```

修改后（Windows）：

```text
set "JAVA_OPTS=%JAVA_OPTS% -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Duser.language=en -Duser.country=US"
```

