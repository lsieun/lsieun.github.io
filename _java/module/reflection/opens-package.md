---
title: "opens package"
sequence: "104"
---



## opens

An open package gives run-time access (including deep reflection) to its types to any module,
but no compile-time access.
This avoids others using your implementation code accidentally at compile-time,
while frameworks can do their magic without problems at run-time.
When only run-time access is required, opens is a good choice in most cases.
**Remember that an open package is not truly encapsulated.**
Another module can always access the package by using reflection.

> Reflection本来就是一个runtime的技术，open packages也是在runtime时生效。

## qualified opens

```java
module deep.reflection {
    exports api;

    opens internal to library;
}
```

```text
opens lsieun.reflection.open to spring.core, spring.beans, spring.context;
```


