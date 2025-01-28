---
title: "Session Listeners"
sequence: "103"
---

There are four `HttpSession`-related listener interfaces,
`HttpSessionListener`, `HttpSessionActivationListener`,
`HttpSessionAttributeListener`, and `HttpSessionBindingListener`.

## HttpSessionListener

The servlet container calls all registered `HttpSessionListener`s
when an `HttpSession` is created or destroyed.
The two methods defined in `HttpSessionListener` are `sessionCreated` and `sessionDestroyed`.

```java
package javax.servlet.http;

import java.util.EventListener;


public interface HttpSessionListener extends EventListener {
    default void sessionCreated(HttpSessionEvent se) {}
    
    default void sessionDestroyed(HttpSessionEvent se) {}
}
```

Both methods receive an instance of `HttpSessionEvent`, which is a descendant of `java.util.Event`.
You can call the `getSession` method on the `HttpSessionEvent` to obtain the `HttpSession` created or destroyed.

```java
package javax.servlet.http;


public class HttpSessionEvent extends java.util.EventObject {

    private static final long serialVersionUID = -7622791603672342895L;

    public HttpSessionEvent(HttpSession source) {
        super(source);
    }

    public HttpSession getSession() {
        return (HttpSession) super.getSource();
    }
}
```

An `AtomicInteger` is used as a counter and stored as a `ServletContext` attribute.
When an `HttpSession` is created, this counter is incremented.
When an `HttpSession` is invalidated, this counter is decremented.
As such, it provides an accurate snapshot of the number of users having a valid session at the time the counter is read.
An `AtomicInteger` is used instead of an `Integer`
to guarantee the atomicity of the incrementing and decrementing operations.

```java
package lsieun.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import java.util.concurrent.atomic.AtomicInteger;

@WebListener
public class SessionListener implements HttpSessionListener, ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext servletContext = sce.getServletContext();
        servletContext.setAttribute("userCounter", new AtomicInteger());
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext servletContext = session.getServletContext();
        AtomicInteger userCounter = (AtomicInteger) servletContext.getAttribute("userCounter");
        int userCount = userCounter.incrementAndGet();
        System.out.println("userCount incremented to :" + userCount);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext servletContext = session.getServletContext();
        AtomicInteger userCounter = (AtomicInteger) servletContext.getAttribute("userCounter");
        int userCount = userCounter.decrementAndGet();
        System.out.println("---------- userCount decremented to :" + userCount);
    }
}
```

```java
package lsieun.servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Formatter;

@WebServlet("/hello-world")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("<!DOCTYPE html>%n");
        fm.format("<html  lang=\"zh-CN\">%n");
        fm.format("<head>%n");
        fm.format("<meta charset=\"UTF-8\"/>%n");
        fm.format("<title>%s</title>%n", "HelloWorld");
        fm.format("</head>%n");
        fm.format("<body>%n");
        fm.format("<h1>Hello World</h1>%n");
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
http://localhost:8080/portal/hello-world
```

## HttpSessionAttributeListener

An `HttpSessionAttributeListener` is like a `ServletContextAttributeListener`,
except that it gets invoked when an attribute is added to, removed from, or replaced in an `HttpSession`.

```java
package javax.servlet.http;

import java.util.EventListener;


public interface HttpSessionAttributeListener extends EventListener {
    default void attributeAdded(HttpSessionBindingEvent event) {
    }

    default void attributeRemoved(HttpSessionBindingEvent event) {
    }

    default void attributeReplaced(HttpSessionBindingEvent event) {
    }
}
```

The `attributeAdded` method is called by the servlet container when an attribute is added to the `HttpSession`.
The `attributeRemoved` method gets invoked when an attribute is removed from the `HttpSession` and
the `attributeReplaced` method gets called when a `HttpSession` attribute is replaced by a new one.
All the listener methods received an instance of `HttpSessionBindingEvent`
from which you can retrieve the corresponding `HttpSession` and the attribute `name` and `value`.

```java
package javax.servlet.http;


public class HttpSessionBindingEvent extends HttpSessionEvent {

    private static final long serialVersionUID = 7308000419984825907L;

    private String name;
    
    private Object value;
    
    public HttpSessionBindingEvent(HttpSession session, String name) {
        super(session);
        this.name = name;
    }
    
    public HttpSessionBindingEvent(HttpSession session, String name, Object value) {
        super(session);
        this.name = name;
        this.value = value;
    }
    
    @Override
    public HttpSession getSession () { 
        return super.getSession();
    }
 
    public String getName() {
        return name;
    }
    
    public Object getValue() {
        return this.value;   
    }
}
```

Since `HttpSessionBindingEvent` is a subclass of `HttpSessionEvent`,
you can also obtain the affected `HttpSession` in your `HttpSessionAttributeListener` class.

## HttpSessionActivationListener

In a distributed environment where multiple servlet containers are configured to scale,
the servlet containers may migrate or serialize session attributes in order to conserve memory.
Typically, relatively rarely accessed object may be serialized into secondary storage when memory is low.
When doing so, the servlet containers notify session attributes
whose classes implement the `HttpSessionActivationListener` interface.

There are **two methods** defined in this interface, `sessionDidActivate` and `sessionWillPassivate`:

```java
package javax.servlet.http;

import java.util.EventListener;


public interface HttpSessionActivationListener extends EventListener {

    default void sessionWillPassivate(HttpSessionEvent se) {
    }

    default void sessionDidActivate(HttpSessionEvent se) {
    }
} 
```

The `sessionDidActivate` method is invoked after the `HttpSession` containing this object has just been activated.
The `HttpSessionEvent` the servlet container passes to the method lets you obtain the `HttpSession` that was activated.

The `sessionWillPassivate` method is called when the `HttpSession`
containing this listener is about to be passivated.
Like `sessionDidActivate`,
the servlet container passes an `HttpSessionEvent` to the method
so that the session attribute may act on the `HttpSession`.

## HttpSessionBindingListener

An `HttpSessionBindingListener` gets notification when it is bound and unbound to an `HttpSession`.
A class whose instances are to be stored as session attributes may implement this interface
if knowing when it's bound to or unbound from an `HttpSession` is of interest.
For example, an object whose class implements this interface might update itself
when it is stored as an `HttpSession` attribute.
Or, an implementation of `HttpSessionBindingListener` might release resources it is holding
once it's unbound from the `HttpSession`.

```java
package javax.servlet.http;

import java.util.EventListener;


public interface HttpSessionBindingListener extends EventListener {
    default void valueBound(HttpSessionBindingEvent event) {
    }

    default void valueUnbound(HttpSessionBindingEvent event) {
    }
}
```

```java
package lsieun.model;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

public class Product implements HttpSessionBindingListener {
    private String id;
    private String name;
    private double price;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @Override
    public void valueBound(HttpSessionBindingEvent event) {
        String attributeName = event.getName();
        System.out.println(attributeName + " valueBound");
    }

    @Override
    public void valueUnbound(HttpSessionBindingEvent event) {
        String attributeName = event.getName();
        System.out.println(attributeName + " valueUnbound");
    }
}
```










