---
title: "Object.equals"
sequence: "132"
---

## 1. How do I best implement the equals method of a generic type?

Override `Object.equals(Object)` as usual and perform the **type check** using the **unbounded wildcard instantiation**.

The recommended implementation of the `equals` method of a generic type looks like the one shown in the example below.  Conceivable alternatives are discussed and evaluated later.

Example (recommended implementation of equals ):

```java
class Triple<T> {
  private T fst, snd, trd;
  public Triple(T t1, T t2, T t3) {fst = t1; snd = t2; trd = t3;}
  ...
  public boolean equals( Object other) {
    if (this == other) return true;
    if (other == null) return false;
    if (this.getClass() != other.getClass()) return false;
    Triple<?> otherTriple = (Triple<?>) other;
    return (this.fst.equals(otherTriple.fst)
         && this.snd.equals(otherTriple.snd)
         && this.trd.equals(otherTriple.trd));
  }
}
```

equals 方法实现思路的总结：

- 第一步，判断“reference variable”的“值”（内存空间的地址）是否相等
- 第二步，判断“reference variable”所指向的内存空间的“类型”是否相等
- 第三步，判断“reference variable”所指向的内存空间的“内容”是否相等

Perhaps the greatest difficulty is the downcast to the `Triple` type, after **the check for type match** has been passed successfully. The most natural approach would be a cast to `Triple<T>`, because only objects of the same type are comparable to each other.

Example (not recommended):

```java
class Triple<T> {
  private T fst, snd, trd;
  public Triple(T t1, T t2, T t3) {fst = t1; snd = t2; trd = t3;}
  ...
  public boolean equals (Object other) {
    if (this == other) return true;
    if (other == null) return false;
    if (this.getClass() != other.getClass()) return false;
    Triple<T> otherTriple = (Triple<T>) other; // unchecked warning
    return (this.fst.equals(otherTriple.fst)
         && this.snd.equals(otherTriple.snd)
         && this.trd.equals(otherTriple.trd));
  }
}
```

The cast to `Triple<T>` results in an "unchecked cast" warning, because the target type of the cast is a **parameterized type**. Only the cast to `Triple<?>` is accepted without a warning. Let us try out a cast to `Triple<?>` instead of `Triple<T>`.

Example (better, but does not compile):

```java
class Triple<T> {
  private T fst, snd, trd;
  public Triple(T t1, T t2, T t3) {fst = t1; snd = t2; trd = t3;}
  ...
  public boolean equals (Object other) {
    if (this == other) return true;
    if (other == null) return false;
    if (this.getClass() != other.getClass()) return false;
    Triple<T> otherTriple = (Triple<?>) other; // error
    return (this.fst.equals(otherTri ple.fst)
         && this.snd.equals(otherTriple.snd)
         && this.trd.equals(otherTriple.trd));
  }
}
```

```txt
error: incompatible types
found   : Triple<capture of ?>
required: Triple<T>
            Triple<T> otherTriple = (Triple<?>)other;
                                    ^
```

This implementation avoids the"unchecked" cast, but does not compile because the compiler refuses to assign a `Triple<?>` to a `Triple<T>`.  This is because the compiler cannot ensure that the unbounded wildcard parameterized type `Triple<?>` matches the concrete parameterized type `Triple<T>`. To make it compile we have to change the type of the local variable `otherTriple` from `Triple<T>` to `Triple<?>`. This change leads us to the first implementation shown in this FAQ entry, which is the recommended way of implementing the `equals` method of a generic type.

### 1.1. Evaluation of the alternative implementations.

How do the two alternative implementations, the recommended one casting to `Triple<?>` and the not recommended one casting to `Triple<T>`, compare?  The recommended implementation compiles without warnings, which is clearly preferable when we strive for warning-free compilation of our programs.  Otherwise there is no difference in functionality or behavior, despite of the different cast expressions in the source code. At runtime both casts boils down to a cast to the raw type `Triple`.

If there is no difference in functionality and behavior and one of the implementations raises a warning, isn't there a type-safety problem? After all, "unchecked" warnings are issued to alert the programmer to potentially unsafe code. It turns out that in this particular cases all is fine. Let us see why.

With both implementations of `equals` it might happen that triples of different member types, like a `Triple<String>` and a `Triple<Number>`,  pass the check for type match via `getClass()` and the cast to `Triple<?>` (or `Triple<T>`). We would then compare members of different type with each other. For instance, if a `Triple<String>` and a `Triple<Number>` are compared, they would pass **the type check**, because they are both triples and we would eventually compare the `Number` members with the `String` members. Fortunately, the comparison of a `String` and a `Number` always yields `false`, because both `String.equals` and `Number.equals` return `false` in case of comparison with an object of an imcompatible type.

In general, every implementation of an `equals` method is responsible for performing **a check for type match** and to return `false` in case of mismach. This rule is still valid, even in the presence of Java generics, because the signature of `equals` is still the same as in pre-generic Java: the `equals` method takes an `Object` as an argument. Hence, the argument can be of any reference type and the implementation of `equals` must check **whether the argument is of an acceptable type** so that the actual comparison for equality makes sense and can be performed.

### 1.2. Yet another alternative.

It might seem natural to provide an `equals` method that has a more specific signature, such as a version of `equals` in class `Triple` that takes a `Triple<T>` as an argument. This way we would not need a type check in the first place. The crux is that a version of `equals` that takes a `Triple<T>` as an argument would not be an overriding version of `Object.equals(Object)`, because the `equals` method in `Object` is not generic and the compiler would not generate the necessary bridge methods.  We would have to provide the bridge method ourselves, which again would result in an "unchecked" warning.

Example (not recommended):

```java
class Triple<T> {
  private T fst, snd, trd;
  public Triple(T t1, T t2, T t3) {fst = t1; snd = t2; trd = t3;}
  ...
  public boolean equals (Triple<T> other) {
    if (this == other) return true;
    if (other == null) return false;
    return (this.fst.equals(other.fst)
         && this.snd.equals(other.snd)
         && this.trd.equals(other.trd));
  }
  public boolean equals(Object other) {
    return equals((Triple<T>) other);      // unchecked warning
  }
}
```

This implementation has the flaw of raising an "unchecked" warning and offers no advantage of the recommended implementation to make up for this flaw.
