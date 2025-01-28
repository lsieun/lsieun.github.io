---
title: "ElementMatcher"
sequence: "101"
---

An element matcher is used as a predicate for identifying code elements
such as **types**, **methods**, **fields** or **annotations**.

They are similar to Java 8's `Predicate`s but compatible to Java 6 and Java 7 and represent a functional interface.

They can be chained by using instances of `ElementMatcher.Junction`.

```java
interface Junction<S> extends ElementMatcher<S> {
    <U extends S> Junction<U> and(ElementMatcher<? super U> other);
    <U extends S> Junction<U> or(ElementMatcher<? super U> other);
}
```

## 类

```text
                                                                 ┌─── Conjunction(C)
                                                                 │
ElementMatcher(I) ───┼─── Junction(I) ───┼─── AbstractBase(A) ───┼─── Disjunction(C)
                                                                 │
                                                                 └─── ForNonNullValues(A)
```

其中，`I` 表示接口（interface），`A` 表示抽象类（abstract class），`C` 表示具体的类（class）。

### ElementMatcher

```java
public interface ElementMatcher<T> {
    boolean matches(T target);
}
```

### Junction

```java
public interface ElementMatcher<T> {
    interface Junction<S> extends ElementMatcher<S> {
        <U extends S> Junction<U> and(ElementMatcher<? super U> other);

        <U extends S> Junction<U> or(ElementMatcher<? super U> other);
    }
}
```

### AbstractBase

```java
public interface ElementMatcher<T> {
    interface Junction<S> extends ElementMatcher<S> {
        <U extends S> Junction<U> and(ElementMatcher<? super U> other);

        <U extends S> Junction<U> or(ElementMatcher<? super U> other);
    }
}
```




