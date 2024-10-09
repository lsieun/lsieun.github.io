---
title: "method handles Intro"
sequence: "101"
---

## Method handles

### Reflection 存在的问题

Reflection is a powerful technique for doing runtime tricks,
but it has a number of **design flaws** (hindsight is 20/20, of course),
and it is definitely showing its age now.
**One key problem with reflection is performance**,
especially since reflective calls are difficult for the just-in-time (JIT) compiler to **inline**.

> reflection 有 design flaws。第一个问题就是 performance

This is bad, because **inlining** is very important to JIT compilation in several ways,
not the least of which is because it's usually the first optimization applied and
it opens the door to other techniques (such as escape analysis and dead code elimination).

> JIT ---> inlining

A second problem is that **reflective calls are linked every time** the call site of `Method.invoke()` is encountered.
That means, for example, that security access checks are performed.
This is very wasteful because the check will typically either succeed or fail on the first call,
and if it succeeds, it will continue to do so for the life of the program.
Yet, **reflection does this linking over and over again**.
Thus, reflection incurs a lot of unnecessary cost by relinking and wasting CPU time.

> 第二个问题就是 reflective calls are linked every time

### MethodHandle 来解决

To solve these problems (and others),
Java 7 introduced a new API, `java.lang.invoke`,
which is often casually called **method handles** due to the name of the main class it introduced.

> java.lang.invoke --> method handles

A **method handle (MH)** is Java's version of a **type-safe function pointer**.
It's a way of referring to a method that the code might want to call,
similar to a `Method` object from Java reflection.
The `MH` has an `invoke()` method that actually executes the underlying method, in just the same way as reflection.

> method handle 的功能是 type-safe function pointer

At one level, **MHs are really just a more efficient reflection mechanism** that's closer to the metal;
anything represented by an object from the Reflection API can be converted to an equivalent MH.
For example, a reflective `Method` object can be converted to an MH using `Lookup.unreflect()`.
The MHs that are created are usually a more efficient way to access the underlying methods.

> closer to the metal 更接近於底层的

```java
public class MethodHandles {
    public static final class Lookup {
        public MethodHandle unreflect(Method m) throws IllegalAccessException;
    }
}
```

MHs can be adapted, via helper methods in the `MethodHandles` class,
in a number of ways such as by composition and the partial binding of method arguments (currying).

**Normally, method linkage requires exact matching of type descriptors.**
However, the `invoke()` method on an MH has a **special polymorphic signature**
that allows linkage to proceed regardless of the signature of the method being called.

At runtime, the signature at the `invoke()` call site should look like you are calling the referenced method directly,
which avoids **type conversions** and **autoboxing costs** that are typical with reflected calls.

Because Java is a statically typed language,
the question arises as to **how much type-safety can be preserved**
when such a fundamentally dynamic mechanism is used.
The MH API addresses this by use of a type called `MethodType`,
which is an immutable representation of the arguments that a method takes: the signature of the method.

The internal implementation of MHs was changed during the lifetime of Java 8.
The new implementation is called lambda forms,
and it provided a dramatic performance improvement with MHs now being better than reflection for many use cases.




## Reference

- [Method Handles in Java](https://www.baeldung.com/java-method-handles)
- [MethodHandles.privateLookupIn](https://stackoverflow.com/a/60289488/10202942)
