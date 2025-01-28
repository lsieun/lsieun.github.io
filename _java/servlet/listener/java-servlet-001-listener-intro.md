---
title: "Listener"
sequence: "101"
---

The Servlet API comes with a set of event classes and listener interfaces
for **event-driven programming** in servlet/JSP applications.

All event classes are derived from `java.util.Event` and
listeners are available in **three different levels**,
the `ServletContext` level, the `HttpSession` level, and the `ServletRequest` level.

One of the listener interfaces,
`javax.servlet.AsyncListener`, is a new addition to Servlet 3.0.

```text
                                 ┌─── ServletContextListener
             ┌─── application ───┤
             │                   └─── ServletContextAttributeListener
             │
             │                   ┌─── HttpSessionListener
             │                   │
             │                   ├─── HttpSessionAttributeListener
listeners ───┼─── session ───────┤
             │                   ├─── HttpSessionActivationListener
             │                   │
             │                   └─── HttpSessionBindingListener
             │
             │                   ┌─── ServletRequestListener
             │                   │
             └─── request ───────┼─── ServletRequestAttributeListener
                                 │
                                 └─── AsyncListener
```

## Listener Interfaces and Registration

The listener interfaces for creating listeners are part of the `javax.servlet` and `javax.servlet.http` packages.
They are listed below.

- `javax.servlet.ServletContextListener`. A listener to respond to servlet context lifecycle events.
  One of its method is called **right after the servlet context is created** and
  another method **right before the servlet context is shut down**.

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

- `javax.servlet.ServletContextAttributeListener`.
  A listener that can act upon a servlet context attribute being **added**, **removed**, or **replaced**.

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

- `javax.servlet.http.HttpSessionListener`.
  A listener to respond to the creation, timing-out, and invalidation of an `HttpSession`.

```java
package javax.servlet.http;

import java.util.EventListener;


public interface HttpSessionListener extends EventListener {
    default void sessionCreated(HttpSessionEvent se) {
    }

    default void sessionDestroyed(HttpSessionEvent se) {
    }
}
```

- `javax.servlet.http.HttpSessionAttributeListener.`
  A listener that gets called when a session attribute is **added**, **removed**, or **replaced**.

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

- `javax.servlet.http.HttpSessionActivationListener`.
  A listener that gets called when an HttpSession has been activated or passivated.

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

- `javax.servlet.http.HttpSessionBindingListener`.
  A class whose instances are to be stored as `HttpSession` attributes may implement this interface.
  An instance of a class implementing `HttpSessionBindingListener` will get a notification
  when it is added to or removed from the `HttpSession`.

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

- `javax.servlet.ServletRequestListener`.
  A listener to respond to the **creation** and **removal** of a `ServletRequest`.

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

- `javax.servlet.ServletRequestAttributeListener`.
  A listener whose methods get called when an attribute has been **added**, **removed**, or **replaced** from
  a `ServletRequest`.

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

- `javax.servlet.AsyncListener`.
  A listener used for asynchronous operations.

```java
package javax.servlet;

import java.io.IOException;
import java.util.EventListener;

/**
 * @since Servlet 3.0
 */
public interface AsyncListener extends EventListener {
    void onComplete(AsyncEvent event) throws IOException;

    void onTimeout(AsyncEvent event) throws IOException;

    void onError(AsyncEvent event) throws IOException;

    void onStartAsync(AsyncEvent event) throws IOException;
}
```

## 如何创建 Listener

To create a listener, simply create a Java class that implements the relevant interface.
In Servlet 3.0 there are **two ways** to register a listener
so that it will be recognized by the servlet container.

The first one is to use the `WebListener` annotation type like this:

```java

@WebListener
public class ListenerClass implements ListenerInterface {
}
```

The second way to register a listener is by using a `<listener>` element in the deployment descriptor.

```xml

<listener>
    <listener-class>fully-qualified listener class</listener-class>
</listener>
```






