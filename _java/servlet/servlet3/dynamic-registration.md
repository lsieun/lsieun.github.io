---
title: "Dynamic Registration"
sequence: "101"
---

Dynamic registration is a new feature in Servlet 3 for installing new web
objects (servlets, filters, listeners) without reloading the application.

## Dynamic Registration

To make dynamic registration possible,
the `ServletContext` interface has added these methods to dynamically create a web object.

```java
public interface ServletContext {
    <T extends Filter> T createFilter(Class<T> clazz) throws ServletException;
    <T extends EventListener> T createListener(Class<T> clazz) throws ServletException;
    <T extends Servlet> T createServlet(Class<T> clazz) throws ServletException;
}
```

For example, if `MyServlet` is a class that directly or indirectly implements `javax.servlet.Servlet`,
you can instantiate `MyServlet` by calling `createServlet`:

```text
Servlet myServlet = createServlet(MyServlet.class);
```

After you create a web object, you can add it to the `ServletContext`
using one of these methods, also new in Servlet 3.

```java
public interface ServletContext {
    FilterRegistration.Dynamic addFilter(String filterName, Filter filter);
    <T extends EventListener> void addListener(T t);
    ServletRegistration.Dynamic addServlet(String servletName, Servlet servlet);
}
```

Alternatively, you can simultaneously create and add a web object to the `ServletContext`
by calling one of these methods on the `ServletContext`.

```java
public interface ServletContext {
    FilterRegistration.Dynamic addFilter(String filterName, Class <? extends Filter> filterClass);
    FilterRegistration.Dynamic addFilter(String filterName, String className);

    void addListener(Class <? extends EventListener> listenerClass);
    void addListener(String className);

    ServletRegistration.Dynamic addServlet(String servletName, Class <? extends Servlet> servletClass);
    ServletRegistration.Dynamic addServlet(String servletName, String className);
}
```

To create or add a **listener**, the class passed to the first `addListener` method
override must implement one or more of the following interfaces:

- ServletContextAttributeListener
- ServletRequestListener
- ServletRequestAttributeListener
- HttpSessionListener
- HttpSessionAttributeListener

If the `ServletContext` was passed to a `ServletContextInitializer`'s `onStartup` method,
the listener class may also implement `ServletContextListener`.

The return value of the `addFilter` or `addServlet` method is either a
`FilterRegistration.Dynamic` or a `ServletRegistration.Dynamic`.

Both `FilterRegistration.Dynamic` and `ServletRegistration.Dynamic`
are subinterfaces of `Registration.Dynamic`. `FilterRegistration.Dynamic`
allows you to configure a filter and `ServletRegistration.Dynamic` a servlet.

```java
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class FirstServlet extends HttpServlet {
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter writer = response.getWriter();
        writer.println("<html><head><title>First servlet" +
                "</title></head><body>" + name);
        writer.println("</body></head>");
    }
}
```

```java
import javax.servlet.*;
import javax.servlet.annotation.WebListener;

@WebListener
public class DynRegListener implements ServletContextListener {
    // use createServlet to obtain a Servlet instance that can be
    // configured prior to being added to ServletContext
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext servletContext = sce.getServletContext();

        FirstServlet firstServlet = null;
        try {
            firstServlet = servletContext.createServlet(FirstServlet.class);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (firstServlet != null) {
            firstServlet.setName("Dynamically registered servlet");
        }

        // the servlet may not be annotated with @WebServlet
        ServletRegistration.Dynamic dynamic = servletContext.
                addServlet("firstServlet", firstServlet);
        dynamic.addMapping("/dynamic");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
```
