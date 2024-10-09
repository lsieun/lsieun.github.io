---
title: "Generic Unchecked Warning"
sequence: "129"
---

When you program with generics, you will see many compiler warnings:

- unchecked cast warnings
- unchecked method invocation warnings
- unchecked generic array creation warnings
- unchecked conversion warnings

## 1. Unchecked Warnings

### 1.1. unchecked conversion warnings

```java
import java.util.Set;
import java.util.HashSet;

public class HelloWorld {
    public void test() {
        // warning: unchecked conversion
        Set<String> s = new HashSet();
    }
}
```

```bash
$ javac -Xlint:all HelloWorld.java
warning: [unchecked] unchecked conversion
                Set<String> s = new HashSet();
                                ^
  required: Set<String>
  found:    HashSet
```

### 1.2. unchecked cast warnings

```java
import java.util.Arrays;

public class HelloWorld {
    public int size;
    public Object[] elementData;

    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            // Make a new array of a's runtime type, but my contents:
            return (T[]) Arrays.copyOf(elementData, size, a.getClass());
        System.arraycopy(elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }
}
```

```bash
$ javac -Xlint:all HelloWorld.java 
HelloWorld.java:10: warning: [unchecked] unchecked cast
            return (T[]) Arrays.copyOf(elementData, size, a.getClass());
                                      ^
  required: T[]
  found:    Object[]
  where T is a type-variable:
    T extends Object declared in method <T>toArray(T[])
1 warning
```

**Unchecked casts** are simply casts which don't actually result in a `checkcast` instruction in the bytecode.

```java
public static <T> T unchecked(Object obj) {
    return (T)obj; //unchecked cast warning
}
```

Here, it's an unchecked cast because the erasure of `T` is `Object`, so it's effectively a no-op, because `obj` is already an `Object`.

But the pernicious thing is that there is a checked cast inserted at the call site:

```java
Exception except = Generics.<Exception>unchecked(str);
               // ^ cast here!
```

Upon erasure, the code that is effectively executed is:

```java
Exception except = (Exception) Generics.unchecked(str);
```

and this fails with a `ClassCastException`. But you don't get warned about that, because the method's return type says that this will be safe, and so the compiler trusts that it is safe at the call site.

There is no way at the call site to know that the unchecked method is doing something dangerous. In fact, the only thing it could do which is safe would be to return `null`. But the compiler doesn't consider whether it is doing this or not: it simply takes the unchecked method's claim at face value.

how is the use of the `unchecked()` method different from casting the reference directly?

It's not, really. The only difference is that you're implicitly casting via `Object`. So whilst this doesn't compile:

```java
Exception except = (Exception) str;
```

this does:

```java
Exception except = (Exception) (Object) str;
```

and would fail at runtime with the same `ClassCastException`.

## 2. SuppressWarnings annotation

The `SuppressWarning`s annotation can be used at any granularity, from an individual local variable declaration to an entire class. Always use the `SuppressWarning`s annotation on the smallest scope possible. Typically this will be **a variable declaration** or **a very short method or constructor**. Never use `SuppressWarning`s on **an entire class**. Doing so could mask critical warnings.

If you find yourself using the `SuppressWarning`s annotation on **a method or constructor** that's more than one line long, you may be able to move it onto **a local variable declaration**. You may have to declare a new local variable, but it's worth it.

For example, consider this `toArray` method, which comes from `ArrayList`:

```java
    @SuppressWarnings("unchecked")
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            // Make a new array of a's runtime type, but my contents:
            return (T[]) Arrays.copyOf(elementData, size, a.getClass());
        System.arraycopy(elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }
```

It is illegal to put a `SuppressWarning`s annotation on the `return` statement, because it isn't a declaration. You might be tempted to put the annotation on the **entire method**, but don't. Instead, declare **a local variable** to hold the return value and annotate its declaration, like so:

```java
// Adding local variable to reduce scope of @SuppressWarnings
public <T> T[] toArray(T[] a) {
    if (a.length < size) {
        // This cast is correct because the array we're creating
        // is of the same type as the one passed in, which is T[].
        @SuppressWarnings("unchecked")
        T[] result = (T[]) Arrays.copyOf(elements, size, a.getClass());
        return result;
    }

    System.arraycopy(elements, 0, a, 0, size);
    if (a.length > size)
        a[size] = null;

    return a;
}
```

