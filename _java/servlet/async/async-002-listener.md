---
title: "Async Listeners"
sequence: "102"
---

In conjunction with support for servlets and filters that perform asynchronous operations,
Servlet 3.0 also adds the `AsyncListener` interface
so that you can be notified of what's happening during asynchronous processing.
The `AsyncListener` interface defines the following methods
that get called when certain event occurs.

```java
public interface AsyncListener extends EventListener {
    void onComplete(AsyncEvent event) throws IOException;

    void onTimeout(AsyncEvent event) throws IOException;

    void onError(AsyncEvent event) throws IOException;

    void onStartAsync(AsyncEvent event) throws IOException;
}
```

- `void onStartAsync(AsyncEvent event)`: This method gets called when an asynchronous operation has been initiated.
- `void onComplete(AsyncEvent event)`: This method gets called when an asynchronous operation has completed.
- `void onError(AsyncEvent event)`: This method gets called in the event an asynchronous operation has failed.
- `void onTimeout(AsyncEvent event)`: This method gets called when an asynchronous has timed out,
  namely when it failed to finish within the specified timeout.

```text
                                 ┌─── onStartAsync(AsyncEvent event)
                 ┌─── success ───┤
                 │               └─── onComplete(AsyncEvent event)
AsyncListener ───┤
                 │               ┌─── onTimeout(AsyncEvent event)
                 └─── fail ──────┤
                                 └─── onError(AsyncEvent event)
```

All the four methods receive an `AsyncEvent`
from which you can retrieve the related `AsyncContext`, `ServletRequest`, and `ServletResponse`
through its `getAsyncContext`, `getSuppliedRequest`, and `getSuppliedResponse`, respectively.

```java
public class AsyncEvent {
    private AsyncContext context;
    private ServletRequest request;
    private ServletResponse response;
    private Throwable throwable;

    public AsyncEvent(AsyncContext context) {
        this(context, context.getRequest(), context.getResponse(), null);
    }

    public AsyncContext getAsyncContext() {
        return context;
    }

    public ServletRequest getSuppliedRequest() {
        return request;
    }

    public ServletResponse getSuppliedResponse() {
        return response;
    }

    public Throwable getThrowable() {
        return throwable;
    }
}
```

Note that unlike other web listeners, you do not annotate an implementation of `AsyncListener` with `@WebListener`.

```java
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import java.io.IOException;

// do not annotate with @WebListener
public class MyAsyncListener implements AsyncListener {
    @Override
    public void onComplete(AsyncEvent asyncEvent) throws IOException {
        System.out.println("onComplete");
    }

    @Override
    public void onError(AsyncEvent asyncEvent) throws IOException {
        System.out.println("onError");
    }

    @Override
    public void onStartAsync(AsyncEvent asyncEvent) throws IOException {
        System.out.println("onStartAsync");
    }

    @Override
    public void onTimeout(AsyncEvent asyncEvent) throws IOException {
        System.out.println("onTimeout");
    }
}
```

Since an `AsyncListener` class is not annotated with `@WebListener`,
you have to register an `AsyncListener` manually to any `AsyncContext`
that you are interested in getting event notifications from.
You register an `AsyncListener` on an `AsyncContext`
by calling the `addListener` method on the latter:

```text
void addListener(AsyncListener listener)
```

```java
import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "AsyncListenerServlet",
        urlPatterns = {"/asyncListener"},
        asyncSupported = true)
public class AsyncListenerServlet extends HttpServlet {
    private static final long serialVersionUID = 62738L;

    @Override
    public void doGet(final HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        final AsyncContext asyncContext = request.startAsync();
        asyncContext.setTimeout(5000);

        asyncContext.addListener(new MyAsyncListener());
        asyncContext.start(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(7000);
                } catch (InterruptedException e) {
                }
                String greeting = "hi from listener";
                System.out.println("wait....");
                request.setAttribute("greeting", greeting);
                asyncContext.dispatch("/hello-world");
            }
        });
    }
}
```

## Summary

Servlet 3.0 comes with a new feature for processing asynchronous operations.
This is especially useful when your servlet/JSP application is a
very busy one with one or more long-running operations.
This feature works by assigning those operations to a new thread and
thereby releasing the request processing thread back to the pool, ready to serve another request.
In this chapter you learned how to write servlets
that support asynchronous processing as well as listeners that get notified
when certain events occur during the processing.
