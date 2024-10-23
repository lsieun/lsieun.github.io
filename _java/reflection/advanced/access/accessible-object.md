---
title: "AccessibleObject"
sequence: "102"
---

```java
public class AccessibleObject implements AnnotatedElement {
    // @Since 9
    public final boolean canAccess(Object obj);

    // @Since 9
    public final boolean trySetAccessible();
}
```

```text
                                                           ┌─── isAccessible()
                                               ┌─── is ────┤
                                               │           └─── canAccess(Object obj)
                                               │
                            ┌─── access ───────┼─── try ───┼─── trySetAccessible()
                            │                  │
                            │                  │           ┌─── setAccessible(boolean flag)
                            │                  └─── do ────┤
                            │                              └─── setAccessible(AccessibleObject[] array, boolean flag)
AccessibleObject: member ───┤
                            │                  ┌─── is ─────────┼─── isAnnotationPresent(Class<? extends Annotation> annotationClass)
                            │                  │
                            │                  │                ┌─── getAnnotation(Class<T> annotationClass)
                            │                  ├─── single ─────┤
                            └─── annotation ───┤                └─── getDeclaredAnnotation(Class<T> annotationClass)
                                               │
                                               │                ┌─── getAnnotationsByType(Class<T> annotationClass)
                                               │                │
                                               │                ├─── getDeclaredAnnotationsByType(Class<T> annotationClass)
                                               └─── multiple ───┤
                                                                ├─── getAnnotations()
                                                                │
                                                                └─── getDeclaredAnnotations()
```

```text
                                                  ┌─── Constructor
                               ┌─── Executable ───┤
AccessibleObject: hierarchy ───┤                  └─── Method
                               │
                               └─── Field
```


