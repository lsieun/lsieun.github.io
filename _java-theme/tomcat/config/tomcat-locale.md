---
title: "Tomcat Locale"
sequence: "101"
---

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

