---
title: "Sealed Intro"
sequence: "102"
---

## 举例

`java.lang.reflect.Executable`

```java
public abstract sealed class Executable extends AccessibleObject
    implements Member, GenericDeclaration permits Constructor, Method {
    
}
```

```java
public final class Constructor<T> extends Executable {
    //
}
```

```java
public final class Method extends Executable {
    //
}
```
