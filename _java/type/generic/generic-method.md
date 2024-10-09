---
title: "Generic Method"
sequence: "107"
---

A **generic method** is a method that is able to take instances of any reference type.

```java
// Note that this class is not generic
public class Utils {
    public static <T> T comma(T a, T b) {
        return a;
    }
}
```

## What is a generic method?

**A method with type parameters**.

Not only types can be generic, but methods can be generic, too.
**Static and non-static methods** as well as **constructors** can have type parameters.
The syntax for declaration of the formal type parameters is similar to the syntax for generic types.
The type parameter section is **delimited by angle brackets** and appears **before the method's return type**.
Its syntax and meaning is identical to the type parameter list of a generic type.

Here is the example of a generic `max` method that computes the greatest value in a collection of elements of an unknown type `A`.

代码示例（简化版）：

```java
import java.util.Collection;
import java.util.Iterator;

public class Collections {
    public static <A extends Comparable<A>> A max(Collection<A> coll) {
        Iterator<A> it = coll.iterator();
        A candidate = it.next();
        while (it.hasNext()) {
            A next = it.next();
            if (candidate.compareTo(next) < 0) {
                candidate = next;
            }
        }
        return candidate;
    }
}
```

The `max` method has one type parameter, named `A`.
It is a place holder for the element type of the collection that the method works on.
The type parameter has a bound; it must be a type `A` that is a subtype of `Comparable<A>`,
i.e., a type that can be compared to elements of itself.

代码示例（`java.util.Collections`）：

```java
import java.util.Collection;
import java.util.Iterator;

public class Collections {
    public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll) {
        Iterator<? extends T> it = coll.iterator();
        T candidate = it.next();

        while (it.hasNext()) {
            T next = it.next();
            if (next.compareTo(candidate) > 0) {
                candidate = next;
            }
        }
        return candidate;
    }
}
```

## 调用

**Usually by calling it. Type arguments for generic methods need not be provided explicitly; they are almost always automatically inferred**.

Generic methods are invoked like regular non-generic methods. The type parameters are inferred from the invocation context.

Example (of invocation of a generic method; taken from the preceding item):

```java
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

public class HelloWorld {
    public static <A extends Comparable<A>> A max(Collection<A> coll) {
        Iterator<A> it = coll.iterator();
        A candidate = it.next();
        while (it.hasNext()) {
            A next = it.next();
            if (candidate.compareTo(next) < 0) {
                candidate = next;
            }
        }
        return candidate;
    }

    public static void main(String[] args) {
        List<String> strList = new ArrayList<>();
        strList.add("Hello");
        strList.add("World");

        String maxElement = HelloWorld.max(strList);
        System.out.println(maxElement);
    }
}
```

In our example, the compiler would automatically invoke an instantiation of the `max` method with the type argument `Long`,
that is, the formal type parameter `A` is replaced by type `Long`.
**Note that we do not have to explicitly specify the type argument.
The compiler automatically infers the type argument by taking a look at the type of the arguments provided to the method invocation**.
The compiler finds that a `Collection<A>` is asked for and that a `LinkedList<Long>` is provided.
From this information the compiler concludes at compile time that `A` must be replaced by `Long`.
