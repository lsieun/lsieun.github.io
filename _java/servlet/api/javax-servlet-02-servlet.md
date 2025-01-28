---
title: "javax.servlet.Servlet"
sequence: "102"
---

## Servlet

The `Servlet` interface defines these five methods.

```java
public interface Servlet {
    void init(ServletConfig config) throws ServletException;

    void service(ServletRequest req, ServletResponse res) throws ServletException, IOException;

    void destroy();

    String getServletInfo();

    ServletConfig getServletConfig();
}
```

`init`, `service`, and `destroy` are lifecycle methods.
The servlet container invokes these three methods according to these rules.

- `init`. The servlet container invokes this method the first time the servlet is requested.
  This method is not called at subsequent requests.
  You use this method to write initialization code.
  When invoking this method, the servlet container passes a `ServletConfig`.
  Normally, you will assign the `ServletConfig to` a class level variable
  so that this object can be used from other points in the servlet class.
- `service`. The servlet container invokes this method each time the servlet is requested.
  You write the code that the servlet is supposed to do here.
  The first time the servlet is requested, the servlet container calls the `init` method and the `service` method.
  For subsequent requests, only `service` is invoked.
- `destroy`. The servlet container invokes this method when the servlet is about to be destroyed.
  This occurs when the application is unloaded
  or when the servlet container is being shut down.
  Normally, you write clean-up code in this method.

The other two methods in `Servlet` are non-life cycle methods:
`getServletInfo` and `getServletConfig`.

- `getServletInfo`. This method returns the description of the servlet.
  You can return any string that might be useful or even null.
- `getServletConfig`. This method returns the `ServletConfig` passed by
  the servlet container to the `init` method.
  However, in order for `getServletConfig` to return a non-null value,
  you must have assigned the `ServletConfig` passed to the `init` method to a class level variable.

An important point to note is **thread safety**.
A servlet instance is shared by all users in an application, so class-level variables are not recommended,
unless they are read-only or members of the `java.util.concurrent.atomic` package.

## Example

### 编写 Servlet 文件

```java
package lsieun.servlet;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "MyServlet", urlPatterns = {"/my"})
public class MyServlet implements Servlet {
    private transient ServletConfig servletConfig;

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        this.servletConfig = servletConfig;
    }

    @Override
    public void service(ServletRequest request, ServletResponse response)
            throws ServletException, IOException {
        String servletName = servletConfig.getServletName();
        response.setContentType("text/html");
        PrintWriter writer = response.getWriter();
        writer.print(
                "<html><head><title>My Servlet</title></head><body>Hello From " +
                        servletName +
                        "</body></html>"
        );
        writer.flush();
    }

    @Override
    public void destroy() {
    }

    @Override
    public ServletConfig getServletConfig() {
        return servletConfig;
    }

    @Override
    public String getServletInfo() {
        return "My Servlet";
    }
}
```

### 进行编译

将 `Tomcat/lib` 目录下的 `servlet-api.jar` 复制到 `MyServlet.java` 目录。

执行命令：

```text
javac -cp servlet-api.jar MyServlet.java
```

### 进行部署

第一种方式：

在 `Tomcat/webapps` 目录下，新建 `myapp` 文件夹，将 `MyServlet.class` 文件复制到
`myapp/WEB-INF/classes/lsieun/servlet` 目录下：

第二种方式：生成 `war` 进行部署

将 `MyServlet.class` 放置到 `WEB-INF\classes\lsieun\servlet` 目录：

```text
jar -cvf myapp.war WEB-INF/
```

生成的 `myapp.war` 放到 `Tomcat/webapps` 目录下。

The recommended method for deploying a servlet/JSP application is to deploy it as a war file.
A war file is a jar file with war extension.
You can create a war file using the `jar` program that comes with the JDK or tools like WinZip.
You can then copy the war file to Tomcat's `webapps` directory.
When you start or restart Tomcat, Tomcat will extract the war file automatically.

### 浏览器访问

运行 `Tomcat/bin/startup.bat` 文件。

在浏览器中，输入网址：

```text
http://localhost:8080/myapp/my
```

