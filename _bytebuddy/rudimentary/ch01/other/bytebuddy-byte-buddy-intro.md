---
title: "ByteBuddy"
sequence: "101"
---

## ByteBuddy

The ByteBuddy class serves as a focus point for **configuration** of the library's behavior and
as an entry point to any form of code generation using the library.

### Function

从 `ByteBuddy` 获取一个 `DynamicType.Builder` 对象：

```text
ByteBuddy --> DynamicType.Builder
```

```text
             ┌─── subclass ───┼─── DynamicType.Builder
             │
ByteBuddy ───┼─── redefine ───┼─── DynamicType.Builder
             │
             └─── rebase ─────┼─── DynamicType.Builder
```

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Unloaded<Object> unloadedType = byteBuddy.subclass(Object.class).make();
        byte[] bytes = unloadedType.getBytes();

        String filePath = FileUtils.getFilePath("sample/Test.class");
        FileUtils.writeBytes(filePath, bytes);
    }
}
```

```java

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Unloaded<Object> unloadedType = byteBuddy.subclass(Object.class).name("sample.Test").make();
        byte[] bytes = unloadedType.getBytes();

        String filePath = FileUtils.getFilePath("sample/Test.class");
        FileUtils.writeBytes(filePath, bytes);
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.FixedValue;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Unloaded<Object> unloadedType = byteBuddy.subclass(Object.class)
                .method(ElementMatchers.isToString())
                .intercept(FixedValue.value("Hello World ByteBuddy"))
                .make();
    }
}
```

### Immutability

As a matter of fact, almost every class that lives in the Byte Buddy namespace was made immutable.

As an implication of the mentioned **immutability**,
you must be careful when for example configuring `ByteBuddy` instances.

错误示例：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.NamingStrategy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        // 对比
        byteBuddy.with(new NamingStrategy.SuffixingRandom("suffix"));
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class);
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

正确示例：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.NamingStrategy;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        ByteBuddy byteBuddy = new ByteBuddy();
        // 对比
        byteBuddy = byteBuddy.with(new NamingStrategy.SuffixingRandom("suffix"));
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class);
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

```text
net.bytebuddy.renamed.java.lang.Object$suffix$JiEnjF7u
```
