---
title: "RestTemplate, RestOperations"
sequence: "102"
---

```java
public class RestTemplate extends InterceptingHttpAccessor implements RestOperations {
    
}
```

## RestOperations

```java
public interface RestOperations {
    
}
```

```text
                                            ┌─── getForEntity
                  ┌─── GET ─────────────────┤
                  │                         └─── getForObject
                  │
                  ├─── HEAD ────────────────┼─── headForHeaders
                  │
                  │                         ┌─── postForLocation
                  │                         │
                  ├─── POST ────────────────┼─── postForObject
                  │                         │
                  │                         └─── postForEntity
RestOperations ───┤
                  ├─── PUT ─────────────────┼─── put
                  │
                  ├─── PATCH ───────────────┼─── patchForObject
                  │
                  ├─── DELETE ──────────────┼─── delete
                  │
                  ├─── OPTIONS ─────────────┼─── optionsForAllow
                  │
                  ├─── exchange ────────────┼─── exchange
                  │
                  └─── General execution ───┼─── execute
```
