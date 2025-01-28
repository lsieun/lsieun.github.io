---
title: "Static Method"
sequence: "104"
---

## static methods

From now, interfaces may also include static methods, for example:

```java
package lsieun.advanced.design;

public interface InterfacesWithStaticMethods {
    static void createAction() {
        // Implementation here
    }
}
```

One may say that providing an implementation in the interface defeats the whole purpose of contract-based development,
but there are many reasons why these features were introduced into the Java language and
no matter how useful or confusing they are, they are there for you to use.
