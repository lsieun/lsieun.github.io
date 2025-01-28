---
title: "HttpEntity"
sequence: "133"
---

- spring-web.jar
    - org.springframework.http.HttpEntity

The `HttpEntity` represents an HTTP request or response entity, consisting of headers and body.

```java
public class HttpEntity<T> {
    private final HttpHeaders headers;

    @Nullable
    private final T body;
}
```

- HttpEntity
    - RequestEntity
    - ResponseEntity
