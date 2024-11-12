---
title: "常见的错误检查"
sequence: "102"
---

## 错误一：不可变

**Byte Buddy's API** is expressed by fully **immutable components**.

在 ByteBuddy API 当中，整体上各个类是“不可变”的；
也正是因为“不可变”的特性，可能造成在编码的时候有一些易出现的错误。

### ByteBuddy 层面

预期目标：生成 Java 11 版本的 `.class` 文件

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.ClassFileVersion;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        byteBuddy.with(ClassFileVersion.JAVA_V11);    // 错误之处
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

正确的写法：

```text
byteBuddy = byteBuddy.with(ClassFileVersion.JAVA_V11);
```

### Builder 层面

预期目标：添加一个 `test` 方法

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.StubMethod;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder.defineMethod("test", String.class, Visibility.PUBLIC) // 错误之处
                .intercept(StubMethod.INSTANCE);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

正确写法：

```text
builder = builder.defineMethod("test", String.class, Visibility.PUBLIC)
        .intercept(StubMethod.INSTANCE);
```

## 总结

本文内容总结如下：

- 第一点，在 ByteBuddy API 中，“不可变”的特性可能会生成一些易出现的错误。
