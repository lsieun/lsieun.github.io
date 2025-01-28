---
title: "Meta Annotations"
sequence: "101"
---

## Intro

Meta-annotation types are used to annotate other annotation type declarations.
The following are meta-annotation types:

- Target
- Retention
- Inherited
- Documented
- Repeatable

Meta-annotation types are part of the Java class library. They are declared in the `java.lang.annotation` package.

Note: The `java.lang.annotation` package contains a `Native` annotation type, which is not a meta-annotation.
It is used to annotate fields indicating that the field may be referenced from native code.
It is a marker annotation.
Typically, it is used by tools that generate some code based on this annotation.

```text
                        ┌─── super ────┼─── Annotation
                        │
                        │                            ┌─── Retention
                        │              ┌─── time ────┤
                        │              │             └─── RetentionPolicy
                        │              │
                        │              │             ┌─── Target
                        │              ├─── space ───┤
                        ├─── meta ─────┤             └─── ElementType
                        │              │
java.lang.annotation ───┤              │
                        │              │             ┌─── Inherited
                        │              │             │
                        │              └─── other ───┼─── Repeatable
                        │                            │
                        │                            └─── Documented
                        ├─── native ───┼─── Native
                        │
                        │              ┌─── AnnotationFormatError
                        │              │
                        └─── error ────┼─── AnnotationTypeMismatchException
                                       │
                                       └─── IncompleteAnnotationException
```







## Source Code

JDK 除了在 `java.lang` 下提供了 4 个基本的 Annotation 之外，还在 `java.lang.annotation` 包下提供了 4 个 Meta Annotation，这 4 个 Meta
Annotation 都用于修饰其他的 Annotation。

4 个 Meta Annoation:

- `@Retention`
- `@Target`
- `@Documented`
- `@Inherited`





