---
title: "URLConnection: Security Considerations for URLConnections"
sequence: "108"
---

`URLConnection` objects are subject to all the usual security restrictions about making network connections, reading or writing files, and so forth. For instance, a `URLConnection` can be created by an untrusted applet only if the `URLConnection` is pointing to the host that the applet came from. However, the details can be a little tricky because different `URL` schemes and their corresponding connections can have different security implications. For example, a jar `URL` that points into the applet's own jar file should be fine. However, a file `URL` that points to a local hard drive should not be.

Before attempting to connect a `URL`, you may want to know whether the connection will be allowed. For this purpose, the `URLConnection` class has a `getPermission()` method:

```text
public Permission getPermission() throws IOException
```

This returns a `java.security.Permission` object that specifies what permission is needed to connect to the `URL`. **It returns `null` if no permission is needed** (e.g., there's no security manager in place). Subclasses of `URLConnection` return different subclasses of `java.security.Permission`. For instance, if the underlying `URL` points to `www.gwbush.com`, `getPermission()` returns a `java.net.SocketPermission` for the host `www.gwbush.com` with the connect and resolve actions.

