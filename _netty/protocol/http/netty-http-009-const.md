---
title: "Http 常量"
sequence: "109"
---

[UP](/netty.html)

## HttpVersion

```java
package io.netty.handler.codec.http;

public class HttpVersion implements Comparable<HttpVersion> {
    public static final HttpVersion HTTP_1_0 = new HttpVersion("HTTP", 1, 0, false, true);
    public static final HttpVersion HTTP_1_1 = new HttpVersion("HTTP", 1, 1, true, true);
}
```

## HttpResponseStatus

```java
package io.netty.handler.codec.http;

public class HttpResponseStatus implements Comparable<HttpResponseStatus> {
    public static final HttpResponseStatus OK = newStatus(200, "OK");
}
```

## Header

### HttpHeaderNames

```java
package io.netty.handler.codec.http;

public final class HttpHeaderNames {
    public static final AsciiString ACCEPT = AsciiString.cached("accept");

    public static final AsciiString CONNECTION = AsciiString.cached("connection");
    
    // ...
}
```

### HttpHeaderValues

```java
package io.netty.handler.codec.http;

public final class HttpHeaderValues {
    public static final AsciiString APPLICATION_JSON = AsciiString.cached("application/json");

    public static final AsciiString KEEP_ALIVE = AsciiString.cached("keep-alive");
}
```
