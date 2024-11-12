---
title: "Generic Type"
sequence: "102"
---

## typeVariable

net.bytebuddy.dynamic.DynamicType.Builder#typeVariable(java.lang.String)

```text
                                                              ┌─── typeVariable(String symbol)
                                                              │
                                                              ├─── typeVariable(String symbol, Type... bound)
                                                              │
                                       ┌─── typeVariable() ───┼─── typeVariable(String symbol, List<? extends Type> bounds)
                                       │                      │
                                       │                      ├─── typeVariable(String symbol, TypeDefinition... bound)
DynamicType.Builder ───┼─── generic ───┤                      │
                                       │                      └─── typeVariable(String symbol, Collection<? extends TypeDefinition> bounds)
                                       │
                                       └─── transform() ──────┼─── transform(ElementMatcher<? super TypeDescription.Generic> matcher, Transformer<TypeVariableToken> transformer)
```

## 示例

### 示例一

```java
public class HelloWorld<A, B> {
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.typeVariable("A").typeVariable("B");

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例二

```java
import java.io.Serializable;

public class HelloWorld<A extends Number, B extends Serializable> {
    public HelloWorld() {
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

import java.io.Serializable;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.typeVariable("A", Number.class)
                .typeVariable("B", Serializable.class);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例三

```java
import java.io.Serializable;

public class HelloWorld<A extends Number & Cloneable, B extends Runnable & Serializable> {
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

import java.io.Serializable;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.typeVariable("A", Number.class, Cloneable.class)
                .typeVariable("B", Runnable.class, Serializable.class);

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例四

```java
public class Box<T> {
    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}
```

```java
public class HelloWorld extends Box<String> {
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();

        TypeDescription boxType = TypeDescription.ForLoadedType.of(Box.class);
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDescription.Generic boxOfString = TypeDescription.Generic.Builder.parameterizedType(boxType, strType).build();

        DynamicType.Builder<?> builder = byteBuddy.subclass(boxOfString)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

