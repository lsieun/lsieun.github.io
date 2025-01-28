---
title: "Servlet Context Listeners"
sequence: "102"
---

There are two listener interfaces at the **ServletContext** level,
`ServletContextListener` and `ServletContextAttributeListener`.

## ServletContextListener

A `ServletContextListener` responds to the initialization and destruction of the `ServletContext`.

When the `ServletContext` is initialized, the servlet container calls the `contextInitialized` method
on all registered `ServletContextListener`s.

When the `ServletContext` is about to be decommissioned and destroyed,
the servlet container calls the `contextDestroyed` method on all registered `ServletContextListener`s.

```java
package javax.servlet;

import java.util.EventListener;

public interface ServletContextListener extends EventListener {

    default void contextInitialized(ServletContextEvent sce) {
    }

    default void contextDestroyed(ServletContextEvent sce) {
    }
}
```

Both `contextInitialized` and `contextDestroyed` receive a `ServletContextEvent` from the servlet container.
A descendant of `java.util.EventObject`, the `javax.servlet.ServletContextEvent` class
defines a `getServletContext` method that returns the `ServletContext`:

```java
package javax.servlet;

public class ServletContextEvent extends java.util.EventObject {

    private static final long serialVersionUID = -7501701636134222423L;

    public ServletContextEvent(ServletContext source) {
        super(source);
    }

    public ServletContext getServletContext() {
        return (ServletContext) super.getSource();
    }
}
```

Many `ServletContextListener`s are there to store an attribute in the `ServletContext`.

```java
package lsieun.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.HashMap;
import java.util.Map;

@WebListener
public class AppListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext servletContext = sce.getServletContext();

        Map<String, String> countries = new HashMap<>();
        countries.put("ca", "Canada");
        countries.put("us", "United States");
        servletContext.setAttribute("countries", countries);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
```

```java
package lsieun.servlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Formatter;
import java.util.Map;
import java.util.Set;

@WebServlet("/countries")
public class CountryServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext servletContext = req.getServletContext();
        Map<String, String> countries = (Map<String, String>) servletContext.getAttribute("countries");

        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=UTF-8");


        Set<Map.Entry<String, String>> entries = countries.entrySet();

        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("<!DOCTYPE html>%n");
        fm.format("<html  lang=\"zh-CN\">%n");
        fm.format("<head>%n");
        fm.format("<meta charset=\"UTF-8\"/>%n");
        fm.format("<title>%s</title>%n", "国家列表");
        fm.format("</head>%n");
        fm.format("<body>%n");
        fm.format("<h1>%s</h1>%n", "国家列表");
        fm.format("<ul>%n");

        for (Map.Entry<String, String> entry : entries) {
            String key = entry.getKey();
            String value = entry.getValue();
            fm.format("    <li>%s: %s</li>%n", key, value);
        }

        fm.format("</ul>%n");
        fm.format("</body>%n");
        fm.format("</html>");
        String content = sb.toString();

        PrintWriter writer = resp.getWriter();
        writer.println(content);
        writer.flush();
    }
}
```

```text
http://localhost:8080/portal/countries
```

## ServletContextAttributeListener

An implementation of `ServletContextAttributeListener` receives notification
whenever an attribute is added to, removed from, or replaced in the `ServletContext`.

```java
package javax.servlet;

import java.util.EventListener;


public interface ServletContextAttributeListener extends EventListener {

    default void attributeAdded(ServletContextAttributeEvent event) {
    }

    default void attributeRemoved(ServletContextAttributeEvent event) {
    }

    default void attributeReplaced(ServletContextAttributeEvent event) {
    }
}
```

The `attributeAdded` method is called by the servlet container when an attribute is added to the `ServletContext`.
The `attributeRemoved` method gets invoked when an attribute is removed from the `ServletContext` and
the `attributeReplaced` method gets called when a `ServletContext` attribute is replaced by a new one.
All the listener methods received an instance of `ServletContextAttributeEvent`
from which you can retrieve the attribute `name` and `value`.

The `ServletContextAttributeEvent` class is derived from
ServletContextAttribute and adds these two methods to retrieve the
attribute name and value, respectively.

```java
package javax.servlet;

public class ServletContextAttributeEvent extends ServletContextEvent {

    private static final long serialVersionUID = -5804680734245618303L;

    private String name;
    private Object value;

    public ServletContextAttributeEvent(ServletContext source, String name, Object value) {
        super(source);
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return this.name;
    }

    public Object getValue() {
        return this.value;
    }
}
```

```java
package lsieun.listener;

import javax.servlet.ServletContextAttributeEvent;
import javax.servlet.ServletContextAttributeListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class AppListener implements ServletContextAttributeListener {
    @Override
    public void attributeAdded(ServletContextAttributeEvent event) {
        String name = event.getName();
        Object value = event.getValue();
        String message = String.format("AppListener.attributeAdded --> %s: %s", name, value);
        System.out.println(message);
    }

    @Override
    public void attributeRemoved(ServletContextAttributeEvent event) {
        String name = event.getName();
        Object value = event.getValue();
        String message = String.format("AppListener.attributeRemoved --> %s: %s", name, value);
        System.out.println(message);
    }

    @Override
    public void attributeReplaced(ServletContextAttributeEvent event) {
        String name = event.getName();
        Object value = event.getValue();
        String message = String.format("AppListener.attributeReplaced --> %s: %s", name, value);
        System.out.println(message);
    }
}
```

```java
package lsieun.servlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Formatter;

@WebServlet("/change-attribute")
public class ChangeAttributeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext servletContext = req.getServletContext();

        String action = req.getParameter("action");
        String name = req.getParameter("name");
        String value = req.getParameter("value");
        if ("add".equalsIgnoreCase(action)) {
            servletContext.setAttribute(name, value);
        } else if ("replace".equalsIgnoreCase(action)) {
            servletContext.setAttribute(name, value);
        } else if ("remove".equalsIgnoreCase(action)) {
            servletContext.removeAttribute(name);
        }

        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("<!DOCTYPE html>%n");
        fm.format("<html  lang=\"zh-CN\">%n");
        fm.format("<head>%n");
        fm.format("<meta charset=\"UTF-8\"/>%n");
        fm.format("<title>%s</title>%n", "查看属性");
        fm.format("</head>%n");
        fm.format("<body>%n");
        fm.format("<h1>%s</h1>%n", "属性");
        fm.format("<p>%s:%s<p>%n", name, value);
        fm.format("</body>%n");
        fm.format("</html>");
        String content = sb.toString();

        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter writer = resp.getWriter();
        writer.println(content);
        writer.flush();
    }
}
```

```text
http://localhost:8080/portal/change-attribute?action=add&name=country&value=China
```

```text
AppListener.attributeAdded --> country: China
```

```text
http://localhost:8080/portal/change-attribute?action=replace&name=country&value=USA
```

```text
AppListener.attributeReplaced --> country: China
```

```text
http://localhost:8080/portal/change-attribute?action=remove&name=country&value=England
```

```text
AppListener.attributeRemoved --> country: USA
```

