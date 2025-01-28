---
title: "java.net.http.HttpResponse"
sequence: "103"
---

```java
public interface HttpResponse<T> {
    //
}
```

## HttpResponse

```java
public interface HttpResponse<T> {
    //
}
```

```text
                                 ┌─── version()
                                 │
                                 ├─── statusCode()
                                 │
                ┌─── response ───┼─── uri()
                │                │
                │                ├─── headers()
HttpResponse ───┤                │
                │                └─── body()
                │
                └─── request ────┼─── request()
```

## HttpResponse.ResponseInfo

```java
public interface HttpResponse<T> {
    interface ResponseInfo {
        int statusCode();

        HttpHeaders headers();

        HttpClient.Version version();
    }
}
```


