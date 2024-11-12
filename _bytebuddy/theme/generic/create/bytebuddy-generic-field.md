---
title: "字段：A、A[]、List<? extends Number>"
sequence: "104"
---

## 示例

## 示例: A

```java
public class HelloWorld<A, B> {
    private A value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

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

        builder = builder.defineField("value", A_type, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 示例: A[]

```java
public class HelloWorld<A, B> {
    private A[] value;
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;

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
        TypeDescription.Generic arrayOfA = TypeDescription.Generic.Builder.of(A_type).asArray().build();
        builder = builder.defineField("value", arrayOfA, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 示例：List<? extends Number>

```java
import java.util.List;

public class HelloWorld<A, B> {
    private List<? extends Number> value;
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
                .name(className);

        builder = builder.typeVariable("A").typeVariable("B");

        TypeDescription.Generic wildcardOfUpperBound = TypeDescription.Generic.Builder.rawType(Number.class).asWildcardUpperBound();
        TypeDescription listType = TypeDescription.ForLoadedType.of(List.class);
        TypeDescription.Generic listOfWildcard = TypeDescription.Generic.Builder.parameterizedType(listType, wildcardOfUpperBound).build();
        builder = builder.defineField("value", listOfWildcard, Visibility.PRIVATE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

其中，`rawType` 替换成 `of` 方法，也能运行：（我还不知道两者的区别）

```text
TypeDescription.Generic wildcardOfUpperBound = TypeDescription.Generic.Builder.of(Number.class).asWildcardUpperBound();
```
