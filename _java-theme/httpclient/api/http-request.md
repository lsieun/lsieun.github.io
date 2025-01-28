---
title: "java.net.http.HttpRequest"
sequence: "102"
---

## HttpRequest

```java
public abstract class HttpRequest {
    //
}
```

```text
HttpRequest --> HttpRequest.Builder
```

`HttpRequest` is an object that represents the request we want to send.
New instances can be created using `HttpRequest.Builder`.

```java
public abstract class HttpRequest {
    public static HttpRequest.Builder newBuilder() {
        return new HttpRequestBuilderImpl();
    }

    public static HttpRequest.Builder newBuilder(URI uri) {
        return new HttpRequestBuilderImpl(uri);
    }

    public static Builder newBuilder(HttpRequest request, BiPredicate<String, String> filter) {
        // ...
    }
}
```

We can get it by calling `HttpRequest.newBuilder()`.

## HttpRequest.Builder

`Builder` class provides a bunch of methods that we can use to configure our request.

```text
                                       ┌─── uri ──────────┼─── uri(URI uri)
                                       │
                                       ├─── version ──────┼─── version(HttpClient.Version version)
                                       │
                                       │                  ┌─── header(String name, String value)
                                       │                  │
                                       ├─── header ───────┼─── headers(String... headers)
                                       │                  │
                                       │                  └─── setHeader(String name, String value)
                                       │
                                       │                  ┌─── GET()
                       ┌─── builder ───┤                  │
                       │               │                  ├─── POST(BodyPublisher bodyPublisher)
                       │               │                  │
                       │               ├─── method ───────┼─── PUT(BodyPublisher bodyPublisher)
                       │               │                  │
                       │               │                  ├─── DELETE()
HttpRequest.Builder ───┤               │                  │
                       │               │                  └─── method(String method, BodyPublisher bodyPublisher)
                       │               │
                       │               ├─── connection ───┼─── timeout(Duration duration)
                       │               │
                       │               └─── copy ─────────┼─── copy()
                       │
                       └─── request ───┼─── build()
```

## HttpRequest.BodyPublisher

```java
public abstract class HttpRequest {
    public interface BodyPublisher extends Flow.Publisher<ByteBuffer> {
        long contentLength();
    }
}
```

```java
public final class Flow {
    
}
```
