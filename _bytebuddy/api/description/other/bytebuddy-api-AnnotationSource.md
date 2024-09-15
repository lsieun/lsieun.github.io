---
title: "AnnotationSource"
sequence: "AnnotationSource"
---

## API 设计

### AnnotationSource

```java
public interface AnnotationSource {
    AnnotationList getDeclaredAnnotations();
}
```

### 具体实现

#### Explicit

```java
public interface AnnotationSource {
    class Explicit implements AnnotationSource {
        private final List<? extends AnnotationDescription> annotations;
    }
}
```
