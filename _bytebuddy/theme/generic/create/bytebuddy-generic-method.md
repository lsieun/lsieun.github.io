---
title: "方法"
sequence: "105"
---

## 示例

### 示例一

```java
public class HelloWorld<A, B> {
    public <C> String test(A a, B b, C c) {
        return null;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

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
        TypeDescription.Generic B_type = TypeDescription.Generic.Builder.typeVariable("B").build();
        TypeDescription.Generic C_type = TypeDescription.Generic.Builder.typeVariable("C").build();

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .withParameter(A_type, "a")
                .withParameter(B_type, "b")
                .withParameter(C_type, "c")
                .typeVariable("C")
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import java.util.List;

public class HelloWorld<A, B> {
    public <C extends Number> String test(C c, List<C> list) {
        return null;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

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

        TypeDescription.Generic C_type = TypeDescription.Generic.Builder.typeVariable("C").build();
        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription.Generic listOfC = TypeDescription.Generic.Builder.parameterizedType(listType, C_type).build();

        builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
                .withParameter(C_type, "c")
                .withParameter(listOfC, "list")
                .typeVariable("C", Number.class)
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```java
import java.util.function.BiFunction;

public class HelloWorld<A, B> {
    public A test(A a, B b, BiFunction<? super A, ? extends A, ? extends B> c) {
        return null;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

import java.util.function.BiFunction;

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
        TypeDescription.Generic B_type = TypeDescription.Generic.Builder.typeVariable("B").build();
        TypeDescription.Generic wildcardSuperA = TypeDescription.Generic.Builder.of(A_type).asWildcardLowerBound();
        TypeDescription.Generic wildcardExtendsA = TypeDescription.Generic.Builder.of(A_type).asWildcardUpperBound();
        TypeDescription.Generic wildcardExtendsB = TypeDescription.Generic.Builder.of(B_type).asWildcardUpperBound();
        TypeDescription biFunctionType = TypeDescription.ForLoadedType.of(BiFunction.class);
        TypeDescription.Generic parameterizedType = TypeDescription.Generic.Builder.parameterizedType(biFunctionType, wildcardSuperA, wildcardExtendsA, wildcardExtendsB).build();

        builder = builder.defineMethod("test", A_type, Visibility.PUBLIC)
                .withParameter(A_type, "a")
                .withParameter(B_type, "b")
                .withParameter(parameterizedType, "c")
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 示例二

```java
import java.util.Date;
import java.util.List;
import java.util.Map;

public class HelloWorld<A, B> {
    public List<String> test(Map<Integer, Date> map) {
        return null;
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;

import java.util.Date;
import java.util.List;
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

        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription strType = TypeDescription.ForLoadedType.of(String.class);
        TypeDescription.Generic listOfString = TypeDescription.Generic.Builder.parameterizedType(listType, strType).build();

        TypeDescription mapType = TypeDescription.ForLoadedType.of(Map.class);
        TypeDescription intType = TypeDescription.ForLoadedType.of(Integer.class);
        TypeDescription dateType = TypeDescription.ForLoadedType.of(Date.class);
        TypeDescription.Generic mapOfIntAndDate = TypeDescription.Generic.Builder.parameterizedType(mapType, intType, dateType).build();

        builder = builder.defineMethod("test", listOfString, Visibility.PUBLIC)
                .withParameter(mapOfIntAndDate, "map")
                .intercept(FixedValue.nullValue());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 构造方法

```java
public class HelloWorld<A, B> {
    public <C> HelloWorld(A a, B b, C c) {
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodCall;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.typeVariable("A").typeVariable("B");

        TypeDescription.Generic A_type = TypeDescription.Generic.Builder.typeVariable("A").build();
        TypeDescription.Generic B_type = TypeDescription.Generic.Builder.typeVariable("B").build();
        TypeDescription.Generic C_type = TypeDescription.Generic.Builder.typeVariable("C").build();

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(A_type, "a")
                .withParameter(B_type, "b")
                .withParameter(C_type, "c")
                .typeVariable("C")
                .intercept(
                        MethodCall.invoke(
                                Object.class.getDeclaredConstructor()
                        )
                );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```
