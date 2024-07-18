---
title: "生成类"
sequence: "105"
---

## 类层面信息

类层面的信息，主要通过三个方法提供：

- `name()`: 类的名字。
- `modifiers()`: 类的修饰符，例如 `public`、`protected`、`private`、`static`、`final` 等。
- `implement()`：类实现的接口。

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
DynamicType.Builder ───┤              │                   ├─── define()
                       │              │                   │
                       │              └─── method ────────┼─── defineProperty()
                       │                                  │
                       │                                  ├─── withHashCodeEquals()
                       │                                  │
                       │                                  └─── withToString()
                       │
                       └─── output ───┼─── make(): DynamicType.Unloaded
```

对于一个类来说，它的修饰符：

```text
                                                                      ┌─── PUBLIC
                                                                      │
                                            ┌─── Visibility ──────────┼─── PROTECTED
                                            │                         │
                                            │                         └─── PRIVATE
                                            │
                                            ├─── Ownership ───────────┼─── STATIC
                                            │
                                            │                         ┌─── FINAL
                                            │                         │
net.bytebuddy.description.modifier: type ───┤                         ├─── ABSTRACT
                                            ├─── TypeManifestation ───┤
                                            │                         ├─── INTERFACE
                                            │                         │
                                            │                         └─── ANNOTATION
                                            │
                                            ├─── EnumerationState ────┼─── ENUMERATION
                                            │
                                            └─── SyntheticState ──────┼─── SYNTHETIC
```

## 示例

### 普通类

预期目标：

```java
public final class HelloWorld {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.TypeManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, TypeManifestation.FINAL)
                .name(className);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

`modifiers()` 也可以接收 `Opcodes.ACC_PUBLIC` 等内容：

```text
modifiers(Opcodes.ACC_PUBLIC | Opcodes.ACC_FINAL)
```

### 抽象类

生成抽象类，需要在 `modifier()` 中添加 `abstract` 修改符（`TypeManifestation.ABSTRACT`）。

```java
public abstract class HelloWorld {
    public abstract void test();
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.TypeManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, TypeManifestation.ABSTRACT)
                .name(className);

        builder = builder.defineMethod("test", void.class, Visibility.PUBLIC)
                .withoutCode();


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 添加接口

添加接口，需要调用 `Dynamic.Builder` 的 `implement()` 方法。

预期目标：

```java
public class HelloWorld implements Cloneable, Serializable {
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

import java.io.Serializable;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .implement(Cloneable.class, Serializable.class);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 总结

本文内容总结如下：

- 类层面信息，需要考虑该类的名字（`name()`）、修饰符（`modifiers()`）和实现的接口（`implement()`）信息。

其它类型，例如接口、注解、枚举、Record 会在以后的内容介绍。

