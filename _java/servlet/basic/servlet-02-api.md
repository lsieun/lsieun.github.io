---
title: "The Servlet API"
sequence: "102"
---

## Two Packages

Servlets use classes and interfaces from two packages: `javax.servlet` and `javax.servlet.http`.

- The `javax.servlet` package contains classes to support **generic, protocol-independent servlets**.
- These classes are extended by the classes in the `javax.servlet.http` package to add **HTTP-specific functionality**.

The top-level package name is `javax` instead of the familiar `java`,
to indicate that **the Servlet API is a standard extension**.

## Servlet

Every servlet must implement the `javax.servlet.Servlet` interface.
Most servlets implement it by extending one of two special classes:
`javax.servlet.GenericServlet` or `javax.servlet.http.HttpServlet`.

A protocol-independent servlet should subclass `GenericServlet`,
while an HTTP servlet should subclass `HttpServlet`,
which is itself a subclass of `GenericServlet` with added HTTP-specific functionality.

```text
javax.servlet.GenericServlet
javax.servlet.http.HttpServlet
```

### GenericServlet

Unlike a regular Java program, and just like an applet, a servlet does not have a `main()` method.
Instead, certain methods of a servlet are invoked by the server in the process of handling requests.
Each time the server dispatches a request to a servlet, it invokes the servlet's `service()` method.

A generic servlet should override its `service()` method to handle requests as appropriate for the servlet.
The `service()` method accepts two parameters: a request object and a response object.
The request object tells the servlet about the request,
while the response object is used to return a response.

![](/assets/images/java/servlet/a-generic-servlet-handling-a-request.png)

### HttpServlet

In contrast, an HTTP servlet usually does not override the `service()` method.
Instead, it overrides `doGet()` to handle GET requests and `doPost()` to handle POST requests.
An HTTP servlet can override either or both of these methods,
depending on the type of requests it needs to handle.

The `service()` method of `HttpServlet` handles the setup and dispatching to all the `doXXX()` methods,
which is why it usually should not be overridden.

![](/assets/images/java/servlet/an-http-servlet-handling-get-and-post-requests.png)

An HTTP servlet can override the `doPut()` and `doDelete()` methods to handle `PUT` and `DELETE` requests, respectively.

However, HTTP servlets generally don't touch `doHead()`, `doTrace()`, or `doOptions()`.
For these, the default implementations are almost always sufficient.

## Request + Response

The remainder in the `javax.servlet` and `javax.servlet.http` packages are largely support classes.
For example, 

- the `ServletRequest` and `ServletResponse` classes
  in `javax.servlet` provide access to generic server requests and responses,
- while `HttpServletRequest` and `HttpServletResponse` in `javax.servlet.http`
  provide access to HTTP requests and responses.

```text
javax.servlet ---> ServletRequest + ServletResponse
javax.servlet.http ---> HttpServletRequest + HttpServletResponse
```

The `javax.servlet.http` package also contains an `HttpSession` class
that provides built-in session tracking functionality and
a `Cookie` class that allows you to quickly set up and process HTTP cookies.

> HttpSession + Cookie





