---
title: "Parameterized Type"
sequence: "103"
---

## Concrete Parameterized Type

### 示例一：List<String>

```java
import java.util.List;

public class HelloWorld<A, B> {
    private List<String> value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.util.List;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .typeVariable("A")
                .typeVariable("B");

        TypeDescription.Generic listOfString = TypeDescription.Generic.Builder.parameterizedType(List.class, String.class).build();

        builder = builder.defineField("value", listOfString, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
TypeDescription.Generic listOfString = TypeDescription.Generic.Builder.parameterizedType(listType, strType).build();
```

### 示例二：List<List<String>>

```java
import java.util.List;

public class HelloWorld<A, B> {
    private List<List<String>> value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.util.List;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .typeVariable("A")
                .typeVariable("B");

        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDescription.Generic listOfString = TypeDescription.Generic.Builder.parameterizedType(listType, strType).build();
        TypeDescription.Generic targetType = TypeDescription.Generic.Builder.parameterizedType(listType, listOfString).build();

        builder = builder.defineField("value", targetType, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例三：Map<Integer, Date>

```java
import java.util.Date;
import java.util.Map;

public class HelloWorld<A, B> {
    private Map<Integer, Date> value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.util.Date;
import java.util.Map;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .typeVariable("A")
                .typeVariable("B");

        TypeDescription mapType = TypeDescription.ForLoadedType.of(Map.class);
        TypeDescription intType = TypeDescription.ForLoadedType.of(Integer.class);
        TypeDescription dateType = TypeDescription.ForLoadedType.of(Date.class);
        TypeDescription.Generic mapOfIntAndDate = TypeDescription.Generic.Builder.parameterizedType(mapType, intType, dateType).build();

        builder = builder.defineField("value", mapOfIntAndDate, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## Wildcard

### Unbounded Wildcard: List<?>

```java
import java.util.List;

public class HelloWorld<A, B> {
    private List<?> value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.util.List;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .typeVariable("A")
                .typeVariable("B");

        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription.Generic wildcard = TypeDescription.Generic.Builder.unboundWildcard();
        TypeDescription.Generic listOfWildcard = TypeDescription.Generic.Builder.parameterizedType(listType, wildcard).build();

        builder = builder.defineField("value", listOfWildcard, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### Lower Bound Wildcard: List<? super A>

```java
import java.util.List;

public class HelloWorld<A, B> {
    private List<? super A> value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.util.List;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .typeVariable("A")
                .typeVariable("B");

        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription.Generic boundedWildcard = TypeDescription.Generic.Builder.typeVariable("A").asWildcardLowerBound();
        TypeDescription.Generic listOfWildcard = TypeDescription.Generic.Builder.parameterizedType(listType, boundedWildcard).build();

        builder = builder.defineField("value", listOfWildcard, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### Upper Bound Wildcard: List<? extends A>

```java
import java.util.List;

public class HelloWorld<A, B> {
    private List<? extends A> value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.util.List;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .typeVariable("A")
                .typeVariable("B");

        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription.Generic boundedWildcard = TypeDescription.Generic.Builder.typeVariable("A").asWildcardUpperBound();
        TypeDescription.Generic listOfWildcard = TypeDescription.Generic.Builder.parameterizedType(listType, boundedWildcard).build();

        builder = builder.defineField("value", listOfWildcard, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### Bounded Wildcard

```java
import java.util.List;

public class HelloWorld<A, B> {
    private List<? extends List<A>> value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

import java.util.List;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .typeVariable("A")
                .typeVariable("B");

        TypeDescription.Generic A_type = TypeDescription.Generic.Builder.typeVariable("A").build();
        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription.Generic listOfA = TypeDescription.Generic.Builder.parameterizedType(listType, A_type).build();
        TypeDescription.Generic boundedWildcard = TypeDescription.Generic.Builder.of(listOfA).asWildcardUpperBound();
        TypeDescription.Generic listOfBoundedWildcard = TypeDescription.Generic.Builder.parameterizedType(listType, boundedWildcard).build();

        builder = builder.defineField("value", listOfBoundedWildcard, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

