---
title: "javax.servlet Package"
sequence: "101"
---

## The javax.servlet Package

![](/assets/images/java/servlet/java-servlet-package-prominent-members.png)

At the center of Servlet technology is `Servlet`,
an interface that all servlet classes must implement either directly or indirectly.
You implement it directly when you write a servlet class that implements `Servlet`.
You implement it indirectly when you extend a class that implements this interface.

> 核心是 Servlet 接口

The `Servlet` interface defines a contract between **a servlet** and **the servlet container**.
The contract boils down to the promise by
**the servlet container to load the servlet class into memory and call specific methods on the servlet instance.**
There can **only be one instance for each servlet type in an application**.

> Servlet 定义了一个 contract

A user request causes the servlet container to call a servlet's `service` method,
passing an instance of `ServletRequest` and an instance of `ServletResponse`.
The `ServletRequest` encapsulates the current HTTP request
so that servlet developers do not have to parse and manipulate raw HTTP data.
The `ServletResponse` represents the HTTP response for the
current user and makes it easy to send response back to the user.

> 引出 ServletRequest 和 ServletResponse

For **each application** the servlet container also creates an instance of `ServletContext`.
This object encapsulates the environment details of the context (application).
There is only one `ServletContext` for each context.
For **each servlet instance**, there is also a `ServletConfig`
that encapsulates the servlet configuration.

> 引出 ServletContext 和 ServletConfig
