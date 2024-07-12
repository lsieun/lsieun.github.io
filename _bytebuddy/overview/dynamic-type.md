---
title: "DynamicType"
sequence: "104"
---

## DynamicType 是什么

A **dynamic type** is created at runtime,
usually as the result of applying a `DynamicType.Builder` or as the result of an `AuxiliaryType`.

> DynamicType 表示一个动态生成的类。

## 入手点

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

{:refdef: style="text-align: center;"}
![](/assets/images/bytebuddy/from-byte-buddy-to-dynamic-type.png)
{:refdef}

## 处理流程

`DynamicType` 是一个接口，它有三个子接口：

- `Builder` 接口，组织类、字段、方法相关的相关信息。如果调用 `Builder.make()` 方法，它就可以转换成 `Unloaded` 类型。
- `Unloaded` 接口，代表着未被 ClassLoader 加载的类。如果调用 `Unloaded.load()` 方法，它就可以转换成 `Loaded` 类型。
- `Loaded` 接口，代表着已经被 ClassLoader 加载的类。如果调用 `Loaded.getLoaded()` 方法，它就可以转换成 `Class` 类型。

处理流程：将三个子接口串连起来。

```text
               ┌─── Builder
               │
DynamicType ───┼─── Unloaded
               │
               └─── Loaded
```

注意，四个类型属于 Java 或 ByteBuddy 的情况：

| Java              | ByteBuddy              |
|-------------------|------------------------|
|                   | `DynamicType.Builder`  |
|                   | `DynamicType.Unloaded` |
|                   | `DynamicType.Loaded`   |
| `java.lang.Class` |                        |

接着，我们可以再进一步延伸到三个子接口的方法（method）层面：

```text
                                                                   ┌─── name()
                                                                   │
                                               ┌─── class ─────────┼─── modifiers()
                                               │                   │
                                               │                   └─── implement()
                                               │
                                               │                   ┌─── defineField()
                                               │                   │
                                               ├─── field ─────────┼─── define()
                                               │                   │
                                               │                   └─── serialVersionUid()
                                ┌─── input ────┤
                                │              │                   ┌─── defineConstructor()
                                │              ├─── constructor ───┤
                                │              │                   └─── define()
                                │              │
                                │              │                   ┌─── defineMethod()
                                │              │                   │
               ┌─── Builder ────┤              │                   ├─── define()
               │                │              │                   │
               │                │              └─── method ────────┼─── defineProperty()
               │                │                                  │
               │                │                                  ├─── withHashCodeEquals()
               │                │                                  │
               │                │                                  └─── withToString()
               │                │
DynamicType ───┤                └─── output ───┼─── make(): DynamicType.Unloaded
               │
               │                ┌─── input ────┼─── include()
               ├─── Unloaded ───┤
               │                └─── output ───┼─── load(): DynamicType.Loaded
               │
               │                               ┌─── getLoaded(): Class
               │                               │
               └─── Loaded ─────┼─── output ───┼─── getLoadedAuxiliaryTypes(): Map
                                               │
                                               └─── getAllLoaded(): Map
```

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
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();


        // 第二步，生成类
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

## AuxiliaryType

平常的情况，一个类就能独立存在，不需要依赖其它的类型：

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

在有些情况下，一个类与其它类之间有关联关系：

```java
public class OuterClass {

    public class FirstInnerClass {
    }

    public class SecondInnerClass {
    }
}
```

`OuterClass` 类与 `FirstInnerClass` 和 `SecondInnerClass` 内部类有关联。
我们可以将 `OuterClass` 类看成主要的类，而 `FirstInnerClass` 和 `SecondInnerClass` 内部类可以看成是辅助类（AuxiliaryType）。

大多数情况下，辅助类（AuxiliaryType）是由 ByteBuddy 帮助我们生成的。当然，我们也可以自己添加辅助类（AuxiliaryType）。

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ClassLoadingStrategy;

import java.util.Map;

public class HelloWorldByteBuddy {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String outerClassName = "sample.OuterClass";
        String innerClassName1 = "sample.OuterClass$FirstInnerClass";
        String innerClassName2 = "sample.OuterClass$SecondInnerClass";
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();

        DynamicType.Builder<Object> outerBuilder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(outerClassName);
        DynamicType.Builder<Object> innerBuilder1 = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(innerClassName1);
        DynamicType.Builder<Object> innerBuilder2 = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(innerClassName2);

        innerBuilder1 = innerBuilder1.innerTypeOf(outerBuilder.toTypeDescription()).asMemberType();
        innerBuilder2 = innerBuilder2.innerTypeOf(outerBuilder.toTypeDescription()).asMemberType();
        outerBuilder = outerBuilder.declaredTypes(innerBuilder1.toTypeDescription(), innerBuilder2.toTypeDescription());


        // 第三步，Builder --> Unloaded
        DynamicType.Unloaded<?> unloadedType = outerBuilder.make().include(innerBuilder1.make(), innerBuilder2.make());
        OutputUtils.save(unloadedType);


        // 第四步，Unloaded --> Loaded
        DynamicType.Loaded<?> loadType = unloadedType.load(classLoader, ClassLoadingStrategy.Default.CHILD_FIRST);
        Map<TypeDescription, byte[]> auxiliaryTypes = loadType.getAuxiliaryTypes();
        for (Map.Entry<TypeDescription, byte[]> entry : auxiliaryTypes.entrySet()) {
            System.out.println(entry.getKey());
        }
    }
}
```

输出结果：

```text
class sample.OuterClass$FirstInnerClass
class sample.OuterClass$SecondInnerClass
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

