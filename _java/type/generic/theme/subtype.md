---
title: "SubType"
sequence: "126"
---

## 1. concrete parameterized type

```java
public class Pair <X,Y> {
    private X first;
    private Y second;

    public Pair(X first, Y second) {
        this.first = first;
        this.second = second;
    }

    // Getter and Setter
}

public class Point extends Pair<Double, Double> {
    public Point(Double first, Double second) {
        super(first, second);
    }
}
```

## 2. wildcard parameterized type

Can I derive from a wildcard parameterized type? **No, a wildcard parameterized type is not a supertype**.

Let us scrutinize an example and see why a wildcard parameterized type cannot be a supertype. Consider the generic interface `Comparable`.

Example (of a generic interface):

```java
interface Comparable<T> {
    int compareTo(T arg);
}
```

If it were allowed to subtype from a wildcard instantiation of `Comparable`, neither we nor the compiler would know what the signature of the `compareTo` method would be.

Example (of illegal use of a wildcard parameterized type as a supertype):

```java
class MyClass implements Comparable <?> { // error
  public int compareTo(??? arg) { ... }
}
```

The signatures of methods of a wildcard parameterized type are undefined. We do not know what type of argument the `compareTo` method is supposed to accept. We can only subtype from concrete instantiations of the `Comparable` interface, so that the signature of the `compareTo` method is well-defined.

Example (of legal use of a concrete parameterized type as a supertype):

```java
class MyClass implements Comparable <MyClass> {  // fine
    public int compareTo(MyClass arg) { ... }
}
```

Note that the raw type is, of course, acceptable as a supertype, different from the wildcard parameterized types including the unbounded wildcard parameterized type.

Example (of legal use of a raw type as a supertype):

```java
class MyClass implements Comparable {          // fine
    public int compareTo(Object arg) { ... }
}
```
