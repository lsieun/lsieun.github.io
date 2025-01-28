---
title: "ServletRequest Listeners"
sequence: "104"
---

There are **three listener interfaces** at the `ServletRequest` level,
`ServletRequestListener`, `ServletRequestAttributeListener`, and `AsyncListener`.

## ServletRequestListener

A `ServletRequestListener` responds to the creation and destruction of a `ServletRequest`.
In a servlet container that pools and reuses `ServletRequest`s,
the creation of a `ServletRequest` is taken to be the time it is retrieved from the pool and
its destruction the time it is returned to the pool.

The `ServletRequestListener` interface defines two methods,
`requestInitialized` and `requestDestroyed`.

```java
package javax.servlet;

import java.util.EventListener;


public interface ServletRequestListener extends EventListener {
    default void requestDestroyed(ServletRequestEvent sre) {
    }

    default void requestInitialized(ServletRequestEvent sre) {
    }
}
```

The `requestInitialized` method is invoked when a `ServletRequest` has been created (or taken from the pool) and
the `requestDestroyed` method when a `ServletRequest` is about to be destroyed (or returned to the pool).
Both methods receive a `ServletRequestEvent`,
from which you can retrieve the corresponding `ServletRequest` instance
by calling the `getServletRequest` method.

In addition, the `ServletRequestEvent` interface also defines the
`getServletContext` method that returns the `ServletContext`.

```java
package javax.servlet;

public class ServletRequestEvent extends java.util.EventObject { 

    private static final long serialVersionUID = -7467864054698729101L;

    private final transient ServletRequest request;

    public ServletRequestEvent(ServletContext sc, ServletRequest request) {
        super(sc);
        this.request = request;
    }

    public ServletRequest getServletRequest () { 
        return this.request;
    }

    public ServletContext getServletContext () { 
        return (ServletContext) super.getSource();
    }
}
```

The `PerfStatListener` class takes advantage of the `ServletRequestListener` interface
to measure how long it takes an HTTP request to complete.
It relies on the fact that the servlet container calls the `requestInitialized` method on a `ServletRequestListener`
at the beginning of a request and calls the `requestDestroyed` method after it processes it.
By reading the current time at the starts of the two events and compare the two,
you can get the approximate of how long it took an HTTP request to complete.

The `nanoTime` method returns a `long` indicating some arbitrary time.
The return value is not related to any notion of system or wall-clock time,
but two return values taken in the same JVM are perfect for measuring the time
that elapsed between the first `nanoTime` call and the second.

```java
package lsieun.listener;

import javax.servlet.ServletRequest;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpServletRequest;

@WebListener
public class PerfStatListener implements ServletRequestListener {
    @Override
    public void requestInitialized(ServletRequestEvent sre) {
        ServletRequest servletRequest = sre.getServletRequest();
        servletRequest.setAttribute("start", System.nanoTime());
    }

    @Override
    public void requestDestroyed(ServletRequestEvent sre) {
        ServletRequest servletRequest = sre.getServletRequest();
        Long start = (Long) servletRequest.getAttribute("start");
        Long end = System.nanoTime();
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String uri = httpServletRequest.getRequestURI();
        System.out.println("time taken to execute " + uri + ":" + ((end - start) / 1000) + " microseconds");
    }
}
```

```text
time taken to execute /portal/hello-world:2345 microseconds
```

## ServletRequestAttributeListener

A `ServletRequestAttributeListener` gets called
when an attribute has been added to, removed from, or replaced in a `ServletRequest`.
There are three methods defined in the `ServletRequestAttributeListener` interface,
`attributeAdded`, `attributeReplaced`, and `attributeRemoved`.

```java
package javax.servlet;

import java.util.EventListener;


public interface ServletRequestAttributeListener extends EventListener {
    default void attributeAdded(ServletRequestAttributeEvent srae) {
    }

    default void attributeRemoved(ServletRequestAttributeEvent srae) {
    }

    default void attributeReplaced(ServletRequestAttributeEvent srae) {
    }
}
```

All the methods receive an instance of `ServletRequestAttributeEvent`,
which is a child class of `ServletRequestEvent`.
The `ServletRequestAttributeEvent` class exposes the related attribute through the `getName` and `getValue` methods:

```java
package javax.servlet;


public class ServletRequestAttributeEvent extends ServletRequestEvent { 

    private static final long serialVersionUID = -1466635426192317793L;

    private String name;
    private Object value;

    public ServletRequestAttributeEvent(ServletContext sc, ServletRequest request, String name, Object value) {
        super(sc, request);
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
