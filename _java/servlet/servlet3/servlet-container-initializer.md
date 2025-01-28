---
title: "Servlet Container Initializers"
sequence: "102"
---

The servlet container initializer is also a new addition in Servlet 3
that is especially useful for framework developers.

The brain of servlet container initialization is the 
`javax.servlet.ServletContainerInitializer` interface.
This is a simple interface with only one method, `onStartup`.
This method is called by the servlet container
before any `ServletContext` listener is given the opportunity to execute.

```java
public interface ServletContainerInitializer {
    void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException;
}
```

Classes implementing `ServletContainerInitializer` must be annotated with
`@HandleTypes` to declare the class types the initializer can handle.


There are two resources that are of importance here,
the initializer class (`lsieun.initializer.MyServletContainerInitializer`) and
a metadata text file named `javax.servlet.ServletContainerInitializer`.
This text file must be placed under `META-INF/services` in the jar file.
The text file consists of only one line,
which is the name of the class implementing `ServletContainerInitializer`.

```java
import javax.servlet.ServletContainerInitializer;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import javax.servlet.annotation.HandlesTypes;
import java.util.Set;

@HandlesTypes({UsefulServlet.class})
public class MyServletContainerInitializer implements ServletContainerInitializer {
    @Override
    public void onStartup(Set<Class<?>> classes, ServletContext servletContext) throws ServletException {
        System.out.println("onStartup");
        ServletRegistration registration = servletContext.addServlet(
                "usefulServlet",
                "lsieun.servlet.UsefulServlet"
        );
        registration.addMapping("/useful");
        System.out.println("leaving onStartup");
    }
}
```

File: `META-INF/services/javax.servlet.ServletContainerInitializer`

```text
lsieun.initializer.MyServletContainerInitializer
```

```java
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class UsefulServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter writer = response.getWriter();
        writer.println("<html><head><title>Useful servlet</title></head><body>Hello Useful Servlet</body></html>");
        writer.flush();
    }
}
```



