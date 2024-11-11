---
title: "String Concat"
sequence: "101"
---

## JDK: String.join

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {

    public static String join(CharSequence delimiter, CharSequence... elements) {
        // Number of elements not likely worth Arrays.stream overhead.
        StringJoiner joiner = new StringJoiner(delimiter);
        for (CharSequence cs: elements) {
            joiner.add(cs);
        }
        return joiner.toString();
    }
    
    public static String join(CharSequence delimiter,
                              Iterable<? extends CharSequence> elements) {
        StringJoiner joiner = new StringJoiner(delimiter);
        for (CharSequence cs: elements) {
            joiner.add(cs);
        }
        return joiner.toString();
    }
}
```

示例一：

```java
public class TextJoin {
    public static void main(String[] args) {
        String message = String.join("-", "Java", "is", "cool");
        System.out.println(message);
    }
}
```

```text
Java-is-cool
```

示例二：

```java
import java.util.List;

public class TextJoin {
    public static void main(String[] args) {
        List<String> strings = List.of("Java", "is", "cool");
        String message = String.join(" ", strings);
        System.out.println(message);
    }
}
```

```text
Java is cool
```

## Collectors.joining

```java
import java.io.Serializable;
import java.lang.reflect.Type;
import java.lang.reflect.TypeVariable;
import java.util.Arrays;
import java.util.stream.Collectors;

public class Main<T,S extends Number & Serializable, U extends Number, V extends Serializable> {

    public static void main(String[] args) throws NoSuchMethodException {
        Class<?> clazz = Main.class;
        TypeVariable<?>[] typeParameters = clazz.getTypeParameters();
        for (TypeVariable<?> tv : typeParameters) {
            String str = typeVarBounds(tv);
            System.out.println(str);
        }
    }

    private static String typeVarBounds(TypeVariable<?> typeVar) {
        Type[] bounds = typeVar.getBounds();
        if (bounds.length == 1 && bounds[0].equals(Object.class)) {
            return typeVar.getName();
        }
        else {
            return typeVar.getName() + " extends " +
                    Arrays.stream(bounds)
                            .map(Type::getTypeName)
                            .collect(Collectors.joining(" & "));
        }
    }
}
```

```text
T
S extends java.lang.Number & java.io.Serializable
U extends java.lang.Number
V extends java.io.Serializable
```

