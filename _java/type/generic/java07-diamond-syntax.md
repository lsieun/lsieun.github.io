---
title: "Diamond Syntax"
sequence: "103"
---

When we create an instance of a generic type,
the righthand side of the assignment statement repeats the value of the type parameter.
This is usually unnecessary, as the compiler can infer the values of the type parameters.
In modern versions of Java, we can leave out the repeated type values in what is called **diamond syntax**.

```text
List<String> list = new ArrayList<>();
```

## Generics and type inference

When generics found their way into the Java language,
they blew up the amount of the code developers had to write in order to satisfy the language syntax rules. For example:

```java
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class HelloWorld {
    public static void test() {
        Map<String, Collection<String>> map = new HashMap<String, Collection<String>>();
        for (Map.Entry<String, Collection<String>> entry : map.entrySet()) {
            // Some implementation here
        }
    }
}
```

The Java 7 release somewhat addressed this problem by making changes in the compiler and introducing the new diamond operator `<>`. For example:

```text
Map<String, Collection<String>> map = new HashMap<>();
```

The compiler is able to infer the generics type parameters from the left side and allows omitting them in the right side of the expression. **It was a significant progress towards making generics syntax less verbose**, however **the abilities of the compiler to infer generics type parameters were quite limited**. For example, the following code does not compile in Java 7( 在 Java 8 可以编译通过 ):

```java
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

public class HelloWorld {
    public static <T> void performAction(Collection<T> actions, Collection<T> defaults) {
        // Some implementation here
    }

    public static void test() {
        Collection<String> strings = new ArrayList<>();
        performAction(strings, Collections.emptyList());
    }
}
```

The Java 7 compiler cannot infer the type parameter for the `Collections.emptyList()` call and as such requires it to be passed explicitly:

```text
performAction(strings, Collections.<String>emptyList());
```

Luckily, the Java 8 release brings more enhancements into the compiler and, particularly,
into the type inference for generics so the code snippet shown above compiles successfully,
saving the developers from unnecessary typing.
