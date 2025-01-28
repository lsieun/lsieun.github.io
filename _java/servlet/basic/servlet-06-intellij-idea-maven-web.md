---
title: "Intellij IDEA"
sequence: "106"
---

## pom.xml

```text
<properties>
    <servlet.version>4.0.1</servlet.version>
</properties>

<dependencies>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>${servlet.version}</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

## Add Web Framework

![](/assets/images/java/servlet/intellij-idea-servlet-xml-add-web-framework.png)

## 编写Servlet

```java
package lsieun.servlet;

import javax.servlet.*;
import java.io.IOException;

public class MyServlet implements Servlet {
    @Override
    public void init(ServletConfig config) throws ServletException {

    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    @Override
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        System.out.println("Hello Servlet");
    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {

    }
}
```

## 配置web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <servlet>
        <servlet-name>MyServlet</servlet-name>
        <servlet-class>lsieun.servlet.MyServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>MyServlet</servlet-name>
        <url-pattern>/myservlet</url-pattern>
    </servlet-mapping>
</web-app>
```

## 部署Web项目

在Tomcat的`webapps`目录下，新建`WebProject`项目文件夹：

- 创建`WEB-INF`，存放核心文件
- 在`WEB-INF`下，创建`classes`文件夹，将编译后的`MyServlet.class`文件复制到这里。

