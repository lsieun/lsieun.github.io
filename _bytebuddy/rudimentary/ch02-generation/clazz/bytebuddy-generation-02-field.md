---
title: "生成字段：defineField()"
sequence: "102"
---

## 字段信息

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
                       ┌─── input ────┤                   └─── simplify ────────┼─── serialVersionUid()
                       │              │
                       │              │                   ┌─── defineConstructor()
                       │              ├─── constructor ───┤
                       │              │                   └─── define()
                       │              │
                       │              │                   ┌─── defineMethod()
                       │              │                   │
DynamicType.Builder ───┤              │                   ├─── define()
                       │              └─── method ────────┤
                       │                                  │                      ┌─── defineProperty()
                       │                                  │                      │
                       │                                  └─── simplify ─────────┼─── withHashCodeEquals()
                       │                                                         │
                       │                                                         └─── withToString()
                       │
                       └─── output ───┼─── make(): DynamicType.Unloaded
```

### defineField

`DynamicType.Builder.defineField()` 方法有两种常用的形式：

- `defineField(String name, Type type, ModifierContributor.ForField... modifierContributor)`
- `defineField(String name, Type type, int modifiers)`

- 第一个参数 `name`，表示字段的名称；
- 第二个参数 `type`，表示字段的类型；
- 第三个参数 `modifiers`，表示字段的修饰符（`public`、`protected`、`private`、`static` 等）。

```text
builder = builder.defineField(
        "xxx",
        String.class,
        Visibility.PRIVATE
);
```

### 访问标识

对于字段来说，它可用的修饰符有：

```text
                                                                        ┌─── PUBLIC
                                                                        │
                                             ┌─── Visibility ───────────┼─── PROTECTED
                                             │                          │
                                             │                          └─── PRIVATE
                                             │
                                             ├─── Ownership ────────────┼─── STATIC
                                             │
                                             │                          ┌─── FINAL
                                             ├─── FieldManifestation ───┤
net.bytebuddy.description.modifier: field ───┤                          └─── VOLATILE
                                             │
                                             ├─── EnumerationState ─────┼─── ENUMERATION
                                             │
                                             ├─── FieldPersistence ─────┼─── TRANSIENT
                                             │
                                             ├─── Mandate ──────────────┼─── MANDATED
                                             │
                                             └─── SyntheticState ───────┼─── SYNTHETIC
```

## 示例

### 一个字段

预期目标：

```java
public class HelloWorld {
    private String name;
}
```

编码实现：

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

        builder = builder.defineField(
                "name",
                String.class,
                Visibility.PRIVATE
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### 多个字段

预期目标：

```java
import java.util.Date;

