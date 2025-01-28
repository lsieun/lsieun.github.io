---
title: "Proxy"
sequence: "110"
---

```text
                          ┌─── getProxyClass(ClassLoader loader, Class<?>... interfaces)
         ┌─── class ──────┤
         │                └─── isProxyClass(Class<?> cl)
         │
Proxy ───┼─── instance ───┼─── newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)
         │
         │
         └─── handler ────┼─── getInvocationHandler(Object proxy)
```

## Proxy

```java
public class Proxy implements java.io.Serializable {
    protected InvocationHandler h;

    private Proxy() {
    }

    protected Proxy(InvocationHandler h) {
        Objects.requireNonNull(h);
        this.h = h;
    }
}
```

## InvocationHandler

```java
public interface InvocationHandler {
    Object invoke(Object proxy, Method method, Object[] args) throws Throwable;
}
```

