---
title: "Open Module"
sequence: "104"
---

- open
  - deep reflection
  - strong encapsulation

```java
open module lsieun.utils {
    requires transitive lsieun.core;

    exports lsieun.utils;
}
```

**Opening a whole module is somewhat crude.**
It's convenient for when you can't be sure what types are used at run-time by a library or framework.
As such, **open modules can play a crucial role in migration scenarios** when introducing modules into a codebase.

However, when you know which packages need to be open (and in most cases, you should),
you can selectively open them from a normal module:

```java
module deep.reflection.module {
    exports api;

    opens internal;
}
```

An open module is a module that gives run-time access to all its packages.
This does not grant compile-time access to packages, which is exactly what we want for our migrated code.
If a package needs to be used at compile-time, it must be exported.
Create an open module first to avoid reflection-related problems.
This helps you focus on `requires` and compile-time usage (`exports`) first.
Once the application is working again, we can fine-tune run-time access to the packages
as well by removing the `open` keyword from the module, and be more specific about which packages should be open.





