---
title: "Generic Backward Compatibility"
sequence: "151"
---

We know that the Java platform has a strong preference for **backward compatibility**.
The addition of generics in Java 5 was another example of where **backward compatibility** was an issue for a new language feature.

> backward compatibility

**The central question** was how to make a type system that allowed older,
non-generic collection classes to be used alongside with newer, generic collections.
The design decision was to achieve this by the use of casts:

```text
List someThings = getSomeThings();
// Unsafe cast, but we know that the
// contents of someThings are really strings
List<String> myStrings = (List<String>)someThings;
```

This means that `List` and `List<String>` are compatible as types, at least at some level.
Java achieves this compatibility by **type erasure**.
This means that **generic type parameters** are only visible at **compile time**— they are stripped out by `javac` and are not reflected in the **bytecode**.

> 解决 backward compatibility 的方法是使用 type erasure

**The mechanism of type erasure** gives rise to a difference in the type system seen by `javac` and that seen by the **JVM**.

## How does the compiler translate Java generics?

**By creating one unique byte code representation of each generic type (or method) and mapping all instantiations of the generic type (or method) to this unique representation**.

**The Java compiler** is responsible for translating **Java source code** that contains definitions and usages of generic types and methods into
**Java byte code** that the virtual machine can interpret. How does that translation work?

```txt
Java source code --> Java compiler --> Java byte code
```

A compiler that must translate a generic type or method (in any language, not just Java) has in principle **two choices**:

- **Code specialization**. The compiler generates a new representation for every instantiation of a generic type or method. For instance, the compiler would generate code for a list of integers and additional, different code for a list of strings, a list of dates, a list of buffers, and so on.
- **Code sharing**. The compiler generates code for only one representation of a generic type or method and maps all the instantiations of the generic type or method to the unique representation, performing type checks and type conversions where needed.

### Code specialization

Code specialization is the approach that C++ takes for its templates:

The C++ compiler generates executable code for every instantiation of a template.
The downside of code specialization of generic types is its potential for **code bloat**.
A list of integers and a list of strings would be represented in the executable code as two different types.
Note that code bloat is not inevitable in C++ and can generally be avoided by an experienced programmer.

### Code sharing

**Code specialization is particularly wasteful** in cases where the elements in a collection are references (or pointers),
because all references (or pointers) are of the same size and internally have the same representation.
There is no need for generation of mostly identical code for a list of references to integers and a list of references to strings.
Both lists could internally be represented by a list of references to any type of object.
The compiler just has to add a couple of casts whenever these references are passed in and out of the generic type or method.
Since in Java most types are reference types,
it deems natural that **Java** chooses **code sharing** as its technique for translation of generic types and methods.

The Java compiler applies the **code sharing** technique and creates one unique byte code representation of each generic type (or method).
The various instantiations of the generic type (or method) are mapped onto this unique representation by a technique that is called **type erasure**.
