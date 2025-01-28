---
title: "Servlet Container VS. Web Server"
sequence: "101"
---

Web Servers and Servlet Containers

A servlet is a Java-coded Web component that runs in a container.
It generates HTML content.
It is pure Java, so the benefits and restrictions of regular Java classes apply.
Servlets are compiled to platform-neutral bytecode.
Upon request, this bytecode file is loaded into a container.
Some containers (servlet engines) are integrated with the Web server,
while others are plug-ins or extensions to Web servers that run inside the JVM.
Servlets look the same as static Web pages (just a URL to the browser) to the client,
but are really complete programs capable of complex operations.

**The servlet container is an extension of a Web server** in the same way CGI, ASP, and PHP are.
A servlet functions like these, but the language is Java.
The servlet doesn't talk to the client directly.
The Web server does that. In a chain of processes,
the client sends a request to the Web server, which hands it to the container,
which hands it to the servlet (which sometimes hands it off yet again to a database or a JavaBean).
The response retraces the course from the servlet to the container to the Web server to the client.
Of course there are several other steps that happen too
(JSP may need to be converted to servlet, and the TCP/IP packet hops from node to node).
A snapshot of these steps is: Web server-> container-> servlet-> JavaBean-> DB.

```text
browser(web client) --> Web Server --> Servlet Container --> XxxServlet
```

The servlet architecture makes the container manage servlets through their lifecycle.
The container invokes a servlet upon an HTTP request,
providing that servlet with request information (stored in a request object) and the container configuration.
The servlet goes about its deed.
When finished, it hands back HTML and objects that hold information about the response.
The container then forms an HTTP response and returns it to the client.
