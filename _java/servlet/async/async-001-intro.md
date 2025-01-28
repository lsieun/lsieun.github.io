---
title: "Asynchronous Processing"
sequence: "101"
---

Servlet 3 introduces a new feature that enables servlets to process requests asynchronously.

## Overview

A computer has limited memory. The servlet/JSP container designer knew
this and provided some configurable settings to make sure the container
could run within the hosting computer's means.
**For instance, in Tomcat 7 the maximum number of threads for processing incoming requests is 200.**
If you have a multiprocessor server, then you can safely increase this number,
but other than that it's recommended to use this default value.

**A servlet or filter holds a request processing thread until it completes its task.**
If the task takes a long time to complete and the number of concurrent users exceeds the number of threads,
the container may run the risk of running out of threads.
If this happens, Tomcat will stack up the excess requests in an internal server socket
(other containers may behave differently).
If more requests are still coming, they will be refused until there are resources to handle them.

**The asynchronous processing feature allows you to be frugal(（对金钱、食物等）节约的，节俭的) with container threads.**
You should use this feature for long-running operations.
What this feature does is release the request processing thread
while waiting for a task to complete so that the thread can be used by another request.
Note that the asynchronous support is only suitable if you have a long-running task AND
you want to notify the user of the outcome of the task.
If you only have a long-running task but the user does not need to know the processing result,
then you can just submit a `Runnable` to an `Executor` and return right away.
For example, if you need to generate a report (which takes a while) and send the report by email when it's ready,
then the servlet asynchronous processing feature is not the optimum solution.
By contrast, if you need to generate a report and show it to the user when the report is ready,
then asynchronous processing may be for you.

## Writing Async Servlets and Filters

The `WebServlet` and `WebFilter` annotation types may contain the new `asyncSupport` attribute.

```java

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WebServlet {
    boolean asyncSupported() default false;
}
```

```java

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WebFilter {
    boolean asyncSupported() default false;
}
```

To write a servlet or filter that supports asynchronous processing,
set the `asyncSupported` attribute to `true`:

```text
@WebServlet(asyncSupported=true ...)
@WebFilter(asyncSupported=true ...)
```

Alternatively, you can specify this in the deployment descriptor
using the `async-supported` element within a `servlet` or `filter` element.
For example, the following servlet is configured to support asynchronous processing.

```xml

<servlet>
    <servlet-name>AsyncServlet</servlet-name>
    <servlet-class>servlet.MyAsyncServlet</servlet-class>
    <async-supported>true</async-supported>
</servlet>
```

A servlet or filter that supports asynchronous processing can start a new thread
by calling the `startAsync` method on the `ServletRequest`.
There are two overloads of `startAsync`:

```java
public interface ServletRequest {
    AsyncContext startAsync() throws IllegalStateException;

    AsyncContext startAsync(ServletRequest servletRequest, ServletResponse servletResponse) throws IllegalStateException;
}
```

Both overloads return an instance of `AsyncContext`, which offer various methods and
contains a `ServletRequest` and a `ServletResponse`.

```java
public interface AsyncContext {
    ServletRequest getRequest();

    ServletResponse getResponse();
}
```

The first overload is straightforward and easy to use.
The resulting `AsyncContext` will contain the original `ServletRequest` and `ServletResponse`.
The second one allows you to wrap the original `ServletRequest` and `ServletResponse`
and pass them to the `AsyncContext`.
Note that you can only pass the original `ServletRequest` and `ServletResponse` or
their wrappers to the second `startAsync` overload.

Note that repeated invocation of `startAsync` will return the same `AsyncContext`.
Calling `startAsync` in a servlet or filter that does not support asynchronous processing
will throw a `java.lang.IllegalStateException`.
Also note that the `start` method of `AsyncContext` does not block,
so the next line of code will be executed
even before the thread it dispatched starts.

## Writing Async Servlets

Writing an asynchronous or async servlet or filter is relatively simple.
You predominantly create an async servlet or filter if you have a task
that takes a relatively long time to complete.
Here is what you have to do in your asynchronous servlet or filter class.

1. Call the `startAsync` method on the `ServletRequest`. The `startAsync` returns an `AsyncContext`.
2. Call `setTimeout()` on the `AsyncContext`, passing the number of milliseconds
   the container has to wait for the specified task to complete.
   This step is optional, but if you don't set a timeout,
   the container's default will be used.
   An exception will be thrown if the task fails to complete within the specified timeout time.
3. Call `asyncContext.start`, passing a `Runnable` that executes a long-running task.
4. Call `asyncContext.complete` or `asyncContext.dispatch` from the `Runnable` at the completion of the task.

Here is the skeleton of an asynchronous servlet's `doGet` or `doPost` method.

```text
final AsyncContext asyncContext = servletRequest.startAsync();
asyncContext.setTimeout( ... );
asyncContext.start(new Runnable() {
    @Override
    public void run() {
    
        // long running task
        asyncContext.complete() or asyncContext.dispatch()
    }
})
```

```java
import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "AsyncDispatchServlet", urlPatterns = {"/asyncDispatch"}, asyncSupported = true)
public class AsyncDispatchServlet extends HttpServlet {
    @Override
    public void doGet(final HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        final AsyncContext asyncContext = request.startAsync();
        System.out.println("mainThread: " + Thread.currentThread().getName());
        request.setAttribute("mainThread", Thread.currentThread().getName());
        asyncContext.setTimeout(5000);
        asyncContext.start(new Runnable() {
            @Override
            public void run() {
                // long-running task
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                }

                System.out.println("workerThread: " + Thread.currentThread().getName());
                request.setAttribute("workerThread", Thread.currentThread().getName());
                asyncContext.dispatch("/hello-world");
            }
        });
    }
}
```

Instead of dispatching to another resource at the completion of a task,
you can also call the `complete` method on the `AsyncContext`.
This method indicates to the servlet container that the task has completed.

第二个例子

The servlet sends a progress update every second so that the user can monitor progress.
It sends HTML response and a simple JavaScript code to update an HTML div element.

```java
import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "AsyncCompleteServlet", urlPatterns = {"/AsyncComplete"}, asyncSupported = true)
public class AsyncCompleteServlet extends HttpServlet {
    private static final long serialVersionUID = 78234L;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        final PrintWriter writer = response.getWriter();
        writer.println("<html><head><title>Async Servlet</title></head>");
        writer.println("<body><div id='progress'></div>");
        final AsyncContext asyncContext = request.startAsync();
        asyncContext.setTimeout(60000);
        asyncContext.start(new Runnable() {
            @Override
            public void run() {
                System.out.println("new thread:" + Thread.currentThread());
                for (int i = 0; i < 10; i++) {
                    writer.println("<script>");
                    writer.println("document.getElementById('progress').innerHTML = '" + (i * 10) + "% complete'");
                    writer.println("</script>");
                    writer.flush();
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                    }
                }
                writer.println("<script>");
                writer.println("document.getElementById('progress').innerHTML = 'DONE'");
                writer.println("</script>");
                writer.println("</body></html>");
                asyncContext.complete();
            }
        });
    }
}
```

