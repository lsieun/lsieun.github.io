---
title: "DynamicType 介绍"
sequence: "103"
---

## 是什么

## 获取 DynamicType 对象

得到一个具体的 `ByteBuddy` 实例之后，我们接下来要考虑的事情：**如何使用 `ByteBuddy` 实例生成一个 `.class` 文件**。

在 `ByteBuddy` 中，生成类的方式有三种：

- subclass （目前只考虑这种方式）
- redefine
- rebase

```text
// 简单的形式
public <T> DynamicType.Builder<T> subclass(Class<T> superType)
public DynamicType.Builder<?> subclass(Type superType)
public DynamicType.Builder<?> subclass(TypeDefinition superType)

// 复杂的形式
public <T> DynamicType.Builder<T> subclass(Class<T> superType, ConstructorStrategy constructorStrategy)
public DynamicType.Builder<?> subclass(Type superType, ConstructorStrategy constructorStrategy)

// 复杂 + 最终的形式
public DynamicType.Builder<?> subclass(TypeDefinition superType, ConstructorStrategy constructorStrategy)
```

![](/assets/images/bytebuddy/from-byte-buddy-to-dynamic-type.png)

## 代码示例

### 预期目标

```java
public class HelloWorld implements Serializable, Cloneable {
    private String name;
    private int age;
    private static final long serialVersionUID = 1L;

    public HelloWorld() {
    }

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void test() {
        System.out.println("Hello World");
    }
}
```

### 编码实现

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;
import net.bytebuddy.implementation.FieldAccessor;
import net.bytebuddy.implementation.MethodCall;

import java.io.PrintStream;
import java.io.Serializable;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class);

        builder = builder.modifiers(Visibility.PUBLIC)
                .name(className)
                .implement(Serializable.class, Cloneable.class);

        builder = builder.defineField("name", String.class, Visibility.PRIVATE);
        builder = builder.defineField("age", int.class, Visibility.PRIVATE);
        builder = builder.serialVersionUid(1L);

        builder = builder.defineConstructor(Visibility.PUBLIC)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .intercept(
                        MethodCall.invoke(
                                Object.class.getDeclaredConstructor()
                        ).andThen(
                                FieldAccessor.ofField("name").setsArgumentAt(0)
                        ).andThen(
                                FieldAccessor.ofField("age").setsArgumentAt(1)
                        )
                );

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .intercept(
                        MethodCall.invoke(
                                        PrintStream.class.getDeclaredMethod("println", String.class)
                                )
                                .onField(
                                        System.class.getDeclaredField("out")
                                )
                                .with("Hello World")
                );

        // builder = builder.withHashCodeEquals();
        // builder = builder.withToString();


        // 第三步，Builder --> Unloaded
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);

        // 第四步，Unloaded --> Loaded
        DynamicType.Loaded<?> loadType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST);

        // 第五步，Loaded --> Class
        Class<?> clazz = loadType.getLoaded();
        System.out.println(clazz);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，`DynamicType` 是什么？ `DynamicType` 表示动态生成的类。
- 第二点，`DynamicType` 的入手点在哪儿？**`ByteBuddy.subclass()` 方法会返回一个 `DynamicType.Builder` 对象**。
- 第三点，`DynamicType` 的后续怎么展开呢？**`DynamicType` 的三个子接口：`Builder`（生成过程）、`Unloaded`（未加载）和 `Loaded`（已经加载）**。
    - `Builder` 是我们后续学习的重点，它定义的方法很多。
    - `Unloaded` 和 `Loaded` 相对来说，比较简单，定义的方法也少。
- 第四点，在 `DynamicType` 类中，也会涉及到辅助类型（AuxiliaryType）。
    - 我们只需要知道它是什么就可以了，不需要深入探究；
    - 在大多数情况下，ByteBuddy 帮助我们生成辅助类型（AuxiliaryType）。


