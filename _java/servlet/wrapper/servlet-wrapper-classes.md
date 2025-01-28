---
title: "Servlet Wrapper Classes"
sequence: "102"
---

The Servlet API comes with four classes that are rarely used but could be very powerful,
`ServletRequestWrapper` and `ServletResponseWrapper` as well as
`HttpServletRequestWrapper` and `HttpServletResponseWrapper`.

The `ServletRequestWrapper` (and the three other wrapper classes) is convenient to use
because it provides the default implementation for each method
that calls the counterpart method in the wrapped `ServletRequest`.
By extending `ServletRequestWrapper`, you just need to override methods that you want to change.
Without `ServletRequestWrapper`, you would have to implement `ServletRequest` directly and
provide the implementation of every method in the interface.

```java
public class ServletRequestWrapper implements ServletRequest {
    private ServletRequest request;

    public ServletRequestWrapper(ServletRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        this.request = request;
    }
}
```
