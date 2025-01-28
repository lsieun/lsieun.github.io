---
title: "Tomcat项目部署：动态资源"
sequence: "105"
---

Servlet是Servlet Applet的简称，是服务器端的程序（代码、功能实现），
可交互式的处理客户端发送到服务端的请求，并完成操作响应。

## Servlet作用

- 接收客户端请求，完成操作。
- 动态生成网页（页面数据可变）。
- 将包含操作结果的动态网页响应给客户端。

## Servlet开发步骤

### 搭建开发环境

将Servlet相关Jar包（`lib/servlet-api.jar`）配置到classpath中。

### 编写Servlet

- 实现`javax.servlet.Servlet`
- 重写5个主要方法
- 在核心的`service()`方法中编写输出语句，打印访问结果。

```java
package lsieun.servlet;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.ServletException;
import java.io.IOException;

public class MyServlet implements Servlet {
    public void init(ServletConfig config) throws ServletException {
    }

    public void service(ServletRequest request, ServletResponse response)
        throws ServletException, IOException {
            System.out.println("My First Servlet");
    }

    public void destroy() {
    }

    public ServletConfig getServletConfig() {
        return null;
    }

    public String getServletInfo() {
        return null;
    }
}
```

### 编译Servlet

```text
javac -cp servlet-api.jar MyServlet.java
```

### 部署Servlet

编译MyServlet后，将生成的`.class`文件放到`WEB-INF/classes`文件中。

### 配置Servlet

编写`WEB-INF`下项目配置文件`web.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1" metadata-complete="true">

    <!-- 1、添加servlet -->
    <servlet>
        <servlet-name>MyServlet</servlet-name>
        <servlet-class>lsieun.servlet.MyServlet</servlet-class>
    </servlet>

    <!-- 2、添加servlet-mapping -->
    <servlet-mapping>
        <servlet-name>MyServlet</servlet-name>
        <url-pattern>/myservlet</url-pattern>
    </servlet-mapping>
</web-app>
```

注意：`url-pattern`配置的内容就是浏览器地址栏输入的URL中项目名称后资源的内容。

```text
                                   ┌─── servlet-name
                                   │
                                   ├─── servlet-class
                                   │
           ┌─── servlet ───────────┤                       ┌─── param-name
           │                       ├─── init-param ────────┤
           │                       │                       └─── param-value
           │                       │
           │                       └─── load-on-startup
           │
           │                       ┌─── servlet-name
           ├─── servlet-mapping ───┤
           │                       └─── url-pattern
web-app ───┤
           │                       ┌─── filter-name
           │                       │
           ├─── filter ────────────┼─── filter-class
           │                       │
           │                       │                    ┌─── param-name
           │                       └─── init-param ─────┤
           │                                            └─── param-value
           │
           │                       ┌─── filter-name
           └─── filter-mapping ────┤
                                   └─── url-pattern
```

### 运行测试

启动Tomcat，在浏览器地址栏中输入：

```text
http://localhost:8080/myweb/myservlet
```
