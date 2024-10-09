---
title: "Raw Type"
sequence: "105"
---

A generic type without type arguments is called **raw type** and is only allowed for reasons of compatibility with non-generic Java code.

**Use of raw types is discouraged.**

> 现在

The Java Language Specification even states that it is possible that future versions of the Java programming language will disallow the use of raw types.

> 未来

## 测试

### assignment compatibility

The raw type is assignment compatible with all instantiations of the generic type.
Assignment of an instantiation of a generic type to the corresponding raw type is permitted without warnings;
assignment of the raw type to an instantiation yields an "unchecked conversion" warning.

```text
ArrayList rawList = new ArrayList();
ArrayList<String> strList = new ArrayList<>();
rawList = strList;
strList = rawList;      // unchecked warning
```

The "unchecked" warning indicates that the compiler does not know whether the raw type `ArrayList` really contains strings.
A raw type `ArrayList` can in principle contain any type of object and is similar to a `ArrayList<Object>`.

## Unchecked Warning

```java
public class HelloWorld {
    public void test() {
        // Use the Wrapper<T> generic type as a raw type Wrapper
        Wrapper rawType = new Wrapper("Hello"); // An unchecked warning

        // Using the Wrapper<T> generic type as a parameterized type Wrapper<String>
        Wrapper<String> genericType = new Wrapper<String>("Hello");

        // Assigning the raw type to the parameterized type
        genericType = rawType; // An unchecked warning

        // Assigning the parameterized type to the raw type
        rawType = genericType;
    }
}
```

```text
$ javac -Xlint:unchecked HelloWorld.java

HelloWorld.java:4: warning: [unchecked] unchecked call to Wrapper(T) as a member of the raw type Wrapper
        Wrapper rawType = new Wrapper("Hello"); // An unchecked warning
                          ^
  where T is a type-variable:
    T extends Object declared in class Wrapper
HelloWorld.java:10: warning: [unchecked] unchecked conversion
        genericType = rawType; // An unchecked warning
                      ^
  required: Wrapper<String>
  found:    Wrapper
2 warnings
```

## Raw Type VS. Unbounded Wildcard

What is the difference between the unbounded wildcard parameterized type and the raw type?

**The compiler issues error messages for an unbounded wildcard parameterized type while it only reports "unchecked" warnings for a raw type**.

编译器对于 unbounded wildcard parameterized type 的要求更严格，对于 raw type 要宽松一些。

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public void test() {
        List<?> wildcardList = new ArrayList<>();
        List rawList = new ArrayList();
        List<String> concreteList = new ArrayList<>();

        wildcardList = concreteList; // fine
        rawList = concreteList;      // fine

        wildcardList = rawList;      // fine
        rawList = wildcardList;      // fine

        concreteList = wildcardList; // error
        concreteList = (List<String>) wildcardList; // Unchecked cast: 'java.util.List<capture<?>>' to 'java.util.List<java.lang.String>'
        concreteList = rawList;      // Unchecked assignment: 'java.util.List' to 'java.util.List<java.lang.String>'
    }
}
```

In code written after the introduction of genericity into the Java programming language
you would usually **avoid use of raw types**,
because it is discouraged and raw types might no longer be supported in future versions of the language
(according to the Java Language Specification).
Instead of the raw type you can use the unbounded wildcard parameterized type.

The **raw type** and the **unbounded wildcard parameterized type** have **a lot in common**.
Both act as kind of a supertype of all instantiations of the corresponding generic type.
Both are so-called reifiable types.
Reifiable types can be used in `instanceof` expressions and as the component type of arrays,
where non-reifiable types (such as concrete and bounded wildcard parameterized type) are not permitted.

> 共同点

In other words, the raw type and the unbounded wildcard parameterized type are semantically equivalent.
**The only difference** is that **the compiler applies stricter rules to the unbounded wildcard parameterized type than to the
corresponding raw type**.

- Certain operations performed on the **raw type** yield "unchecked" warnings.
- The same operations, when performed on the corresponding **unbounded wildcard parameterized type**, are rejected as errors.
