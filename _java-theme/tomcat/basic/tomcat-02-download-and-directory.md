---
title: "Tomcat下载和安装目录"
sequence: "102"
---

## 下载地址

- [Tomcat 10 Software Downloads](https://tomcat.apache.org/download-10.cgi)
- [Tomcat 9 Software Downloads](https://tomcat.apache.org/download-90.cgi)
- [Tomcat 8 Software Downloads](https://tomcat.apache.org/download-80.cgi)

## 目录结构

![](/assets/images/java/tomcat/tomcat-08-directory-and-file.png)

- `bin`：该目录下存放的是二进制可执行文件
  - `startup.bat`：启动Tomcat
  - `shutdown.bat`：停止Tomcat
- `conf`：这是一个非常重要的目录，这个目录有两个最为重要的文件`server.xml`和`web.xml`
  - `server.xml`：配置整个服务器信息。例如，修改端口号、编码格式等。
  - `web.xml`：项目部署描述文件。这个文件中注册了很多MIME类型，即文档类型。
- `lib`：Tomcat的类库，里面存放Tomcat运行所需要的Jar文件
- `logs`：存放日志文件，记录了Tomcat启动和关闭的信息。如果启动Tomcat时有错误，异常也会记录在日志文件中。
- `temp`：Tomcat的临时文件，这个目录下的东西在停止Tomcat后删除。
- `webapps`：存放web项目的目录，其中每个文件夹都是一个项目。
  - 其中，`ROOT`是一个特殊的项目，在地址栏中没有给出项目目录时，对应的就是`ROOT`项目。
- `work`：运行时生成的文件，最终运行的文件都在这里。
  - 当客户端用户访问一个JSP文件时，Tomcat会通过JSP生成Java文件，然后再编译Java文件生成`.class`文件，
    生成的`.java`和`.class`文件都会存放到这个目录下

```text
                          ┌─── startup.bat
                          │
                          ├─── shutdown.bat
                          │
                          ├─── startup.sh
          ┌─── bin ───────┤
          │               ├─── shutdown.sh
          │               │
          │               ├─── tomcat8.exe
          │               │
          │               └─── tomcat8w.exe
          │
          │               ┌─── server.xml
          ├─── conf ──────┤
Tomcat ───┤               └─── web.xml
          │
          ├─── lib
          │
          ├─── logs
          │
          ├─── temp
          │
          ├─── webapps ───┼─── ROOT
          │
          └─── work
```

In the `bin` directory, you will find programs to start and stop Tomcat.
The `webapps` directory is important because you can deploy your applications there.
In addition, the `conf` directory contains configuration files,
including the `server.xml` and `tomcat-users.xml` files.
The `lib` directory is also of interest since it contains the Servlet and JSP APIs
that you need to compile your servlets and custom tags.

## Tomcat启动和停止

### 启动

双击Tomcat目录下的`bin/startup.bat`文件。

### 停止

双击Tomcat目录下的`bin/shutdown.bat`文件。

### 修改端口号

Tomcat默认端口号为`8080`，可以通过`conf/server.xml`文件实现。

修改前：

```xml
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
```

修改后：

```text
<Connector port="8888" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
```

注意：修改端口号需要重新启动Tomcat才能生效。




