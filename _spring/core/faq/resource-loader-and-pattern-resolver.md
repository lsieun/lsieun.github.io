---
title: "Resource - classpath: + classpath*:"
sequence: "102"
---

```java
package org.springframework.util;

public abstract class ResourceUtils {
    public static final String CLASSPATH_URL_PREFIX = "classpath:";

    public static final String FILE_URL_PREFIX = "file:";
}
```

```java
public interface ResourceLoader {
    String CLASSPATH_URL_PREFIX = ResourceUtils.CLASSPATH_URL_PREFIX;
}
```

```java
public interface ResourcePatternResolver extends ResourceLoader {
  String CLASSPATH_ALL_URL_PREFIX = "classpath*:";
}
```
