---
title: "生成类"
sequence: "101"
---

## 类层面信息

```java
import java.io.Serializable;

public class HelloWorld extends Object implements Cloneable, Serializable {
}
```

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
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, TypeManifestation.FINAL)
                .name(className);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

<br/>
<br/>

---

<br/>
<br/>

TIPS: `modifiers()` 方法也可以接收 `Opcodes.ACC_PUBLIC` 等内容：

```text
modifiers(Opcodes.ACC_PUBLIC | Opcodes.ACC_FINAL)
```

其中，`Opcodes` 来自于 ASM 类库；而 ByteBuddy 是在 ASM 基础上搭建的。
- 如果我们熟悉 ASM，就可以 `Opcodes` 定义的常量；
- 如果我们不熟悉 ASM，就可以忽略这种方式。

### 抽象类

生成抽象类，需要在 `modifier()` 中添加 `abstract` 修改符（`TypeManifestation.ABSTRACT`）。

预期目标：

```java
public abstract class HelloWorld {
    protected abstract void test(String name, int age);
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.MethodManifestation;
import net.bytebuddy.description.modifier.TypeManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, TypeManifestation.ABSTRACT)
                .name(className);

        // 常见错误：省略 ”builder =“ 部分 
        builder = builder.defineMethod("test", void.class, Visibility.PROTECTED, MethodManifestation.ABSTRACT)
                .withParameter(String.class, "name")
                .withParameter(int.class, "age")
                .withoutCode();


        // 3. output
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
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className)
                .implement(Cloneable.class, Serializable.class);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```


## 总结

本文内容总结如下：

- 类层面信息，需要考虑该类的名字（`name()`）、修饰符（`modifiers()`）和实现的接口（`implement()`）信息。

其它类型，例如接口、注解、枚举、Record 会在以后的内容介绍。