public class HelloWorld {
    private String name;
    protected int age;
    public Date birthDay;
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

import java.util.Date;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField(
                "name",
                String.class,
                Visibility.PRIVATE
        ).defineField(
                "age",
                int.class,
                Visibility.PROTECTED
        ).defineField(
                "birthDay",
                Date.class,
                Visibility.PUBLIC
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 扩展

### serialVersionUID

预期目标：

```java
public class HelloWorld {
    private static final long serialVersionUID = 123456789L;
}
```

编码实现（一）：

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

        builder = builder.serialVersionUid(123456789L);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

编码实现（二）：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.FieldManifestation;
import net.bytebuddy.description.modifier.Ownership;
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

        builder = builder.defineField(
                "serialVersionUID",
                long.class,
                Visibility.PRIVATE,
                Ownership.STATIC,
                FieldManifestation.FINAL
        ).value(123456789L);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

在 `DynamicType.Builder` 当中，定义了 `serialVersionUid()` 方法来直接添加 `serialVersionUID` 字段：

```text
builder = builder.serialVersionUid(123456789L);
```

## 常量字段：value() 方法

`value()` 方法，适合于定义常量（`static` 和 `final` 修饰的字段）。该方法支持 6 种类型的参数：

- `boolean`
- `int`
- `long`
- `float`
- `double`
- `String`

使用场景：

- 适合于 `static` 字段，更进一步，更适合于 `static` 和 `final` 修饰的字段。
- 不适合于 non-static 字段。如果 `value()` 方法应用在 non-static 字段上，那么“没有效果”。“没有效果”表示“会记录 ConstantValue 属性，但是想获取字段值的时候，又获取不到”。

### static + final

预期目标：

```java
public class HelloWorld {
    public static final String str = "人有善愿，天必佑之";
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.FieldManifestation;
import net.bytebuddy.description.modifier.Ownership;
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

        builder = builder.defineField(
                "str",
                String.class,
                Visibility.PUBLIC,
                Ownership.STATIC,
                FieldManifestation.FINAL
        ).value("人有善愿，天必佑之");


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

### static + non-final

预期目标：

```java
public class HelloWorld {
    public static String str = "人有善愿，天必佑之";
}
```

### non-static + final

预期目标：

```java
public class HelloWorld {
    public final String str = "人有善愿，天必佑之";
}
```

```text
$ javap -v -p sample.HelloWorld
  public final java.lang.String str;
    descriptor: Ljava/lang/String;
    flags: ACC_PUBLIC, ACC_FINAL
    ConstantValue: String 人有善愿，天必佑之
```

### non-static + non-final

预期目标：

```java
public class HelloWorld {
    public String str = "人有善愿，天必佑之";
}
```

## Opcodes

在使用 `DynamicType.Builder.defineField()` 方法时，第三个参数可以接收 `int` 类型的值：

```text
FieldDefinition.Optional.Valuable<T> defineField(String name, Type type, int modifiers)
```

我们可以使用 `net.bytebuddy.jar.asm.Opcodes` 接口来添加访问标识：

```java
package net.bytebuddy.jar.asm;

public interface Opcodes {
    int ACC_PUBLIC = 0x0001; // class, field, method
    int ACC_PRIVATE = 0x0002; // class, field, method
    int ACC_PROTECTED = 0x0004; // class, field, method
    int ACC_STATIC = 0x0008; // field, method
    int ACC_FINAL = 0x0010; // class, field, method, parameter
    int ACC_SUPER = 0x0020; // class
    int ACC_SYNCHRONIZED = 0x0020; // method
    int ACC_OPEN = 0x0020; // module
    int ACC_TRANSITIVE = 0x0020; // module requires
    int ACC_VOLATILE = 0x0040; // field
    int ACC_BRIDGE = 0x0040; // method
    int ACC_STATIC_PHASE = 0x0040; // module requires
    int ACC_VARARGS = 0x0080; // method
    int ACC_TRANSIENT = 0x0080; // field
    int ACC_NATIVE = 0x0100; // method
    int ACC_INTERFACE = 0x0200; // class
    int ACC_ABSTRACT = 0x0400; // class, method
    int ACC_STRICT = 0x0800; // method
    int ACC_SYNTHETIC = 0x1000; // class, field, method, parameter, module *
    int ACC_ANNOTATION = 0x2000; // class
    int ACC_ENUM = 0x4000; // class(?) field inner
    int ACC_MANDATED = 0x8000; // field, method, parameter, module, module *
    int ACC_MODULE = 0x8000; // class
}
```

编码实现：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.jar.asm.Opcodes;

public class HelloWorldSubClass {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);

        builder = builder.defineField(
                "serialVersionUID",
                long.class,
                Opcodes.ACC_PRIVATE | Opcodes.ACC_STATIC | Opcodes.ACC_FINAL
        ).value(123456789L);


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

## 总结

本文内容总结如下：

- 字段信息，需要调用 `DynamicType.Builder.defineField()` 方法，该方法参数有字段名称、类型和修饰符。

```text
defineField(String name, Type type, ModifierContributor.ForField... modifierContributor)
defineField(String name, Type type, int modifiers)
```
